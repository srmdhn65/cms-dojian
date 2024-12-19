import React, { useEffect, useState } from 'react';
import apiServices from '../../../services/apiServices';
import showToast from '../../../helpers/toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { z, ZodType } from 'zod';
import EditUser from './index';
export type FormData = {
    name: string;
    email: string;
    phone: string;
    username: string;
    password?: string | null;
    confirmPassword?: string | null;
    role: string;
};
const UserEditController: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [loading, setLoading] = useState(false);
    const schema: ZodType<FormData> = z
        .object({
            name: z.string().min(1, 'name is required'),
            email: z.string().email('Invalid email'),
            username: z.string().min(1, 'Username is required'),
            phone: z.string().min(1, 'Phone is required'),
            role: z.string().min(1, 'Role is required'),

        })
    // .refine((data) => data.password === data.confirmPassword, {
    //     message: 'Password tidak sama',
    //     path: ['confirmPassword'],
    // });
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    const submitData = async (data: FormData) => {
        try {
            setLoading(true);
            console.log(data);
            await apiServices
                .patchData(`api/admin/users/${userId}`, data, {}, true)
                .then((response) => {
                    setLoading(false);
                    showToast('success', `Data ${data.name} Berhasil Diubah`);
                    navigate(`/users`);
                })
                .catch((error) => {
                    setLoading(false);
                    showToast('error', error.response.data.message);
                    return '';
                });
        } catch (error) { }
    };


    useEffect(() => {
        if (userId) {
            fetchItemDetails();
        }
    }, [userId]);

    const fetchItemDetails = async () => {
        try {
            const response = await apiServices.getData(`api/admin/users/${userId}`, {}, true);
            console.log(response);
            if (response.status === 200) {
                const data = response.data.data;
                Object.keys(data).forEach((key) => {
                    setValue(key as keyof FormData, data[key]);
                });
            } else {
                showToast('error', 'Failed to load topic details');
            }
        } catch (error) {
            console.log(error)
            showToast('error', 'An error occurred while fetching data');
        }
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
