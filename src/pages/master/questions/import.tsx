import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { VerticalForm, FormInput } from "../../../components";
import SelectInput from "../../../components/FormSelect";
import { QuestionType } from "../../../config/constant-cms";
import { useForm } from "react-hook-form";
import FileUploader from "../../../components/FileUploader";
import { TopicInterface } from "../../../types/topics";
import apiServices from "../../../services/apiServices";
import showToast from "../../../helpers/toast";
import readXlsxFile from "read-excel-file"; // Import Excel reader

interface ImportQuestionProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (value: any) => void;
}

const ImportQuestion = ({ show, onHide, onSubmit }: ImportQuestionProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [topicList, setTopicList] = useState<TopicInterface[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string>("");

    const schemaResolver = yupResolver(
        yup.object().shape({
            question_type: yup.string().required("Pilih Tipe Soal"),
        })
    );

    const methods = useForm({ resolver: schemaResolver });
    const {
        handleSubmit,
        register,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = methods;

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await apiServices.getData("topics-pluck", {}, true);
            if (response.status === 200) {
                setTopicList(response.data.data);
            } else {
                setTopicList([]);
            }
        } catch (error) {
            setTopicList([]);
        }
    };

    const handleFileUpload = async (files: File[]) => {
        if (files.length > 0) {
            const uploadedFile = files[0];
            const allowedExtensions = ["xls", "xlsx", "csv"];
            const fileExtension = uploadedFile.name.split(".").pop()?.toLowerCase();

            if (fileExtension && allowedExtensions.includes(fileExtension)) {
                setFile(uploadedFile);
            } else {
                setFile(null);
                showToast("error", "File tidak didukung (hanya .xls, .xlsx, .csv)");
            }
        }
    };

    const handleImportSubmit = async (value: any) => {
        if (!file) {
            showToast("error", "Pilih file terlebih dahulu!");
            return;
        }
        const allowedExtensions = ["xls", "xlsx", "csv"];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            showToast("error", "File tidak didukung (hanya .xls, .xlsx, .csv)");
            return;
        }


        try {
            const rows = await readXlsxFile(file);
            const formattedData = rows.slice(1).map((row: any) => {
                const options: string[] = row[1].split('|') || []; // Split options using '|'
                return {
                    question: row[0],
                    options: JSON.stringify(options), // Store as an array
                    correctAnswer: row[2], // Directly fetch correct answer
                };
            });

            const payload = {
                question_type: getValues("question_type"),
                topic_id: selectedTopic,
                questions: JSON.stringify(formattedData),
            };
            const response = await apiServices.postData("questions-imports", payload, {}, true);
            if (response.status === 201) {
                showToast("success", "Import berhasil!");
                onSubmit(response.data);
                onHide();
            } else {
                showToast("error", "Gagal mengimport data!");
            }
        } catch (error) {
            showToast("error", "Terjadi kesalahan saat membaca file!");
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header className="bg-light" closeButton>
                    <Modal.Title>Import Question</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <VerticalForm onSubmit={handleImportSubmit} resolver={schemaResolver}>
                        <SelectInput
                            name="question_type"
                            label="Tipe Pertanyaan"
                            options={QuestionType.map((data) => ({
                                value: data.value,
                                label: data.label,
                            }))}
                            control={control}
                            containerClass="mb-3"
                            errors={errors}
                            defaultValue={register("question_type").name || ""}
                            onChange={(selectedValue) => setValue("question_type", selectedValue)}
                            placeholder="Pilih Tipe Pertanyaan"
                        />
                        <SelectInput
                            name="topic_id"
                            label="Topik"
                            options={topicList.map((data) => ({
                                value: String(data.id),
                                label: data.name || "",
                            }))}
                            className="mb-3"
                            defaultValue={selectedTopic}
                            onChange={(selectedValue) => setSelectedTopic(selectedValue)}
                            placeholder="Pilih Topik"
                        />
                        <FileUploader showPreview={true} onFileUpload={handleFileUpload} />

                        <div className="text-end">
                            <Button variant="success" type="submit" className="me-1">
                                Import
                            </Button>
                            <Button variant="danger" onClick={onHide}>
                                Batal
                            </Button>
                        </div>
                    </VerticalForm>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ImportQuestion;
