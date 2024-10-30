import React, { useEffect, useState } from 'react';
import apiServices from '../../../services/apiServices';
import Index from './index';
import showToast from '../../../helpers/toast';
import { QuestionInterface } from '../../../types/question';
import { ItemValue } from '../../../types/item';

const QuestionController: React.FC = () => {
  const [items, setItems] = useState<QuestionInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState<ItemValue>();
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
      let params: Object = {};
      params = {
        page: currentPage,
      }
      if (searchTerm) {
        params = {
          ...params,
          [searchTerm.key]: searchTerm.value,
        };
      }
      console.log(params);
      const response = await apiServices.getData(
        'api/admin/questions',
        params,
        true,
      );
      const data = response.data;
      console.log(data);
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
      console.log(id);
      const response = await apiServices.deleteData(
        `api/admin/questions/${id}`,
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
      setSearchTerm={setSearchTerm}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      deleteItem={deleteItem}
    />
  );
};

export default QuestionController;
