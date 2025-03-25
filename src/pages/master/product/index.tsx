import  { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card} from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/CustomButton";
import apiServices from "../../../services/apiServices";
import Pagination from "../../../components/Pagination";
import DeleteService from "../../../services/deletedServices";
import {ProductInterface} from "../../../types/product";


const ProductList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<ProductInterface[]>([]);
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
                "products",
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
                    { label: "Produk", path: "/master/products" },
                    { label: "Produk", path: "/master/products", active: true },
                ]}
                title={"Data Produk"}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={4}>
                                    <CustomButton
                                        type="button"
                                        onClick={() => navigate("/master/product/create")}
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
                                        <th>Tipe Produk</th>
                                        <th>Nilai</th>
                                        <th>Harga</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item: ProductInterface, key: number) => (
                                        <tr key={item.id}>
                                            <td>{(currentPage - 1) * 10 + key + 1}</td>
                                            <td>{item.type || '-'}</td>
                                            <td>{item.type === 'doji_plus' ? `${item.value} Bulan` : item.type === "coints" ? item.value : `X${item.value}` }</td>
                                            <td>{item.price || '-'}</td>
                                            <td>
                                                <Link to="#" className="btn btn-xs btn-light" onClick={(e) => {
                                                    e.preventDefault(); // Prevent the default behavior of the Link
                                                    navigate(`/master/product/edit/${item.id}`);
                                                }}>
                                                    <i className="mdi mdi-square-edit-outline"></i>
                                                </Link>
                                                <Link to="#" className="btn btn-xs btn-light" onClick={() => {
                                                    DeleteService.deleteItem('products', item.id?.toString() ?? '', fetchItems);
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

export default ProductList;
