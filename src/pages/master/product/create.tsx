import React, { useEffect, useState } from "react";
import { Row, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Components
import PageTitle from "../../../components/PageTitle";
import { FormInput } from "../../../components";
import showToast from "../../../helpers/toast";
import { useNavigate, useParams } from "react-router-dom";
import apiServices from "../../../services/apiServices";
import CustomButton from "../../../components/CustomButton";
import SelectInput from "../../../components/FormSelect";
import { ProductType } from "../../../config/constant-cms";

const ProductForm = () => {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [type, setType] = useState("");
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
            type: yup.string().required("Silakan pilih Tipe"),
            price: yup.number().required("Silahkan isi Harga").positive("Harga harus positif"),
            value: yup.string().nullable(),
            // discountPrice: yup.number().nullable().positive("Harga diskon harus positif"),
            // multiplier: yup.number().nullable().positive("Multiplier harus positif"),
            // coins: yup.number().nullable().positive("Jumlah koin harus positif"),
        })
    );

    // Fetch item details and set form values
    const fetchItemDetails = async () => {
        try {
            setLoading(true);
            const response = await apiServices.getData(`products/${id}`, {}, true);
            const data = response.data.data;
            setInitialData(data);
            setValue('price', data.price);
            setValue('type', data.type);
            setType(data.type)
            setValue('value', data.value);
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
            setLoading(true);
            if (isEdit) {
                await apiServices
                    .patchData(`products/${id}`, body, {}, true)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/product');
                    })
                    .catch((error) => {
                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            } else {
                await apiServices
                    .postData('products', body, {}, true)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/product');
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
                        { label: "Produk", path: "/master/product" },
                        { label: isEdit ? "Ubah Produk" : "Tambah Produk", path: "/master/product", active: true },
                    ]}
                    title={isEdit ? "Ubah Produk" : "Tambah Produk"}
                />

                <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                    <Row>
                        <Card>
                            <Card.Body>
                                {/* Type Input */}
                                <SelectInput
                                    name="type"
                                    label="Tipe Produk"
                                    options={ProductType.map((data: { value: string; label: string }) => ({
                                        value: data.value,
                                        label: data.label,
                                    }))}
                                    control={control}
                                    containerClass="mb-3"
                                    errors={errors}
                                    defaultValue={initialData?.type || null}
                                    onChange={(selectedValue) => {
                                        setValue("type", selectedValue);
                                        setType(selectedValue)
                                    }}
                                    placeholder="Pilih Type Produk"
                                />

                                 {/* Value Input */}
                                 <FormInput
                                    name="value"
                                    label={type === 'doji_plus' ? "Jumlah Bulan" : type === "coints" ? "Jumlah Koin" : "Jumlah Boost" }
                                    placeholder="Masukan value berdasarkan type Produk"
                                    containerClass="mb-3"
                                    register={register}
                                    key="value"
                                    errors={errors}
                                    type="number"
                                    control={control}
                                />

                                {/* Price Input */}
                                <FormInput
                                    name="price"
                                    label="Harga"
                                    placeholder="Masukkan Harga"
                                    containerClass="mb-3"
                                    register={register}
                                    key="price"
                                    errors={errors}
                                    type="number"
                                    control={control}
                                />

                               

                            </Card.Body>
                        </Card>
                    </Row>
                    <CustomButton type="submit" label="Simpan" loading={loading} />
                </form>
            </React.Fragment>
        </>
    );
};

export default ProductForm;