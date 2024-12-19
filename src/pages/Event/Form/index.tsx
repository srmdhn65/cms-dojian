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
import { EventForm } from './validation';
import TextAreaCustom from '../../../components/Input/TextArea';
import FileDropzone from '../../../components/Input/DropZone';
import { EventInterface } from '../../../types/event';
import SelectCustomObject from '../../../components/Select/SelectCustom';
import { useState } from 'react';
interface Props {
  badgesList: EventInterface[];
  badgesSelected: string;
  setBadgesSelected: React.Dispatch<React.SetStateAction<string>>;
  register: UseFormRegister<EventForm>;
  handleSubmit: UseFormHandleSubmit<EventForm, EventForm>;
  errors: FieldErrors<EventForm>;
  submitData: (data: EventForm) => Promise<void>;
  loading: boolean;
  isEdit: boolean;
  event: EventInterface;
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
          <Breadcrumb pageName="Event Form" />
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
                      placeholder="name"
                      updateType="name"
                      error={props.errors.name?.message}
                      register={{
                        ...props.register('name'),
                      }}
                    />
                    <SelectCustomObject
                      title="Badges Reward"
                      items={props.badgesList.map((item) => ({
                        label: item.name || '',
                        value: item.id?.toString() || '',
                      }))}
                      defaultValue={
                        {
                          label: props.badgesList.find((item) => item.id?.toString() === props.badgesSelected)?.name || '',
                          value: props.badgesSelected
                        }
                      }
                      placeholder="Pilih Salah satu"
                      onChange={(selectedOption) => {
                        props.setBadgesSelected(selectedOption.value);
                        props.register('rewardBadge', {
                          value: selectedOption.value,
                        })
                      }} // Handle selected option
                      errors={props.errors.rewardBadge?.message} updateType='rewardBadges'
                    />
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <TextInput
                      labelTitle="Reward Coint"
                      placeholder="Reward Coint"
                      updateType="rewardCoints"
                      error={props.errors.rewardCoins?.message}
                      register={{
                        ...props.register('rewardCoins'),
                      }}
                    />
                    <TextInput
                      labelTitle="Reward XP"
                      placeholder="Reward XP"
                      updateType="rewardXp"
                      error={props.errors.rewardXp?.message}
                      register={{
                        ...props.register('rewardXp'),
                      }}
                    />
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                    <TextInput
                      labelTitle="Tanggal Mulai"
                      placeholder="Tanggal Mulai"
                      type='date'
                      updateType="startDate"
                      error={props.errors.startDate?.message}
                      register={{
                        ...props.register('startDate'),
                      }}
                    />
                    <TextInput
                      labelTitle="Tanggal Selesai"
                      placeholder="Tanggal Selesai"
                      type='date'
                      updateType="endDate"
                      error={props.errors.endDate?.message}
                      register={{
                        ...props.register('endDate'),
                      }}
                    />
                  </div>
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
                    updateType="image"
                    defaultValue={props.isEdit && !props.icon ? props.event.image ?? '' : ''}
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
