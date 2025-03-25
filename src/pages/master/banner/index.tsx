import  { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card} from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
// import apiServices from "../../../helpers/api/api";
import CustomButton from "../../../components/CustomButton";
import apiServices from "../../../services/apiServices";
import Pagination from "../../../components/Pagination";
import DeleteService from "../../../services/deletedServices";
import { BannerInterface } from "../../../types/banner";
import CardImage from "../../../components/cardImage";


const BannerList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<BannerInterface[]>([]);
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
                "banners",
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
            setItems([]);
            setTotalPages(1);
        }
    };

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "Banners", path: "/master/banners" },
                    { label: "Banners", path: "/master/banners", active: true },
                ]}
                title={"Data Banners"}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={4}>
                                    <CustomButton
                                        type="button"
                                        onClick={() => navigate("/master/banners/create")}
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
                                        <th>Type</th>
                                        <th>Image</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item: BannerInterface, key: number) => (
                                        <tr key={item.id}>
                                            <td>{(currentPage - 1) * 10 + key + 1}</td>
                                            <td>{item.title || '-'}</td>
                                            <td>{item.type || '-'}</td>
                                            <td>
                                                <CardImage images={[item.image || '']} preview={true} />
                                            </td>
                                            <td>
                                        
                                                <Link to="#" className="btn btn-xs btn-light" onClick={(e) => {
                                                    e.preventDefault(); // Prevent the default behavior of the Link
                                                    navigate(`/master/banners/edit/${item.id}`);
                                                }}>
                                                    <i className="mdi mdi-square-edit-outline"></i>
                                                </Link>
                                                <Link to="#" className="btn btn-xs btn-light" onClick={() => {
                                                    DeleteService.deleteItem('banners', item.id?.toString() ?? '', fetchItems);
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

export default BannerList;
