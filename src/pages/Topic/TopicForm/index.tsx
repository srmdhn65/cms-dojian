import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import TextInput from '../../../components/Input/TextInput';
import DefaultLayout from '../../../layout/DefaultLayout';
import CustomButton from '../../../components/Button/CustomButton';
import TextAreaCustom from '../../../components/Input/TextArea';
import { TopicForm } from './validation';
import MultipleFileUpload from '../../../components/Input/MultipleUpload';
interface Props {
  register: UseFormRegister<TopicForm>;
  handleSubmit: UseFormHandleSubmit<TopicForm, TopicForm>;
  errors: FieldErrors<TopicForm>;
  imagesUrl: string[];
  submitData: (data: TopicForm) => Promise<void>;
  loading: boolean;
}
const FormTopic: React.FC<Props> = (props) => {
  const updateFormValue = ({ updateType, value }: { updateType: string; value: string[] }) => {
     for (const key in value) {
      props.register('imagesUrl', {
        value: value,
        required: true,
      });
     }
    // setFormData((prevData) => ({
    //   ...prevData,
    //   [updateType]: value, // Update the form state with the new images
    // }));
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Add Topics" />
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">

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
                    icon={
                      <svg
                        className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                            fill=""
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    }
                  />
                  <TextInput
                    labelTitle="Level"
                    placeholder="Level"
                    updateType="level"
                    // inputMode={'numeric'}
                    register={{
                      ...props.register('level'),
                    }}
                    error={props.errors.level?.message}
                  />
                </div>
              
                  <TextInput
                    labelTitle="Point Cost"
                    placeholder="Point Cost"
                    updateType="point_cost"
                    // inputMode={'numeric'}
                    register={{
                      ...props.register('point_cost'),
                    }}
                    error={props.errors.point_cost?.message}
                  />
                  <TextAreaCustom
                    title='Description'
                    placeholder="Description"
                    updateType="description"
                    register={{
                      ...props.register('description'),
                    }}
                    errors={props.errors.description?.message}
                  />
                  <MultipleFileUpload
                    labelTitle="Upload Images"
                    updateType="images"
                    defaultFiles={props.imagesUrl}
                    updateFormValue={updateFormValue}
                    error={props.errors.imagesUrl?.message}
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
  );
};

export default FormTopic;
