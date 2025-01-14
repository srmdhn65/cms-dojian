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
import SelectInput from "../../../components/FormSelect";
import showToast from "../../../helpers/toast";
import { useNavigate, useParams } from "react-router-dom";
import apiServices from "../../../services/apiServices";
import CustomButton from "../../../components/CustomButton";
import { convertToBase64, isBase64Image } from "../../../helpers/base64";
import CardImage from "../../../components/cardImage";

const BadgeForm = () => {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [icon, setIcon] = useState("");
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
            name: yup.string().required("Please enter Name"),
            description: yup.string().required("Please enter Description"),
        })
    );

    // react-hook-form setup


    // Fetch item details and set form values
    const fetchItemDetails = async () => {
        try {
            setLoading(true);
            const response = await apiServices.getData(`badges/${id}`, {}, true);
            const data = response.data.data;
            // Set the form values with the fetched data
            setInitialData(data);
            setValue("name", data.name);
            setValue("description", data.description);
            setIcon(data.icon);
            // setValue("icon", data.icon);
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
            body.icon = icon;
            if (!isBase64Image(body.icon) && !isEdit) {
                showToast("error", "Invalid Icon");
                return;
            }
            setLoading(true);
            if (isEdit) {
                await apiServices
                    .patchData(`badges/${id}`, {
                        "name": body.name,
                        "description": body.description,
                        "icon": body.icon ? body.icon : '',
                    },)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/badges');
                    })
                    .catch((error) => {
                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            } else {
                await apiServices
                    .postData('badges', {
                        "name": body.name,
                        "description": body.description,
                        "icon": body.icon
                    }, {},)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/badges');
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
            <PageTitle
                breadCrumbItems={[
                    { label: "Badges", path: "/master/badges" },
                    { label: isEdit ? "Ubah Badges" : "Tambah Badges", path: "/master/badges", active: true },
                ]}
                title={isEdit ? "Ubah Badges" : "Tambah Badges"}
            />

            <form onSubmit={handleSubmit((data) => onSubmit(data))}>

                <Row>
                    <Card>
                        <Card.Body>
                            {/* Name Input */}
                            <FormInput
                                name="name"
                                label="Name"
                                placeholder="e.g.: Apple iMac"
                                containerClass="mb-3"
                                register={register}
                                key="name"
                                errors={errors}
                                control={control}
                            />

                            {/* Email Input */}
                            <FormInput
                                name="description"
                                label="description"
                                placeholder="masukan deskripsi"
                                containerClass="mb-3"
                                register={register}
                                key="description"
                                errors={errors}
                                type="textarea"
                                control={control}
                            />

                            {/* <FormInput
                                name="icon"
                                label="icon"
                                placeholder="Pilih icon"
                                containerClass="mb-3"
                                register={register}
                                key="icon"
                                type="file"
                                errors={errors}
                                control={control}
                            /> */}
                            <FileUploader
                                showPreview={true}

                                onFileUpload={async (files) => {
                                    if (files.length > 0) {
                                        const image = await convertToBase64(files[0])
                                        setIcon(image)
                                    }
                                }}
                            />
                            {
                                isEdit && !isBase64Image(icon) ? (
                                    <CardImage
                                        images={[icon]}
                                        preview={true}
                                    />
                                ) : (
                                    <></>
                                )
                            }

                        </Card.Body>
                    </Card>

                </Row>

                <CustomButton type="submit" label="Simpan" loading={loading} />
            </form>
        </>
    );
}


export default BadgeForm;
