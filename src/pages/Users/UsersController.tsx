import React, { useEffect, useState } from 'react';
import { UserInterface } from '../../types/users';
import apiServices from '../../services/apiServices';
import Users from './index';
import showToast from '../../helpers/toast';

const UserController: React.FC = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  useEffect(() => {
    const getData = setTimeout(() => {
      fetchUsers();
    }, 500)

    return () => clearTimeout(getData)
  }, [searchTerm]);
  const fetchUsers = async () => {
    try {
      let params = '';
      if (searchTerm) {
        params = `${searchTerm}`;
      }
      const response = await apiServices.getData(
        'api/admin/users',
        {
          page: currentPage,
          name: params,
        },
        true,
      );
      const data = response.data;
      let totalPages = data.pagination.totalPages;
      let items = data.data;
      setUsers(items);
      setTotalPages(totalPages);
    } catch (error) {
      setUsers([]);
      setTotalPages(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await apiServices.deleteData(
        `api/admin/users/${id}`,
        {},
        true,
      );
      if (response.status === 200) {
        showToast('success', 'User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
    }
  };

  return (
    <Users
      usersData={users}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      totalPages={totalPages}
      currentPage={currentPage}
      deleteUser={deleteUser}
      onPageChange={handlePageChange}
    />
  );
};

export default UserController;
