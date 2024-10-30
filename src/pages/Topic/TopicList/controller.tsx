import React, { useEffect, useState } from 'react';
import apiServices from '../../../services/apiServices';
import Index from './index';
import { TopicInterface } from '../../../types/topics';
import showToast from '../../../helpers/toast';

const TopicController: React.FC = () => {
  const [items, setItems] = useState<TopicInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);



  useEffect(() => {
    const getData = setTimeout(() => {
      fetchItems();
    }, 500)

    return () => clearTimeout(getData)

  }, [searchTerm, currentPage]);
  const fetchItems = async () => {
    try {
      let params = '';
      if (searchTerm) {
        params = `${searchTerm}`;
      }
      const response = await apiServices.getData(
        'api/admin/topics',
        {
          page: currentPage,
          name: params,
        },
        true,
      );
      const data = response.data;
      if (response.status === 200) {
        let totalPages = data.data.totalPages;
        let datas = data.data;
        setItems(datas);
        setTotalPages(totalPages);
      } else {
        setItems([]);
        setTotalPages(1);
      }
    } catch (error) {
      setItems([]);
      setTotalPages(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await apiServices.deleteData(
        `api/admin/topics/${id}`,
        {},
        true,
      );
      if (response.status === 200) {
        showToast('success', 'Item deleted successfully');
        searchTerm ? fetchItems() : fetchItems();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Index
      items={items}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      deleteItem={deleteItem}
    />
  );
};

export default TopicController;
