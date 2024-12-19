import React, { useState, useEffect } from 'react';
import apiServices from '../../../services/apiServices';
import showToast from '../../../helpers/toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import schema, { EventForm } from './validation';
import FormQuestion from '.';
import { EventInterface } from '../../../types/event';


const EventFormController: React.FC = () => {
  const navigate = useNavigate();
  const [badge, setBadge] = useState<EventInterface>();
  const [icon, setIcon] = useState<File>();
  const [loading, setLoading] = useState(false);
  const { itemId } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [badgesList, setBadgesList] = useState<EventInterface[]>([]);
  const [badgesSelected, setBadgesSelected] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(schema.post),
  });
  useEffect(() => {
    fetchItems();
    if (itemId) {
      setIsEdit(true);
      fetchItemDetails();
    }
  }, []);
  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      await apiServices.getData(`api/admin/events/${itemId}`, {}, true).then((response) => {
        const data: EventInterface = response.data.data;
        const EventForm = response.data.data;
        setIcon(EventForm.image)
        setBadgesSelected(EventForm.rewardBadge)
        setBadge(data);
        Object.keys(EventForm).forEach((key) => {
          setValue(key as keyof EventForm, EventForm[key]);
        });
      }).catch((error: any) => {
        showToast('error', 'Failed to load question details');
      }).finally(() => setLoading(false));
    } catch (error) {
      setLoading(false);
      showToast('error', 'An error occurred while fetching data');
    }
  };
  const submitData = async (data: EventForm) => {
    try {
      const body = data;
      setLoading(true);
      if (isEdit) {
        await apiServices
          .uploadFile('api/admin/events', body, { image: icon! }, {}, true, "PATCH")
          .then((response) => {
            showToast('success', response.data.message);
            navigate('/events');
          })
          .catch((error) => {
            showToast('error', error.response.data.message);
            return '';
          }).finally(() => setLoading(false));
      } else {
        if (!icon) {
          showToast('error', 'Image is required');
          return;
        }
        await apiServices
          .uploadFile('api/admin/events', body, { image: icon }, {}, true, "POST")
          .then((response) => {
            showToast('success', response.data.message);
            navigate('/events');
          })
          .catch((error) => {
            showToast('error', error.response.data.message);
            return '';
          }).finally(() => setLoading(false));
      }
    } catch (error) { }
  };

  const fetchItems = async () => {
    try {
      let params = '';
      const response = await apiServices.getData(
        'api/admin/badges-pluck',
        {
          name: params,
        },
        true,
      );
      const data = response.data;
      if (response.status === 200) {
        let datas = data.data
        setBadgesList(datas);
      } else {
        setBadgesList([]);
      }
    } catch (error) {
      setBadgesList([]);

    }
  };

  return (
    <FormQuestion
      badgesList={badgesList}
      badgesSelected={badgesSelected}
      setBadgesSelected={setBadgesSelected}
      register={register}
      isEdit={isEdit}
      itemId={itemId}
      icon={icon}
      event={badge!}
      setIcon={setIcon}
      handleSubmit={handleSubmit}
      errors={errors}
      submitData={submitData}
      loading={loading}
    />
  );
};

export default EventFormController;

