import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import CustomButton from '../../../components/Button/CustomButton';
import TextInput from '../../../components/Input/TextInput';
import Loader from '../../../common/Loader';
import { BadgeForm } from './validation';
import TextAreaCustom from '../../../components/Input/TextArea';
import FileDropzone from '../../../components/Input/DropZone';
import { BadgeInterface } from '../../../types/badge';
interface Props {
  register: UseFormRegister<BadgeForm>;
  handleSubmit: UseFormHandleSubmit<BadgeForm, BadgeForm>;
  errors: FieldErrors<BadgeForm>;
  submitData: (data: BadgeForm) => Promise<void>;
  loading: boolean;
  isEdit: boolean;
  badge: BadgeInterface;
  itemId: string | undefined;
  icon: File | undefined;
  setIcon: (file: File) => void;
}
const FormBadges: React.FC<Props> = (props) => {



  return (
    props.loading ? (
      <Loader />
    ) : (
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Badge Form" />
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={props.handleSubmit(props.submitData)}>
                  <TextInput
                    labelTitle="Name"
                    placeholder="Type name here"
                    updateType="name"
                    error={props.errors.name?.message}
                    register={{
                      ...props.register('name'),
                    }}
                  />
                  <TextAreaCustom
                    title="Description"
                    placeholder="Type description here"
                    updateType="description"
                    errors={props.errors.description?.message}
                    register={{
                      ...props.register('description'),
                    }}
                  />
                  <FileDropzone
                    title='Upload Icon'
                    updateType="icon"
                      defaultValue={props.isEdit && !props.icon ? props.badge.icon : ''}
                    multiple={true}
                    updateInputValue={(data) => {
                      props.setIcon(data.value);
                    }}
                  />
                  <div className="flex justify-end gap-4.5">
                    <CustomButton label="Save" type="submit" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    )
  )
};

export default FormBadges;
