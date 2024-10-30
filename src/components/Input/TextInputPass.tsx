import { FiEye } from 'react-icons/fi';
import { FiEyeOff } from 'react-icons/fi';
import React, { useState } from 'react';
import ErrorText from '../Typography/ErrorText';

interface TextInputPasswordProps {
  labelTitle?: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  register?: any;
  placeholder?: string;
  readonly?: boolean;
  updateType: string;
}

const TextInputPassword: React.FC<TextInputPasswordProps> = ({
  labelTitle,
  icon,
  error,
  className,
  placeholder,
  updateType,
  readonly = false,
  register,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full mb-4">
      {labelTitle && (
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          {labelTitle}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-4.5 top-4">{icon}</span>
        <input
          name={updateType}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder || `Enter your ${labelTitle}`}
          className={
            className
              ? className
              : `block w-full rounded border border-stroke bg-gray py-3 ${
                  icon ? 'pl-11.5' : 'pl-6'
                } pr-16 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary mt-2 mb-2`
          }
          readOnly={readonly}
          {...register}
        />
        <button
          type="button"
          className="absolute right-4.5 top-4.5 focus:outline-none"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {error && (
        <ErrorText styleClass="text-start mt-2 text-sm text-red-500 dark:text-red-400">
          {error}
        </ErrorText>
      )}
    </div>
  );
};

export default TextInputPassword;
