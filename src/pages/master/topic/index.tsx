import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import { Row, Col, Card, Button } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
// import apiServices from "../../../helpers/api/api";
import { UserInterface } from "../../../types/users";
import CustomButton from "../../../components/CustomButton";
import apiServices from "../../../services/apiServices";
import Pagination from "../../../components/Pagination";
import DeleteService from "../../../services/deletedServices";
import { TopicInterface } from "../../../types/topics";
import CardImage from "../../../components/cardImage";



// User Interface




// UsersList Component
const TopicList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<TopicInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const { id } = useParams();

    useEffect(() => {
        const getData = setTimeout(() => {
            fetchItems();
        }, 500);

        return () => clearTimeout(getData);
    }, [currentPage]);
    const fetchItems = async () => {
        try {
            const response = await apiServices.getData(
                "topics",
                {
                    page: currentPage,
                    name: searchTerm,
                    department_id: id
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

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "topics", path: "/master/topics" },
                    { label: "topics", path: "/master/topics", active: true },
                ]}
                title={"Data topics"}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={4}>
                                    <CustomButton
                                        type="button"
                                        onClick={() => navigate(`/master/topics/create/${id}`)}
                                        label="Tambah Data"
                                    />
                                </Col>
                                {/* <Col sm={8}>
                                    <div className="text-sm-end">
                                        <Button className="btn btn-success mb-2 me-1">
                                            <i className="mdi mdi-cog-outline"></i>
                                        </Button>
                                        <Button className="btn btn-light mb-2 me-1">Import</Button>
                                        <Button className="btn btn-light mb-2">Export</Button>
                                    </div>
                                </Col> */}
                            </Row>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama</th>
                                        <th>Departement</th>
                                        <th>Point Cost</th>
                                        <th>Level</th>
                                        <th>Image</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item: TopicInterface, key: number) => (
                                        <tr key={item.id}>

                                            <td>  {(currentPage - 1) * 10 + key + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.department.name ?? ''}</td>
                                            <td>{item.point_cost}</td>
                                            <td>{item.level}</td>
                                            <td>
                                                <CardImage
                                                    images={item.images || []}
                                                    preview={true}
                                                />
                                            </td>
                                            <td>
                                                {/* <Link to="#" className="btn btn-xs btn-light">
                                                    <i className="mdi mdi-eye"></i>
                                                </Link> */}
                                                <Link to="#" className="btn btn-xs btn-light" onClick={(e) => {
                                                    e.preventDefault();  // Prevent the default behavior of the Link
                                                    navigate(`/master/topics/edit/${item.department_id}/${item.id}`); // Programmatically navigate
                                                }}>
                                                    <i className="mdi mdi-square-edit-outline"></i>
                                                </Link>
                                                <Link to="#" className="btn btn-xs btn-light" onClick={() => {
                                                    DeleteService.deleteItem('topics', item.id?.toString() ?? '', fetchItems);
                                                }}>
                                                    <i className="mdi mdi-delete"></i>
                                                </Link></td>
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
        </>
    );
};

export default TopicList;
