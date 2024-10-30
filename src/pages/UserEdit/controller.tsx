import React, { useState } from 'react';
import apiServices from '../../services/apiServices';
import showToast from '../../helpers/toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { z, ZodType } from 'zod';
import EditUser from './index';
export type FormData = {
  fullname: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
};
const UserEditController: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const schema: ZodType<FormData> = z
    .object({
      fullname: z.string().min(1, 'Nama tidak boleh kosong'),
      email: z
        .string()
        .email('Email tidak valid')
        .min(1, 'Email tidak boleh kosong'),
      address: z.string().min(1, 'Alamat tidak boleh kosong'),
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
        .patchData(`api/admin/users/${userId}`, data, {}, true)
        .then((response) => {
          setLoading(false);
          const data = response.data.data;
          localStorage.setItem('token', data.token);
          showToast('success', 'Berhasil Login');
          navigate('/');
        })
        .catch((error) => {
          setLoading(false);
          showToast('error', error.response.data.message);
          return '';
        });
    } catch (error) { }
  };
  return (
    <EditUser
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      submitData={submitData}
      loading={loading}
    />
  );
};

export default UserEditController;
