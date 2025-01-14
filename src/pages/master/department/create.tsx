import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// components
import PageTitle from "../../../components/PageTitle";
import FileUploader from "../../../components/FileUploader";
import { FormInput } from "../../../components";
import showToast from "../../../helpers/toast";
import { useNavigate, useParams } from "react-router-dom";
import apiServices from "../../../services/apiServices";
import CustomButton from "../../../components/CustomButton";
import { convertToBase64, isBase64Image } from "../../../helpers/base64";
import CardImage from "../../../components/cardImage";

const DepartmentForm = () => {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [image, setImage] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            setIsEdit(true);
            fetchItemDetails();
        }
    }, [id]);



    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required("Silakan masukkan Nama"),
            description: yup.string().required("Silakan masukkan Deskripsi"),
        })
    );



    // react-hook-form setup


    // Fetch item details and set form values
    const fetchItemDetails = async () => {
        try {
            setLoading(true);
            const response = await apiServices.getData(`departments/${id}`, {}, true);
            const data = response.data.data;
            // Set the form values with the fetched data
            setInitialData(data);
            setValue("name", data.name);
            setValue("description", data.description);
            setImage(data.image);
            setLoading(false);
        } catch (error) {

            showToast("error", "An error occurred while fetching data");
        } finally {
            setLoading(false);
        }
    };
    const methods = useForm({ resolver: schemaResolver });
    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
    } = methods;

    const onSubmit = async (data: any) => {
        try {
            const body = data;
            body.image = image;
            if (!isBase64Image(body.image) && !isEdit) {
                showToast("error", "Invalid image");
                return;
            }
            setLoading(true);
            if (isEdit) {
                await apiServices
                    .patchData(`departments/${id}`, body)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/departments');
                    })
                    .catch((error) => {
                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            } else {
                await apiServices
                    .postData('departments', body, {},)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/departments');
                    })
                    .catch((error) => {
                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            }
        } catch (error) {
            setLoading(false);
        }
    };
    return (
        <>
            <React.Fragment>
                <PageTitle
                    breadCrumbItems={[
                        { label: "Department", path: "/master/departments" },
                        { label: isEdit ? "Ubah Department" : "Tambah Department", path: "/master/departments", active: true },
                    ]}
                    title={isEdit ? "Ubah Department" : "Tambah Department"}
                />

                <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                    <Row>
                        <Card>
                            <Card.Body>
                                {/* Name Input */}
                                <FormInput
                                    name="name"
                                    label="Name"
                                    placeholder="Enter name"
                                    containerClass="mb-3"
                                    register={register}
                                    key="name"
                                    errors={errors}
                                    control={control}
                                />
                                {/* Description Input */}
                                <FormInput
                                    name="description"
                                    label="Description"
                                    placeholder="Enter description"
                                    containerClass="mb-3"
                                    register={register}
                                    key="description"
                                    errors={errors}
                                    type="textarea"
                                    control={control}
                                />

                                {/* Image Upload */}
                                <FileUploader
                                    showPreview={true}
                                    onFileUpload={async (files) => {
                                        if (files.length > 0) {
                                            const image = await convertToBase64(files[0]);
                                            setImage(image);
                                        }
                                    }}
                                />

                                {/* Display Existing Image */}
                                {isEdit && !isBase64Image(image) ? (
                                    <CardImage
                                        images={[image]}
                                        preview={true}
                                    />
                                ) : null}

                            </Card.Body>
                        </Card>
                    </Row>
                    <CustomButton type="submit" label="Simpan" loading={loading} />
                </form>
            </React.Fragment>

        </>
    );
}


export default DepartmentForm;
