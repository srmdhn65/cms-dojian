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
import ImageCardList from "../../../components/ImageCardList";

const TopicForm = () => {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [imagesUrl, setImagesUrl] = useState<string[]>([])
    const { id, department_id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id !== undefined) {
            setIsEdit(true);
            fetchItemDetails();
        }
    }, [id]);

    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required("Please enter Name"),
            description: yup.string().required("Please enter Description"),
            level: yup.string().required("Please enter Icon"),
            point_cost: yup.string().required("Please enter Point Cost"),
        })
    );



    // react-hook-form setup


    // Fetch item details and set form values
    const fetchItemDetails = async () => {
        try {
            setLoading(true);
            const response = await apiServices.getData(`topics/${id}`, {}, true);
            const data = response.data.data;
            setInitialData(data);
            setValue("name", data.name);
            setValue("description", data.description);
            setValue("level", data.level);
            setValue("point_cost", data.point_cost);
            setImagesUrl(data.images);
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

            setLoading(true);
            body.imagesUrl = imagesUrl;
            body.department_id = department_id;
            const endpoint = isEdit ? `topics/${id}` : 'topics';
            if (isEdit) {
                if (data.imagesUrl && data.imagesUrl.length > 0) {
                    const base64Images = data.imagesUrl.filter((image: string) => isBase64Image(image));
                    data.imagesUrl = base64Images;
                }
                await apiServices
                    .patchData(endpoint, body, {})
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate(`/master/topics/${department_id}`);
                    })
                    .catch((error) => {
                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            } else {
                await apiServices
                    .postData(endpoint, data, {})
                    .then((response) => {
                        showToast('success', 'Berhasil menambahkan data');
                        navigate(`/master/topics/${department_id}`);
                    })
                    .catch((error) => {
                        showToast('error', error);
                    })
                    .finally(() => setLoading(false));
            }
        } catch (error) { }
    };



    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "Topik", path: "/master/topics" },
                    { label: isEdit ? "Ubah Topik" : "Tambah Topik", path: "/master/topics", active: true },
                ]}
                title={isEdit ? "Ubah Topik" : "Tambah Topik"}
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
                            <FormInput
                                name="point_cost"
                                label="Point Cost"
                                placeholder="Masukan point cost"
                                containerClass="mb-3"
                                register={register}
                                type="number"
                                key="point_cost"
                                errors={errors}
                                control={control}
                            />
                            <FormInput
                                name="level"
                                label="Level"
                                placeholder="Masukan Level"
                                containerClass="mb-3"
                                register={register}
                                key="level"
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
                            {/* {
                                isEdit ? (
                                    <img
                                        data-dz-thumbnail=""
                                        className="avatar-sm rounded bg-light"
                                        alt={register('name').name}
                                        src={register('icon').name}
                                    />
                                ) : (
                                    <></>
                                )
                            } */}
                            <FileUploader
                                onFileUpload={async (files) => {
                                    const images: string[] = [];
                                    if (files.length > 0) {
                                        for (const file of files) {
                                            const base64 = await convertToBase64(file);
                                            images.push(base64 as string);
                                        }
                                    }
                                    setImagesUrl(images);
                                }}
                            />
                            {
                                isEdit ? <ImageCardList images={imagesUrl} setImagesUrl={setImagesUrl} /> : (
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


export default TopicForm;
