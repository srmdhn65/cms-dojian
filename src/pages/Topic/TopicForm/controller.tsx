import React, { useEffect, useState } from 'react';
import apiServices from '../../../services/apiServices';
import showToast from '../../../helpers/toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import schema, { TopicForm } from './validation';
import FormTopic from '.';

const TopicFormController: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { itemId } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [imagesUrl, setImagesUrl] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TopicForm>({
    resolver: zodResolver(schema.post),
  });

  useEffect(() => {
    if (itemId) {
      setIsEdit(true);
      fetchItemDetails();
    }
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      const response = await apiServices.getData(`api/admin/topics/${itemId}`, {}, true);
      if (response.status === 200) {
        const data = response.data.data;
        // Set form values if editing
        Object.keys(data).forEach((key) => {
          setValue(key as keyof TopicForm, data[key]);
        });
        setImagesUrl(data.images)
      } else {
        showToast('error', 'Failed to load topic details');
      }
    } catch (error) {
      showToast('error', 'An error occurred while fetching data');
    }
  };

  const submitData = async (data: TopicForm) => {
    try {
      setLoading(true);
      const endpoint = isEdit ? `api/admin/topics/${itemId}` : 'api/admin/topics';
      // const method = isEdit ? apiServices.patchData : apiServices.postData;
      // console.log(method)
      console.log(data.imagesUrl)
      if (isEdit) {
        if (data.imagesUrl && data.imagesUrl.length > 0) {
          const base64Images = data.imagesUrl.filter((image) => isBase64Image(image));
          data.imagesUrl = base64Images;
        }
        await apiServices
        .patchData(endpoint, data, {}, true)
        .then((response) => {
          showToast('success', response.data.message);
          // navigate('/topics');
        })
        .catch((error) => {
          console.log(error)
          showToast('error', error.response.data.message);
        })
        .finally(() => setLoading(false));
      }else{
        await apiServices
        .postData(endpoint, data, {}, true)
        .then((response) => {
          console.log(response)
          showToast('success', 'Topic added successfully');
          navigate('/topics');
        })
        .catch((error) => {
          console.log(error)
          showToast('error', error.response.data.message);
        })
        .finally(() => setLoading(false));
      }

    } catch (error) {
      showToast('error', 'An error occurred while submitting data');
    }
  };
  const isBase64Image = (image: string): boolean => {
    const base64Pattern = /^data:image\/(jpeg|jpg|png|gif);base64,/;
    return base64Pattern.test(image);
  };
  

  return (
    <FormTopic
      register={register}
      imagesUrl={imagesUrl}
      handleSubmit={handleSubmit}
      errors={errors}
      submitData={submitData}
      loading={loading}
    />
  );
};

export default TopicFormController;
