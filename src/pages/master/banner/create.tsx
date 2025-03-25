import React, { useEffect, useState } from "react";
import { Row, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Components
import PageTitle from "../../../components/PageTitle";
import FileUploader from "../../../components/FileUploader";
import { FormInput } from "../../../components";
import showToast from "../../../helpers/toast";
import { useNavigate, useParams } from "react-router-dom";
import apiServices from "../../../services/apiServices";
import CustomButton from "../../../components/CustomButton";
import { convertToBase64, isBase64Image } from "../../../helpers/base64";
import CardImage from "../../../components/cardImage";
import SelectInput from "../../../components/FormSelect";
import { BannerType } from "../../../config/constant-cms";

const BannerForm = () => {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState("");
    const [initialData, setInitialData] = useState<any>(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            fetchItemDetails();
        }
    }, [id]);

    // Validation Schema
    const schemaResolver = yupResolver(
        yup.object().shape({
            title: yup.string().required("Silakan masukkan Judul"),
            type: yup.string().required("Silakan masukkan Tipe"),
            description: yup.string().required("Silakan masukkan Deskripsi"),
        })
    );

    // Fetch item details and set form values
    const fetchItemDetails = async () => {
        try {
            setLoading(true);
            const response = await apiServices.getData(`banners/${id}`, {}, true);
            const data = response.data.data;
            // Set the form values with the fetched data
            setInitialData(data);
            setValue("title", data.title);
            setValue("type", data.type);
            setValue("description", data.description);
            setImage(data.image);
            setLoading(false);
        } catch (error) {
            showToast("error", "An error occurred while fetching data");
        } finally {
            setLoading(false);
        }
    };

    // React Hook Form setup
    const methods = useForm({ resolver: schemaResolver });
    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
    } = methods;

    // Form submission handler
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
                    .patchData(`banners/${id}`, body, {}, true)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/banners');
                    })
                    .catch((error) => {
                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            } else {
                await apiServices
                    .postData('banners', body, {}, true)
                    .then((response) => {

                        showToast('success', response.data.message);
                        navigate('/master/banners');
                    })
                    .catch((error) => {
                        console.log(error)
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
                        { label: "Banner", path: "/master/banners" },
                        { label: isEdit ? "Ubah Banner" : "Tambah Banner", path: "/master/banners", active: true },
                    ]}
                    title={isEdit ? "Ubah Banner" : "Tambah Banner"}
                />

                <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                    <Row>
                        <Card>
                            <Card.Body>
                                {/* Title Input */}
                                <FormInput
                                    name="title"
                                    label="Judul"
                                    placeholder="Masukkan Judul"
                                    containerClass="mb-3"
                                    register={register}
                                    key="title"
                                    errors={errors}
                                    control={control}
                                />

                                {/* Type Input */}
                                <SelectInput
                                    name="type"
                                    label="Tipe Produk"
                                    options={BannerType.map((data: { value: string; label: string }) => ({
                                        value: data.value,
                                        label: data.label,
                                    }))}
                                    control={control}
                                    containerClass="mb-3"
                                    errors={errors}
                                    defaultValue={initialData?.type || null}
                                    onChange={(selectedValue) => {
                                        setValue("type", selectedValue);
                                    }}
                                    placeholder="Pilih Type Produk"
                                />

                                {/* Description Input */}
                                <FormInput
                                    name="description"
                                    label="Deskripsi"
                                    placeholder="Masukkan Deskripsi"
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
};

export default BannerForm;