import React, { useState } from 'react';
import ErrorText from '../Typography/ErrorText';

interface TextAreaCustomProps {
  title: string;
  updateType: string;
  defaultValue?: string;
  updateFormValue?: (arg: { updateType: string; value: string }) => void;
  placeholder?: string;
  errors?: string;
  register: any;
  icon?: React.ReactNode;
}

const TextAreaCustom: React.FC<TextAreaCustomProps> = ({
  title,
  updateType,
  defaultValue,
  updateFormValue,
  icon,
  placeholder,
  errors,
  register,
}) => {
  const [value, setValue] = useState<string | undefined>(defaultValue);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target.value;
    setValue(val);
    updateFormValue!({
      updateType,
      value: val,
    });
  };

  return (
    <div className="w-full mb-4">
        {title && (
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          {title}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-4 top-4">{icon}</span>}
        <textarea
          name={updateType}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          {...register}
        ></textarea>{' '}
        {errors && (
          <ErrorText styleClass="text-start mt-2 text-sm text-red-500 dark:text-red-400">
            {errors}
          </ErrorText>
        )}
      </div>
    </div>
  );
};

export default TextAreaCustom;
