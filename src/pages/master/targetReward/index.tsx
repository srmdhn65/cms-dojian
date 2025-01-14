import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { Row, Col, Card, Button } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
// import apiServices from "../../../helpers/api/api";
import { UserInterface } from "../../../types/users";
import CustomButton from "../../../components/CustomButton";
import apiServices from "../../../services/apiServices";
import Pagination from "../../../components/Pagination";
import DeleteService from "../../../services/deletedServices";
import { TargetRewardInterface } from "../../../types/targetReward";
import CardImage from "../../../components/cardImage";



// User Interface




// UsersList Component
const TargetRewardList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<TargetRewardInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const getData = setTimeout(() => {
            fetchItems();
        }, 500);

        return () => clearTimeout(getData);
    }, [currentPage]);

    const fetchItems = async () => {
        try {
            const response = await apiServices.getData(
                "target-reward",
                {
                    page: currentPage,
                    name: searchTerm,
                },
                true
            );
            const data = response.data;
            setItems(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error(error);
            setItems([]);
            setTotalPages(1);
        }
    };

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "Target Reward", path: "/master/target-reward" },
                    { label: "Target Reward", path: "/master/target-reward", active: true },
                ]}
                title={"Data Target Reward"}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={4}>
                                    <CustomButton
                                        type="button"
                                        onClick={() => navigate("/master/target-reward/create")}
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
                                        <th>Reward</th>
                                        <th>Tipe Target</th>
                                        <th>Target Value</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item: TargetRewardInterface, key: number) => (
                                        <tr key={item.id}>
                                            <td>  {(currentPage - 1) * 10 + key + 1}</td>
                                            <td>{item.reward_type} - {item.reward_type == 'badge' ? item.badges[0]?.name ?? '' : item.value}</td>
                                            <td>{item.target_type}</td>
                                            <td>{item.target_value}</td>
                                            <td>{item.description}</td>
                                            <td>
                                                {/* <Link to="#" className="action-icon">
                                                    <i className="mdi mdi-eye"></i>
                                                </Link> */}
                                                <Link to="#" className="action-icon" onClick={(e) => {
                                                    e.preventDefault();  // Prevent the default behavior of the Link
                                                    navigate(`/master/target-reward/edit/${item.id}`); // Programmatically navigate
                                                }}>
                                                    <i className="mdi mdi-square-edit-outline"></i>
                                                </Link>
                                                <Link to="#" className="action-icon" onClick={() => {
                                                    DeleteService.deleteItem('target-reward', item.id?.toString() ?? '', fetchItems);
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

export default TargetRewardList;
