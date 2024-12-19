import React from 'react';
import ErrorText from '../Typography/ErrorText';

interface SelectCustomProps {
  title: string;
  updateType: string;
  className?: string;
  items: { label: string; value: string }[]; // Label and value for react-select
  register?: any;
  errors?: string;
  placeholder?: string;
  defaultValue?: string; // Updated type to match option format
}

const SelectCustom: React.FC<SelectCustomProps> = ({
  title,
  updateType,
  className,
  placeholder,
  errors,
  items,
  register,
  defaultValue,
}) => {
  return (
    <div className="w-full mb-4">
      {title && (
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          {title}
        </label>
      )}
      <div className="relative z-20 bg-white dark:bg-form-input">
        <select
          id={updateType}
          className={
            className
              ? className
              : `block w-full rounded border border-stroke bg-gray py-3  pl-5 pr-16 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`
          }
          {...register}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {items.map((item, index) => (
            <option key={index} defaultValue={defaultValue} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>{' '}
        {errors && (
          <ErrorText styleClass="text-start mt-2 text-sm text-red-500 dark:text-red-400">
            {errors}
          </ErrorText>
        )}
      </div>
    </div>
  );
};

export default SelectCustom;
