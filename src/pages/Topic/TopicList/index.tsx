import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import CustomButton from '../../../components/Button/CustomButton';
import CustomIconButton from '../../../components/Button/CustomIconButton';
import TextInput from '../../../components/Input/TextInput';
import PaginationCustom from '../../../components/Pagination/pagination';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import { TopicInterface } from '../../../types/topics';
import { useState } from 'react';
import ModalConfirm from '../../../components/Modal/ModalConfirm';
import { FaPencilAlt } from 'react-icons/fa';

interface Props {
  items: TopicInterface[];
  setSearchTerm: (searchTerm: string) => void;
  searchTerm: string;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  deleteItem: (id: string) => void;
}

const TopicList: React.FC<Props> = (props) => {
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
    switch (updateType) {
      case 'search':
        props.setSearchTerm(value);
        break;
      default:
        break;
    }
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
      <Breadcrumb pageName="Perangkat" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Perangkat
          </h4>
          <div className="flex items-center gap-2">
            <CustomButton label="Tambah" onClick={() => navigate('/topics/form')} />
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <TextInput
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
          />
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-auto">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="text-center min-w py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  No
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Nama
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Point Cost
                </th>
                <th className="min-w text-center py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
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
                props.items.map((item: TopicInterface, key: number) => (
                  <tr
                    key={key}
                    className="dark:bg-boxdark dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {(props.currentPage - 1) * 10 + key + 1}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{item.name}</td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {item.point_cost}
                      {/* {item.images && item.images.length > 0 ? (
                      item.images.map((image, index) => (
                        <img
                          key={index}
                          src={image} // Use the image URL (or Base64 string)
                          alt={`Topic ${item.name} Image ${index + 1}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                        />
                      ))
                    ) : (
                      <p>No images available</p>
                    )} */}
                    </td>

                    <td className="px-6 py-4 flex gap-2">
                      <CustomIconButton
                        icon={<FaPencilAlt />}
                        onClick={() => navigate(`/topics/form/${item.id}`)}
                      />
                      <CustomIconButton
                        icon={<svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill=""
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill=""
                          />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill=""
                          />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill=""
                          />
                        </svg>}
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

export default TopicList;
