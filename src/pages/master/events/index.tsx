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
import { EventInterface } from "../../../types/event";
import CardImage from "../../../components/cardImage";


const EventList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<EventInterface[]>([]);
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
                "events",
                {
                    page: currentPage,
                    name: searchTerm,
                },
                true
            );
            const data = response.data;
            console.log(data)

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
                    { label: "Events", path: "/master/events" },
                    { label: "Events", path: "/master/events", active: true },
                ]}
                title={"Data Events"}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={4}>
                                    <CustomButton
                                        type="button"
                                        onClick={() => navigate("/master/events/create")}
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
                                        <th>Name</th>
                                        <th>Icon</th>
                                        <th>Rank</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Reward Badge</th>
                                        <th>Reward Coins</th>
                                        <th>Reward XP</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item: EventInterface, key: number) => (
                                        <tr key={item.id}>
                                            <td>{(currentPage - 1) * 10 + key + 1}</td>
                                            <td>{item.name || '-'}</td>
                                            <td>
                                                <CardImage images={[item.image || '']} preview={true} />
                                            </td>
                                            <td>{item.rank || '-'}</td>
                                            <td>{item.startDate ? new Date(item.startDate).toLocaleDateString() : '-'}</td>
                                            <td>{item.endDate ? new Date(item.endDate).toLocaleDateString() : '-'}</td>
                                            <td>{item.rewardBadge || '-'}</td>
                                            <td>{item.rewardCoins ?? 0}</td>
                                            <td>{item.rewardXp ?? 0}</td>
                                            <td>
                                                <Link to="#" className="btn btn-xs btn-light" onClick={(e) => {
                                                    e.preventDefault(); // Prevent the default behavior of the Link
                                                    navigate(`/master/events/edit/${item.id}`);
                                                }}>
                                                    <i className="mdi mdi-square-edit-outline"></i>
                                                </Link>
                                                <Link to="#" className="btn btn-xs btn-light" onClick={(e) => {
                                                    e.preventDefault(); // Prevent the default behavior of the Link
                                                    navigate(`/master/events/edit/${item.id}`);
                                                }}>
                                                    <i className="mdi mdi-text-search"></i>
                                                </Link>
                                                <Link to="#" className="btn btn-xs btn-light" onClick={() => {
                                                    DeleteService.deleteItem('events', item.id?.toString() ?? '', fetchItems);
                                                }}>
                                                    <i className="mdi mdi-delete"></i>
                                                </Link>

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
        </>
    );
};

export default EventList;
