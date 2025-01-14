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
import { FormInput } from "../../../components/";
import SelectInput from "../../../components/FormSelect";
import showToast from "../../../helpers/toast";
import { useNavigate, useParams } from "react-router-dom";
import apiServices from "../../../services/apiServices";
import CustomButton from "../../../components/CustomButton";

const UserCreate = () => {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
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
            phone: yup.string().required("Please enter Phone"),
            email: yup
                .string()
                .email("Please enter a valid Email")
                .required("Please enter Email"),
            role: yup.string().required("Please select Role"),
            username: yup.string().required("Please enter Username"),
            // password: yup.string().required("Please enter Password"),
            // confirmPassword: yup
            //     .string()
            //     .oneOf([yup.ref("password"), null], "Passwords must match")
            //     .required("Please enter Confirm Password"),
        })
    );

    // react-hook-form setup


    // Fetch item details and set form values
    const fetchItemDetails = async () => {
        try {
            setLoading(true);
            const response = await apiServices.getData(`users/${id}`, {}, true);
            const data = response.data.data;
            // Set the form values with the fetched data
            setInitialData(data);

            setValue("name", data.name);
            setValue("phone", data.phone);
            setValue("email", data.email);
            setValue("role", data.role);
            setValue("username", data.username);
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

    const onSubmit = async (formData: any) => {
        try {
            setLoading(true);
            if (isEdit) {
                await apiServices
                    .patchData(`users/${id}`, formData)
                    .then((response) => {
                        navigate("/master/users");
                        showToast('success', 'Berhasil mengubah data')
                    })
                    .catch((error) => {
                        showToast('error', error);
                    }).finally(() => {
                        setLoading(false);
                    });

            } else {
                await apiServices
                    .postData(`users`, formData)
                    .then((response) => {
                        navigate("/master/users");
                        showToast('success', 'Berhasil menambahkan data')
                    })
                    .catch((error) => {
                        showToast('error', error);
                    }).finally(() => {
                        setLoading(false);
                    });
            }
        } catch (error) {
            showToast('error', 'Terjadi kesalahan pada server');
        }
    };
    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "Users", path: "/master/users" },
                    { label: isEdit ? "Ubah User" : "Tambah User", path: "/master/users", active: true },
                ]}
                title="Tambah User"
            />

            <form onSubmit={handleSubmit((data) => onSubmit(data))}>

                <Row>
                    <Col lg={6}>
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
                                    name="email"
                                    label="Email"
                                    placeholder="e.g.: email@example.com"
                                    containerClass="mb-3"
                                    register={register}
                                    key="email"
                                    errors={errors}
                                    control={control}
                                />

                                {/* Username Input */}
                                <FormInput
                                    name="username"
                                    label="Username"
                                    placeholder="Enter username"
                                    containerClass="mb-3"
                                    register={register}
                                    key="username"
                                    errors={errors}
                                    control={control}
                                />

                                {/* Password Input */}
                                <FormInput
                                    name="password"
                                    label="Password"
                                    placeholder="Enter password"
                                    containerClass="mb-3"
                                    register={register}
                                    key="password"
                                    type="password"
                                    errors={errors}
                                    control={control}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card>
                            <Card.Body>

                                {/* Phone Input */}
                                <FormInput
                                    name="phone"
                                    label="Phone"
                                    placeholder="e.g.: +123456789"
                                    containerClass="mb-3"
                                    register={register}
                                    key="phone"
                                    errors={errors}
                                    control={control}
                                />

                                {/* Role Selection */}
                                <SelectInput
                                    name="role"
                                    label="Role"
                                    options={[
                                        { value: "admin", label: "Admin" },
                                        { value: "user", label: "User" },
                                    ]}
                                    control={control}
                                    containerClass="mb-3"
                                    errors={errors}
                                    defaultValue={register("role").name || null}
                                    onChange={(selectedValue) => {
                                        setValue("role", selectedValue);
                                    }}
                                    placeholder="Select a role"
                                />
                                {/* Password Input */}
                                <FormInput
                                    name="confirmPassword"
                                    label="Konfirmasi Password"
                                    placeholder="Enter password"
                                    containerClass="mb-3"
                                    register={register}
                                    type="password"
                                    key="confirmPassword"
                                    errors={errors}
                                    control={control}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <CustomButton type="submit" label="Simpan" loading={loading} />
            </form>
        </>
    );
}


export default UserCreate;
