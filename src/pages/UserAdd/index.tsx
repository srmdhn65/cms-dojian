import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TextInput from '../../components/Input/TextInput';
import DefaultLayout from '../../layout/DefaultLayout';
import SelectCustom from '../../components/Select/Select';
import TextInputPassword from '../../components/Input/TextInputPass';
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import CustomButton from '../../components/Button/CustomButton';
export type FormData = {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
};
interface Props {
  register: UseFormRegister<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData, FormData>;
  errors: FieldErrors<FormData>;
  submitData: (data: FormData) => Promise<void>;
  loading: boolean;
}
const AddUser: React.FC<Props> = (props) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Tambah User" />
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Personal Information
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={props.handleSubmit(props.submitData)}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <TextInput
                    labelTitle="Name"
                    placeholder="Name"
                    updateType="name"
                    error={props.errors.name?.message}
                    register={{
                      ...props.register('name'),
                    }}                  
                  />
                  <TextInput
                    labelTitle="Phone Number"
                    placeholder="Phone Number"
                    updateType="phone"
                    register={{
                      ...props.register('phone'),
                    }}
                    error={props.errors.phone?.message}
                  />
                </div>
                <TextInput
                    labelTitle="Name"
                    placeholder="Name"
                    updateType="username"
                    error={props.errors.username?.message}
                    register={{
                      ...props.register('username'),
                    }}
                    
                  />
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <TextInput
                    labelTitle="Email"
                    placeholder="email"
                    updateType="email"
                    error={props.errors.email?.message}
                    register={{
                      ...props.register('email'),
                    }}
                  
                  />
                  <SelectCustom
                    title="Role"
                    updateType="role"
                    placeholder="Silahkan Pilih"
                    errors={props.errors.role?.message}
                    register={{
                      ...props.register('role'),
                    }}
                    items={['Admin', 'User']}
                  />
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <TextInputPassword
                    labelTitle="Password"
                    updateType="password"
                    error={props.errors.password?.message}
                    register={{
                      ...props.register('password'),
                    }}
                  />
                  <TextInputPassword
                    labelTitle="Password"
                    updateType="confirm_password"
                    error={props.errors.confirmPassword?.message}
                    register={{
                      ...props.register('confirmPassword'),
                    }}
                  />
                </div>
                <div className="flex justify-end gap-4.5">
                  <CustomButton label="Save" type="submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddUser;
