import React from "react";
import { Modal, Button } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { VerticalForm, FormInput } from "../../../components";
import SelectInput from "../../../components/FormSelect";
import { QuestionType } from "../../../config/constant-cms";
import { useForm } from "react-hook-form";
import FileUploader from "../../../components/FileUploader";

// components


interface ImportQuestionProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (value: any) => void;
}

const ImportQuestion = ({ show, onHide, onSubmit }: ImportQuestionProps) => {
    const [file, setFile] = React.useState('');
    /*
      form validation schema
      */
    const schemaResolver = yupResolver(
        yup.object().shape({
            queston_type: yup.string().required("Pilih Tipe Soal"),
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

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="bg-light" onHide={onHide} closeButton>
                    <Modal.Title className="m-0">Import Question</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                        <SelectInput
                            name="question_type"
                            label="Tipe Pertanyaan"
                            options={QuestionType.map((data: {
                                value: string;
                                label: string;
                            }) => ({
                                value: data.value,
                                label: data.label, // Maps data.name to the "label"
                            }))}
                            control={control}
                            containerClass="mb-3"
                            errors={errors}
                            defaultValue={register("question_type").name || null}
                            onChange={(selectedValue) => {
                                setValue("question_type", selectedValue);
                            }}
                            placeholder="Pilih Type Pertanyaan"
                        />
                        <FileUploader
                            showPreview={true}
                            onFileUpload={async (files) => {
                                if (files.length > 0) {
                                    const file = files[0];
                                    setFile(file.name);
                                }
                            }}
                        />

                        <div className="text-end">
                            <Button
                                variant="success"
                                type="submit"
                                className="waves-effect waves-light me-1"
                            >
                                Save
                            </Button>
                            <Button
                                variant="danger"
                                className="waves-effect waves-light"
                                onClick={onHide}
                            >
                                Continue
                            </Button>
                        </div>
                    </VerticalForm>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ImportQuestion;
