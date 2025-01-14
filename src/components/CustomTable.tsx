import React, { useState } from "react";
import Pagination from "./Pagination";

interface TableData {
    id: number;
    name: string;
    email: string;
}

const PaginatedTable = () => {
    // Sample data
    const data: TableData[] = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
    }));

    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10; // Number of items per page

    const currentData = data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div>
            <h1>Paginated Table</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Component */}
            {/* <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={data.length}
                onPageChange={(page: number) => setCurrentPage(page)}
            /> */}
        </div>
    );
};

export default PaginatedTable;
