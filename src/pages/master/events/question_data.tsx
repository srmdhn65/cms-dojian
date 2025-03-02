import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
// import apiServices from "../../../helpers/api/api";

import CustomButton from "../../../components/CustomButton";
import apiServices from "../../../services/apiServices";
import Pagination from "../../../components/Pagination";
import DeleteService from "../../../services/deletedServices";
import { QuestionInterface } from "../../../types/question";
import SelectInput from "../../../components/FormSelect";
import { QuestionType } from "../../../config/constant-cms";
import { TopicInterface } from "../../../types/topics";

const QuestionList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<QuestionInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [topicList, setTopicList] = useState<TopicInterface[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string>("");


    useEffect(() => {
        fetchTopics()
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
        } catch (error) {
            setItems([]);
            setTotalPages(1);
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
                let datas = data.data
                setTopicList(datas);
            } else {
                setTopicList([]);
            }
        } catch (error) {
            setTopicList([]);

        }
    };




    return (
        <>
            <React.Fragment>
                <PageTitle
                    breadCrumbItems={[
                        { label: "Bank Soal", path: "/master/questions" },
                        { label: "Bank Soal", path: "/master/questions", active: true },
                    ]}
                    title={"Data Pertanyaan"}
                />

                <Row>   
                    <Col>
                        <Card>

                            <Card.Body>
                                <Row className="mb-3">
                                    <Col sm={2} className="d-flex">
                                        <CustomButton
                                            type="button"
                                            onClick={() => navigate("/master/questions/create")}
                                            label="Tambah Data"
                                        />
                                    </Col>
                                    <Col>
                                        <div className="text-sm-end">
                                            {/* <Button className="btn btn-success mb-2 me-1">
                                                <i className="mdi mdi-cog-outline"></i>
                                            </Button> */}
                                            {/* <Button className="btn btn-light mb-2">Export</Button> */}
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-between align-items-center">
                                    {/* Button Section */}

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


                                    {/* Select Inputs Section */}
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
                                            <th className="text-center">Options</th>
                                            <th className="text-center">Aksi</th>
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
                                                <td>
                                                    {item.question_type === 'mcq' || item.question_type === 'case_study' ? (
                                                        <>
                                                            {item.question_type === 'case_study' && item.case_study_details && (
                                                                <p className="fw-bold mb-2">Questions Detail: {item.case_study_details}</p>
                                                            )}
                                                            {item.options && item.options.length > 0 ? (
                                                                item.options.map((data, index) => (
                                                                    <div key={index}>
                                                                        <p>
                                                                            {data}
                                                                            <span
                                                                                className={`ms-2 ${item.correct_answer === data ? 'text-success' : 'text-danger'}`}
                                                                            >
                                                                                {item.correct_answer === data ? '✅' : '❌'}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p>No items available</p>
                                                            )}
                                                        </>
                                                    ) : item.question_type === 'fill_the_blank' || item.question_type === 'word_association' ? (
                                                        <p>{item.correct_answer}</p>
                                                    ) : (
                                                        <p>Not applicable for this question type</p>
                                                    )}
                                                </td>
                                                <td>
                                                    <Link to="#" className="btn btn-xs btn-light">
                                                        <i className="mdi mdi-eye"></i>
                                                    </Link>
                                                    <Link to="#" className="btn btn-xs btn-light" onClick={(e) => {
                                                        e.preventDefault();  // Prevent the default behavior of the Link
                                                        navigate(`/master/questions/edit/${item.id}`); // Programmatically navigate
                                                    }}>
                                                        <i className="mdi mdi-square-edit-outline"></i>
                                                    </Link>
                                                    <Link to="#" className="btn btn-xs btn-light" onClick={() => {
                                                        DeleteService.deleteItem('questions', item.id?.toString() ?? '', fetchItems);
                                                    }}>
                                                        <i className="mdi mdi-delete"></i>
                                                    </Link></td>
                                            </tr>
                                        ))
                                        }
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

export default QuestionList;
