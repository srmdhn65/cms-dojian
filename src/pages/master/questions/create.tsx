import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "easymde/dist/easymde.min.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// components
import PageTitle from "../../../components/PageTitle";
import { FormInput } from "../../../components";
import SelectInput from "../../../components/FormSelect";
import showToast from "../../../helpers/toast";
import { useNavigate, useParams } from "react-router-dom";
import apiServices from "../../../services/apiServices";
import CustomButton from "../../../components/CustomButton";
import { TopicInterface } from "../../../types/topics";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { QuestionType } from "../../../config/constant-cms";

import BoxedText from "../../../components/BoxText";
import CardCustom from "../../../components/cardCustom";
interface CardData {
    id: number;
    text: string;
    color: string;
    isSelected: boolean;
}
const QuestionForm = () => {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [questionTypeSelected, setQuestionTypeSelected] = useState<string>('');
    const [correctAnswer, setCorrectAnswer] = useState<string>('')
    const [questionText, setQuestionText] = useState<string>('')
    const [caseStudy, setCaseStudy] = useState<string>('')
    const [cards, setCards] = useState<CardData[]>([
        { id: 1, text: '', color: 'primary', isSelected: false },
        { id: 2, text: '', color: 'success', isSelected: false },
        { id: 3, text: '', color: 'info', isSelected: false },
        { id: 4, text: '', color: 'pink', isSelected: false },
    ]);


    const [topicList, setTopicList] = useState<TopicInterface[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        fetchItems()
        if (id) {
            setIsEdit(true);
            fetchItemDetails();
        }
    }, [id]);

    const schemaResolver = yupResolver(
        yup.object().shape({
            topic_id: yup.string().required('Topic Belum dipilih'),
            question_type: yup.string().required('Question Type harus diisi')
        })
    );

    // Predefined color array
    const colors = [
        "primary",
        "success",
        "info",
        "warning",
        "danger",
        "blue",
        "pink",
        "dark",
    ]

    // Function to get a random color
    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    // Function to handle deleting a card
    const handleDelete = (id: number) => {
        if (cards.length > 1)
            setCards(cards.filter((card) => card.id !== id))
    };

    // Function to handle selecting a card
    const handleSelect = (id: number, value: string) => {
        setCards(cards.map((card) =>
            card.id === id
                ? { ...card, isSelected: true, text: value } // Select the clicked card
                : { ...card, isSelected: false, } // Deselect all other cards

        ));
        setCorrectAnswer(value);
    };

    // Function to add a new card with a random color
    const handleAddCard = () => {
        if (cards.length < 5)
            setCards([...cards, { id: cards.length + 1, text: '', color: getRandomColor(), isSelected: false }]);
    };

    const handleAnswer = (value: string) => {
        setCorrectAnswer(value);
    };

    const fetchItems = async () => {
        try {
            let params = '';
            const response = await apiServices.getData(
                'topics-pluck',
                {
                    name: params,
                },
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
    };

    // Fetch item details and set form values
    const fetchItemDetails = async () => {
        try {
            setLoading(true);
            await apiServices.getData(`questions/${id}`, {}, true).then((response) => {
                const data: any = response.data.data;
                setValue('question_type', data.question_type);
                setValue('question_text', data.question);
                setValue('topic_id', String(data.topic_id));
                setQuestionTypeSelected(data.question_type || '');
                // setTopicSelected(String(data.topic_id));
                setCorrectAnswer(data.correct_answer || '');
                setQuestionText(data.question_text || '');
                setCaseStudy(data.case_study_details || '');
                if (data.question_type === 'mcq' || data.question_type === 'case_study') {
                    setCards([]);
                    setCards(data.options!.map((item: string, index: number) => ({
                        id: index + 1,
                        text: item,
                        color: getRandomColor(),
                        isSelected: item === data.correct_answer,
                    })));
                }

            }).catch((error) => {
                console.error(error);
                showToast('error', 'Failed to load question details');
            }).finally(() => setLoading(false));
        } catch (error) {
            setLoading(false);
            showToast('error', 'An error occurred while fetching data');
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
            let options: string[] = [];
            data.question_text = questionText
            if (questionTypeSelected === 'mcq' || questionTypeSelected === 'case_study') {
                options = cards.map((card) => card.text);
                for (const key in cards) {
                    if (cards[key].text === '') {
                        showToast('error', 'Please fill all answer option');
                        return;
                    }
                }
                if (correctAnswer === '') {
                    showToast('error', 'Please select a correct answer');
                    return;
                }
            }
            const body = {
                ...data,
                options: options,
                correct_answer: correctAnswer,
                case_study_details: questionTypeSelected === 'case_study' ? caseStudy : null
            };
            setLoading(true);
            if (isEdit) {
                await apiServices
                    .patchData(`questions/${id}`, body, {}, true)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/questions');
                    })
                    .catch((error) => {
                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            } else {
                await apiServices
                    .postData('questions', body, {}, true)
                    .then((response) => {
                        showToast('success', response.data.message);
                        navigate('/master/questions');
                    })
                    .catch((error) => {
                        showToast('error', error);
                        return '';
                    }).finally(() => setLoading(false));
            }
        } catch (error) { }
    };

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "Quetions", path: "/master/questions" },
                    { label: isEdit ? "Ubah Quetion" : "Tambah Quetion", path: "/master/questions", active: true },
                ]}
                title="Tambah Quetion"
            />

            <form onSubmit={handleSubmit((data) => onSubmit(data))}>

                <Card >
                    <Card.Body>
                        {/* Name Input */}
                        {/* <FormInput
                            name="name"
                            label="Name"
                            placeholder="e.g.: Apple iMac"
                            containerClass="mb-3"
                            register={register}
                            key="name"
                            errors={errors}
                            control={control}
                        /> */}
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
                                setQuestionTypeSelected(selectedValue);
                            }}
                            placeholder="Pilih Type Pertanyaan"
                        />
                        <SelectInput
                            name="topic_id"
                            label="Topik"
                            options={topicList.map((data: TopicInterface) => ({
                                value: String(data.id),
                                label: data.name || '', // Maps data.name to the "label"
                            }))}
                            control={control}
                            containerClass="mb-3"
                            errors={errors}
                            defaultValue={register("topic_id").name || null}
                            onChange={(selectedValue) => {
                                setValue("topic_id", selectedValue);
                            }}
                            placeholder="Pilih Topik"
                        />

                        <Form.Group className="mb-3">
                            <Form.Label>Pertanyaan</Form.Label>
                            <ReactQuill theme="snow" value={questionText} onChange={setQuestionText} />


                        </Form.Group>
                        {questionTypeSelected === 'case_study' ? (
                            <FormInput
                                name="case_study"
                                label="Case Study Detail"
                                placeholder="e.g.: Apple iMac"
                                containerClass="mb-3"
                                key="case_study"
                                onChange={(e) => {
                                    setCaseStudy(e.target.value)
                                }}
                                errors={errors}
                                control={control}
                            />
                        ) : null}

                        {questionTypeSelected === 'mcq' || questionTypeSelected === 'case_study' ? (
                            <div className="d-flex flex-wrap gap-3">
                                {cards.map((card) => (
                                    <CardCustom
                                        key={card.id}
                                        color={card.color}
                                        text={card.text}
                                        isSelected={card.isSelected}
                                        onDelete={() => handleDelete(card.id)}
                                        onSelect={(value) => handleSelect(card.id, value)}
                                    />
                                ))}
                                <CustomButton
                                    label="Add New"
                                    onClick={() => handleAddCard()}
                                    type="button"
                                />
                            </div>

                        ) : (
                            <FormInput
                                name="answer"
                                label="answer"
                                placeholder="e.g.: Apple iMac"
                                containerClass="mb-3"
                                key="answer"
                                defaultValue={correctAnswer}
                                onChange={(value) => {
                                    handleAnswer(value.target.value);
                                }}
                                errors={errors}
                                control={control}
                            />
                        )}

                        {questionTypeSelected === 'fill_the_blank' || questionTypeSelected === 'word_association' ? (
                            <div className="text-center mb-4">
                                <h1 className="text-dark mb-3 display-6">
                                    Jawaban yang akan tampil
                                </h1>
                                {/* BoxedText will render the answer boxes */}
                                <BoxedText text={correctAnswer} />
                            </div>
                        ) : null}
                    </Card.Body>
                </Card>
                <CustomButton type="submit" label="Simpan" loading={loading} />
            </form>
        </>
    );
}


export default QuestionForm;
