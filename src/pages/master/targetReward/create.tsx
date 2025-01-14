import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../../components/PageTitle";
import SelectInput from "../../../components/FormSelect";
import { FormInput } from "../../../components";
import showToast from "../../../helpers/toast";
import { useNavigate, useParams } from "react-router-dom";
import apiServices from "../../../services/apiServices";
import CustomButton from "../../../components/CustomButton";
import { RewardType, TargetType } from "../../../config/constant-cms";
import { BadgeInterface } from "../../../types/badge";

const TargetRewardForm = () => {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [showBadge, setShowBadge] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState('')
    const [badgeList, setBadgeList] = useState<any>([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBadge()
        if (id !== undefined) {
            setIsEdit(true);
            fetchItemDetails();
        }
    }, [id]);

    const schemaResolver = yupResolver(
        yup.object().shape({
            reward_type: yup.string().nullable().required("Please select Reward Type"),
            target_type: yup.string().nullable().required("Please select Target Type"),
            target_value: yup.number().nullable().required("Please enter Target Value"),
            description: yup.string().nullable().required("Please enter Description"),
        })
    );

    // react-hook-form setup
    const methods = useForm({ resolver: schemaResolver });
    const {
        handleSubmit,
        register,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = methods;

    // Fetch item details and set form values
    const fetchItemDetails = async () => {
        try {
            setLoading(true);
            const response = await apiServices.getData(`target-reward/${id}`, {}, true);
            const data = response.data.data;
            setInitialData(data);
            setValue("reward_type", data.reward_type);
            setValue("target_type", data.target_type);
            setValue("target_value", data.target_value);
            setValue("description", data.description);
            setValue("value", data.value);
            if (data.reward_type === 'badge') {
                setSelectedBadge(String(data.reward_id))
                setShowBadge(true)
            }
        } catch (error) {

            showToast("error", "An error occurred while fetching data");
        } finally {
            setLoading(false);
        }
    };

    const fetchBadge = async () => {
        try {
            const response = await apiServices.getData(
                'badges-pluck'
            );
            const data = response.data;
            if (response.status === 200) {
                let datas = data.data
                setBadgeList(datas);
            } else {
                setBadgeList([]);
            }
        } catch (error) {
            setBadgeList([]);

        }
    };

    const onSubmit = async (data: any) => {
        try {
            const body = data;
            setLoading(true);
            if (data.reward_type !== 'badge') {
                data.reward_id = "0"
            } else {
                data.value = 0
            }
            if (isEdit) {
                await apiServices
                    .patchData(`target-reward/${id}`, body)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/target-reward');
                    })
                    .catch((error) => {
                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            } else {
                await apiServices
                    .postData('target-reward', body, {},)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/target-reward');
                    })
                    .catch((error) => {

                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "Target Reward", path: "/master/target-reward" },
                    { label: isEdit ? "Edit Target Reward" : "Add Target Reward", path: "/master/target-reward", active: true },
                ]}
                title={isEdit ? "Edit Target Reward" : "Add Target Reward"}
            />

            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                <Row>
                    <Card>
                        <Card.Body>
                            <SelectInput
                                name="reward_type"
                                label="Reward Type"
                                options={RewardType.map((data: {
                                    value: string;
                                    label: string;
                                }) => ({
                                    value: data.value,
                                    label: data.label,
                                }))}
                                control={control}
                                containerClass="mb-3"
                                defaultValue={selectedBadge}
                                onChange={(selectedValue) => {
                                    setValue("reward_type", selectedValue);
                                    if (selectedValue === 'badge') {
                                        setShowBadge(true)
                                    } else {
                                        setShowBadge(false)
                                    }
                                }}
                                errors={errors}
                                placeholder="Select Reward Type"
                            />

                            {
                                showBadge ? (
                                    <SelectInput
                                        name="reward_id"
                                        label="Badge"
                                        options={badgeList.map((data: BadgeInterface) => ({
                                            value: String(data.id),
                                            label: data.name || '', // Maps data.name to the "label"
                                        }))}
                                        control={control}
                                        containerClass="mb-3"
                                        errors={errors}
                                        defaultValue={selectedBadge}
                                        onChange={(selectedValue) => {
                                            setSelectedBadge(selectedValue)
                                        }}
                                        placeholder="Pilih Badge"
                                    />
                                ) : (
                                    <FormInput
                                        name="value"
                                        label="Reward Value"
                                        placeholder="Enter Reward Value"
                                        containerClass="mb-3"
                                        register={register}
                                        type="number"
                                        errors={errors}
                                        control={control}
                                    />
                                )
                            }

                            <SelectInput
                                name="target_type"
                                label="Target Type"
                                options={TargetType.map((data: {
                                    value: string;
                                    label: string;
                                }) => ({
                                    value: data.value,
                                    label: data.label,
                                }))}
                                control={control}
                                containerClass="mb-3"
                                defaultValue={getValues('target_type')}
                                onChange={(selectedValue) => {
                                    setValue("target_type", selectedValue);
                                }}
                                errors={errors}
                                placeholder="Select Target Type"
                            />

                            <FormInput
                                name="target_value"
                                label="Target Value"
                                placeholder="Enter Target Value"
                                containerClass="mb-3"
                                register={register}
                                type="number"
                                errors={errors}
                                control={control}
                            />

                            <FormInput
                                name="description"
                                label="Description"
                                placeholder="Enter Description"
                                containerClass="mb-3"
                                register={register}
                                type="textarea"
                                errors={errors}
                                control={control}
                            />
                        </Card.Body>
                    </Card>
                </Row>
                <CustomButton type="submit" label="Simpan" loading={loading} />
            </form>
        </>
    );
};

export default TargetRewardForm;
