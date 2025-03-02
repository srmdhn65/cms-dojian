import React, { useEffect, useState } from "react";
import { Row, Card } from "react-bootstrap";
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
import { BadgeInterface } from "../../../types/badge";
import { TopicInterface } from "../../../types/topics";
import { formatDate } from "../../../helpers/date_custom";
const EventForm = () => {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [badgeList, setBadgeList] = useState<any>([]);
    const [topicList, setTopicList] = useState<any>([]);

    const [image, setImage] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        fetchBadge()
        fetchTopics()
        if (id) {
            setIsEdit(true);
            fetchItemDetails();
        }
    }, [id]);

    const fetchBadge = async () => {
        try {
            const response = await apiServices.getData(
                'badges-pluck',
                {},
                true
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

    const fetchTopics = async () => {
        try {
            const response = await apiServices.getData(
                'topics-pluck',
                {},
                true
            );
            const data = response.data;
            if (response.status === 200) {
                let datas = data.data
                setTopicList(datas);
            } else {
                setTopicList([]);
            }
        } catch (error) {
            setTopicList([]);

        }
    }


    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required("Silakan masukkan Nama"),
            rank: yup.string().required('Silahkan pilih rank'),
            description: yup.string().required("Silakan masukkan Deskripsi"),
            startDate: yup.date().nullable().required("Silakan pilih Tanggal Mulai"),
            endDate: yup
                .date()
                .nullable()
                .required("Silakan pilih Tanggal Selesai")
                .min(
                    yup.ref("startDate"),
                    "Tanggal Selesai harus setelah Tanggal Mulai"
                ),
            rewardBadge: yup.string().nullable().required("Silakan masukkan Lencana Penghargaan"),
            topic_id: yup.string().nullable().required("Silakan pilih Topik"),
            rewardCoins: yup
                .number()
                .nullable()
                .required("Silakan masukkan Koin Penghargaan")
                .positive("Koin Penghargaan harus berupa angka positif"),
            rewardXp: yup
                .number()
                .nullable()
                .required("Silakan masukkan XP Penghargaan")
                .positive("XP Penghargaan harus berupa angka positif"),
        })
    );



    // react-hook-form setup


    // Fetch item details and set form values
    const fetchItemDetails = async () => {
        try {
            setLoading(true);
            const response = await apiServices.getData(`events/${id}`, {}, true);
            const data = response.data.data;

            if (!data) {
                throw new Error("No data received");
            }

            // Set the form values with the fetched data
            setInitialData(data);
            setValue("name", data.name || "");
            setValue("description", data.description || "");
            setValue("startDate", data.startDate ? formatDate(data.startDate) : "");
            setValue("endDate", data.endDate ? formatDate(data.endDate) : "");
            setValue("rewardCoins", data.rewardCoins || 0);
            setValue("rewardXp", data.rewardXp || 0);
            setValue("rewardBadge", data.rewardBadge || "");
            setValue("topic_id", data.topic_id || "");
            setValue("rank", data.rank || "");
            setImage(data.image || "")
        } catch (error) {
            console.error(error);
            showToast("error", "An error occurred while fetching data");
        } finally {
            setLoading(false); // Ensures loading is disabled whether success or error occurs
        }
    };

    const methods = useForm({ resolver: schemaResolver });
    const {
        handleSubmit,
        register,
        control,
        setValue,
        getValues,
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
                    .patchData(`events/${id}`, body, {}, true)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/events');
                    })
                    .catch((error) => {
                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            } else {
                await apiServices
                    .postData('events', body, {}, true)
                    .then((response) => {
                        console.log(`data ${response.data}`)
                        showToast('success', response.data.message);
                        navigate('/master/events');
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
                        { label: "Events", path: "/master/events" },
                        { label: isEdit ? "Ubah Events" : "Tambah Events", path: "/master/events", active: true },
                    ]}
                    title={isEdit ? "Ubah Events" : "Tambah Events"}
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


                                <FormInput
                                    name="startDate"
                                    label="Start Date"
                                    placeholder="Select start date"
                                    containerClass="mb-3"
                                    register={register}
                                    key="startDate"
                                    type="date"
                                    errors={errors}
                                    control={control}
                                />

                                {/* End Date Input */}
                                <FormInput
                                    name="endDate"
                                    label="End Date"
                                    placeholder="Select end date"
                                    containerClass="mb-3"
                                    register={register}
                                    key="endDate"
                                    type="date"
                                    errors={errors}
                                    control={control}
                                />

                                {/* Reward Badge Input */}
                                <SelectInput
                                    name="rewardBadge"
                                    label="Reward Badge"
                                    options={badgeList.map((data: BadgeInterface) => ({
                                        value: data.id,
                                        label: data.name || '', // Maps data.name to the "label"
                                    }))}
                                    control={control}
                                    containerClass="mb-3"
                                    errors={errors}
                                    defaultValue={register('rewardBadge').name || ''}
                                    onChange={(selectedValue) => {
                                        setValue("rewardBadge", selectedValue);
                                    }}
                                    placeholder="Pilih Badge"
                                />

                                {/*Topic Input */}
                                <SelectInput
                                    name="topic_id"
                                    label="Topik"
                                    options={topicList.map((data: TopicInterface) => ({
                                        value: data.id,
                                        label: data.name || '', // Maps data.name to the "label"
                                    }))}
                                    control={control}
                                    containerClass="mb-3"
                                    errors={errors}
                                    defaultValue={register('topic_id').name || ''}
                                    onChange={(selectedValue) => {
                                        setValue("topic_id", selectedValue);
                                    }}
                                    placeholder="Pilih Topik"
                                />
                                <SelectInput
                                    name="rank"
                                    label="Rank"
                                    options={[
                                        { value: "swift", label: "Swift" },
                                        { value: "royal", label: "Royal" },
                                        { value: "ultimate", label: "Ultimate" },
                                        { value: "season", label: "Season" },
                                    ]}
                                    control={control}
                                    containerClass="mb-3"
                                    errors={errors}
                                    defaultValue={register('rank').name || ''}
                                    onChange={(selectedValue) => {
                                        setValue("rank", selectedValue);
                                    }}
                                    placeholder="Pilih Topik"
                                />

                                {/* Reward Coins Input */}
                                <FormInput
                                    name="rewardCoins"
                                    label="Reward Coins"
                                    placeholder="Enter reward coins"
                                    containerClass="mb-3"
                                    register={register}
                                    key="rewardCoins"
                                    type="number"
                                    errors={errors}
                                    control={control}
                                />

                                {/* Reward XP Input */}
                                <FormInput
                                    name="rewardXp"
                                    label="Reward XP"
                                    placeholder="Enter reward XP"
                                    containerClass="mb-3"
                                    register={register}
                                    key="rewardXp"
                                    type="number"
                                    errors={errors}
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


export default EventForm;
