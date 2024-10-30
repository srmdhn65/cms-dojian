import { FaRegTrashCan } from 'react-icons/fa6';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import CustomButton from '../../../components/Button/CustomButton';
import CustomIconButton from '../../../components/Button/CustomIconButton';
import PaginationCustom from '../../../components/Pagination/pagination';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ModalConfirm from '../../../components/Modal/ModalConfirm';
import { QuestionInterface } from '../../../types/question';
import { QuestionType } from '../../../config/constant-cms';
import SelectCustomObject from '../../../components/Select/SelectCustom';
import { ItemValue } from '../../../types/item';
import { FaPencilAlt } from 'react-icons/fa';

interface Props {
  items: QuestionInterface[];
  setSearchTerm: (searchTerm: ItemValue) => void;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  deleteItem: (id: string) => void;
}

const QuestionList: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const updateFormValue = ({
    updateType,
    value,
  }: {
    updateType: string;
    value: string;
  }) => {
    const searchTerm: ItemValue = { key: updateType, value };
    props.setSearchTerm(searchTerm);
  };

  const handleNextPage = () => {
    if (props.currentPage < props.totalPages) {
      props.onPageChange(props.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (props.currentPage > 1) {
      props.onPageChange(props.currentPage - 1);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  };


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Question" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Question Data
          </h4>
          <div className="flex items-center gap-2">
            <CustomButton label="Tambah" onClick={() => navigate('/questions/form')} />
          </div>
        </div>
        <div className='flex flex-col gap-5.5 sm:flex-row'>
          <SelectCustomObject
            title="Silahkan Pilih Tipe Soal"
            items={QuestionType}
            placeholder="Pilih Salah satu"
            onChange={(selectedOption) => {
              updateFormValue({
                updateType: 'question_type',
                value: selectedOption.value,
              });
            }} // Handle selected option
            updateType='question_type'
          />
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {/* <TextInput
            placeholder="Search"
            className="block w-min p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg dark:bg-boxdark focus:ring"
            updateType="search"
            updateFormValue={updateFormValue}
            icon={
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            }
          /> */}

          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-auto">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w py-4 px-4 font-medium text-center text-black dark:text-white xl:pl-11">
                  No
                </th>
                <th scope="col" className="px-6 py-3">
                  Question
                </th>
                <th scope="col" className="px-6 py-3">
                  Options
                </th>
                <th scope="col" className="px-6 py-3">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {props.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No Data Found
                  </td>
                </tr>
              ) : (
                props.items.map((item: QuestionInterface, key: number) => (
                  <tr
                    key={key}
                    className="dark:bg-boxdark dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="border-b border-[#eee] text-center py-5 px-4 dark:border-strokedark">
                      {(props.currentPage - 1) * 10 + key + 1}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark" dangerouslySetInnerHTML={{ __html: item.question_text || '' }}></td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {item.question_type === 'mcq' || item.question_type === 'case_study' ? (
                        <>
                          {item.question_type === 'case_study' && item.case_study_details && (
                            <p className="mb-2 font-semibold">Questions Detail : {item.case_study_details}</p>
                          )}
                          {item.options && item.options.length > 0 ? (
                            item.options.map((data, index) => (
                              <div key={index}>
                                <p>
                                  {data}
                                  <span
                                    className={`${item.correct_answer === data ? 'text-green-500' : 'text-red-500'
                                      } ml-2`}
                                  >
                                    {item.correct_answer === data ? '✅' : '❌'}
                                  </span>
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>No items available</p>
                          )}
                        </>
                      ) : item.question_type === 'fill_the_blank' || item.question_type === 'word_association' ? (
                        <p>{item.correct_answer}</p>
                      ) : (
                        <p>Not applicable for this question type</p>
                      )}
                    </td>




                    <td className="px-6 py-4 flex gap-2">
                      <CustomIconButton
                        icon={<FaPencilAlt />}
                        onClick={() => navigate(`/questions/form/${item.id}`)}
                      />
                      <CustomIconButton
                        icon={<FaRegTrashCan />}
                        onClick={() =>
                          handleDelete(item.id?.toString() || '')
                        }
                        color="red-500"
                        bg="red-600"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Uncomment if you need to add delete functionality */}
        <ModalConfirm
          open={open}
          setOpen={setOpen}
          id={deleteId}
          title="Delete Category"
          message="Are you sure you want to delete this data?"
          onConfirm={() => {
            setOpen(false);
            props.deleteItem(deleteId);
            setDeleteId('');
          }}
          onCancel={() => {
            setOpen(false);
            setDeleteId('');
          }}
        />
        <PaginationCustom
          currentPage={props.currentPage}
          totalPages={props.totalPages}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          onPageChange={props.onPageChange}
        />
      </div>
    </DefaultLayout>
  );
};

export default QuestionList;
