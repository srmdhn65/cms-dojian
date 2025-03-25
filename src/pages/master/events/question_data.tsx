import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
import apiServices from "../../../services/apiServices";
import Pagination from "../../../components/Pagination";
import { QuestionInterface } from "../../../types/question";
import { TopicInterface } from "../../../types/topics";
import SelectInput from "../../../components/FormSelect";
import { QuestionType } from "../../../config/constant-cms";

const QuestionDataEvent = () => {
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const { id } = useParams();
    const [items, setItems] = useState<QuestionInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [topicList, setTopicList] = useState<TopicInterface[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string>("");

    useEffect(() => {
        fetchTopics();

        const getData = setTimeout(() => {
            fetchItems();
        }, 500);
        return () => clearTimeout(getData);
    }, [currentPage, searchTerm, selectedTopic]);

    const fetchItems = async () => {
        try {
            const response = await apiServices.getData(
                "questions",
                {
                    page: currentPage,
                    question_type: searchTerm,
                    topic_id: selectedTopic ? selectedTopic : "",
                },
                true
            );
            const data = response.data;
            setItems(data.data);
            setTotalPages(data.pagination.totalPages);
            fetchSelectedQuestions(); // Fetch selected questions when the component mounts
        } catch (error) {
            setItems([]);
            setTotalPages(1);
        }
    };

    const fetchSelectedQuestions = async () => {
        try {
            const response = await apiServices.getData(
                "events-question",
                {
                    event_id: id,
                },
                true
            );
            const data = response.data;
            const selectedIds = data.data.map((q: any) => q.question_id);
            setSelectedQuestions(selectedIds);
        } catch (error) {
            console.error("Failed to fetch selected questions", error);
        }
    };

    const fetchTopics = async () => {
        try {
            let params = '';
            const response = await apiServices.getData(
                'topics-pluck',
                {
                    name: params,
                },
                true
            );
            const data = response.data;
            if (response.status === 200) {
                let datas = data.data;
                setTopicList(datas);
            } else {
                setTopicList([]);
            }
        } catch (error) {
            setTopicList([]);
        }
    };

    const toggleSelection = async (questionId: number, isSelected: boolean) => {
        try {
            await apiServices.postData(
                `events-question`,
                {
                    is_selected: !isSelected,
                    question_id: questionId,
                    event_id: id,
                }, {},
                true
            ).then((value) => {
                console.log(value)
            });

            // Update selected items in the state
            setSelectedQuestions((prev) =>
                !isSelected ? [...prev, questionId] : prev.filter((id) => id !== questionId)
            );
        } catch (error) {
            console.error("Failed to update selection status", error);
        }
    };

    return (
        <>
            <React.Fragment>
                <PageTitle
                    breadCrumbItems={[
                        { label: "Bank Soal", path: "/master/events" },
                        { label: "Bank Soal", path: "/master/events", active: true },
                    ]}
                    title={"Data Pertanyaan"}
                />

                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row className="d-flex justify-content-between align-items-center">
                                    <Col sm={4} className="justify-content-end">
                                        <SelectInput
                                            name="topic_id"
                                            label="Topik"
                                            options={topicList.map((data: TopicInterface) => ({
                                                value: String(data.id),
                                                label: data.name || '',
                                            }))}
                                            defaultValue={selectedTopic}
                                            onChange={(selectedValue) => setSelectedTopic(selectedValue)}
                                            placeholder="Pilih Topik"
                                        />
                                    </Col>

                                    <Col sm={4} className="justify-content-end">
                                        <SelectInput
                                            name="question_type"
                                            label="Tipe Pertanyaan"
                                            options={QuestionType.map((data: { value: string; label: string }) => ({
                                                value: data.value,
                                                label: data.label,
                                            }))}
                                            onChange={(selectedValue) => setSearchTerm(selectedValue)}
                                            placeholder="Pilih Type Pertanyaan"
                                        />
                                    </Col>
                                </Row>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th className="text-center">Topik</th>
                                            <th className="text-center">Pertanyaan</th>
                                            <th className="text-center">Selected</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item: QuestionInterface, key: number) => (
                                            <tr key={key}>
                                                <td className="text-center">
                                                    {(currentPage - 1) * 10 + key + 1}
                                                </td>
                                                <td className="text-center">{item.topic?.name ?? ''}</td>
                                                <td dangerouslySetInnerHTML={{ __html: item.question_text || '' }}></td>
                                                <td className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedQuestions.includes(item.id || 0)}
                                                        onChange={() => toggleSelection(item.id || 0, selectedQuestions.includes(item.id || 0))}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <Pagination
                                    currentPage={currentPage}
                                    pageSize={10}
                                    totalPages={totalPages}
                                    onPageChange={(page: number) => setCurrentPage(page)}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </React.Fragment>
        </>
    );
};

export default QuestionDataEvent;