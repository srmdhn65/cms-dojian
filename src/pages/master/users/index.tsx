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


// User Interface




// UsersList Component
const UsersList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const getData = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(getData);
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            const response = await apiServices.getData(
                "users",
                {
                    page: currentPage,
                    name: searchTerm,
                },
                true
            );
            const data = response.data;
            setUsers(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            setUsers([]);
            setTotalPages(1);
        }
    };

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "User", path: "/master/users" },
                    { label: "Users", path: "/master/users", active: true },
                ]}
                title={"Data User"}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={4}>
                                    <CustomButton
                                        type="button"
                                        onClick={() => navigate("/master/users/create")}
                                        label="Tambah User"
                                    />
                                </Col>
                                <Col sm={8}>
                                    <div className="text-sm-end">
                                        <Button className="btn btn-success mb-2 me-1">
                                            <i className="mdi mdi-cog-outline"></i>
                                        </Button>
                                        <Button className="btn btn-light mb-2 me-1">Import</Button>
                                        <Button className="btn btn-light mb-2">Export</Button>
                                    </div>
                                </Col>
                            </Row>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((item: UserInterface, key: number) => (
                                        <tr key={item.id}>

                                            <td>  {(currentPage - 1) * 10 + key + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.role}</td>
                                            <td>
                                                <Link to="#" className="btn btn-xs btn-light">
                                                    <i className="mdi mdi-eye"></i>
                                                </Link>
                                                <Link to="#" className="btn btn-xs btn-light" onClick={(e) => {
                                                    e.preventDefault();  // Prevent the default behavior of the Link
                                                    navigate(`/master/users/edit/${item.id}`); // Programmatically navigate
                                                }}>
                                                    <i className="mdi mdi-square-edit-outline"></i>
                                                </Link>
                                                <Link to="#" className="btn btn-xs btn-light" onClick={() => {
                                                    DeleteService.deleteItem('users', item.id?.toString() ?? '', fetchUsers);
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

export default UsersList;
