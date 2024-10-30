import React, { useState } from 'react';
import apiServices from '../../services/apiServices';
import AddUser from './index';
import showToast from '../../helpers/toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z, ZodType } from 'zod';
export type FormData = {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
};
const UserAddController: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const schema: ZodType<FormData> = z
    .object({
      name: z.string().min(1, 'Nama tidak boleh kosong'),
      email: z
        .string()
        .email('Email tidak valid')
        .min(1, 'Email tidak boleh kosong'),
      phone: z.string().min(1, 'Nomor telepon tidak boleh kosong'),
      username: z.string().min(1, 'Username tidak boleh kosong'),
      password: z.string().min(1, 'Password tidak boleh kosong'),
      confirmPassword: z
        .string()
        .min(1, 'Konfirmasi password tidak boleh kosong'),
      role: z.string().min(1, 'Role tidak boleh kosong'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password tidak sama',
      path: ['confirmPassword'],
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const submitData = async (data: FormData) => {
    try {
      setLoading(true);
      await apiServices
        .postData('api/admin/users', data, {}, true)
        .then((response) => {
          setLoading(false);
          showToast('success', 'Berhasil Login');
          navigate('/users');
        })
        .catch((error) => {
          setLoading(false);
          showToast('error', error.response.data.message);
          return '';
        });
    } catch (error) {}
  };
  return (
    <AddUser
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      submitData={submitData}
      loading={loading}
    />
  );
};

export default UserAddController;
