import React, { useState, useEffect } from 'react';
import apiServices from '../../../services/apiServices';
import showToast from '../../../helpers/toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import schema, { BadgeForm } from './validation';
import FormQuestion from '.';
import { BadgeInterface } from '../../../types/badge';

const BadgeFormController: React.FC = () => {
  const navigate = useNavigate();
  const [badge, setBadge] = useState<BadgeInterface>();
  const [icon, setIcon] = useState<File>();
  const [loading, setLoading] = useState(false);
  const { itemId } = useParams();
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BadgeForm>({
    resolver: zodResolver(schema.post),
  });
  useEffect(() => {
    if (itemId) {
      setIsEdit(true);
      fetchItemDetails();
    }
  }, []);
  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      await apiServices.getData(`api/admin/badges/${itemId}`, {}, true).then((response) => {
        const data: BadgeInterface = response.data.data;
        const BadgeForm = response.data.data;
        setBadge(data);
        Object.keys(BadgeForm).forEach((key) => {
          setValue(key as keyof BadgeForm, BadgeForm[key]);
        });
      }).catch((error: any) => {
        showToast('error', 'Failed to load question details');
      }).finally(() => setLoading(false));
    } catch (error) {
      console.log(error)
      setLoading(false);
      showToast('error', 'An error occurred while fetching data');
    }
  };
  const submitData = async (data: BadgeForm) => {
    try {
      const body = data;
      setLoading(true);
      if (isEdit) {
        await apiServices
          .uploadFile('api/admin/badges', {
            "name": body.name,
            "description": body.description,
          }, { icon: icon! }, {}, true, "PATCH")
          .then((response) => {
            showToast('success', response.data.message);
            // navigate('/badges');
          })
          .catch((error) => {
            showToast('error', error.response.data.message);
            return '';
          }).finally(() => setLoading(false));
      } else {
        if (!icon) {
          showToast('error', 'Icon is required');
          return;
        }
        await apiServices
          .uploadFile('api/admin/badges', {
            "name": body.name,
            "description": body.description,
          }, { icon: icon }, {}, true, "POST")
          .then((response) => {
            console.log(response)
            showToast('success', response.data.message);
            // navigate('/badges');
          })
          .catch((error) => {
            console.log(error)
            showToast('error', error.response.data.message);
            return '';
          }).finally(() => setLoading(false));
      }
    } catch (error) { }
  };

  return (
    <FormQuestion
      register={register}
      isEdit={isEdit}
      itemId={itemId}
      icon={icon}
      badge={badge!}
      setIcon={setIcon}
      handleSubmit={handleSubmit}
      errors={errors}
      submitData={submitData}
      loading={loading}
    />
  );
};

export default BadgeFormController;

