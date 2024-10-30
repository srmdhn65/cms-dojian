import{ FC } from 'react';
import ErrorText from '../Typography/ErrorText';

interface TextInputProps {
  labelTitle?: string;
  type?: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  register?: any;
  defaultValue?: string;
  inputMode?: "text" | "search" | "email" | "tel" | "url" | "none" | "numeric" | "decimal" | undefined;
  placeholder?: string;
  readonly?: boolean;
  updateFormValue?: (arg: { updateType: string; value: string }) => void;
  updateType: string;
}

const TextInput: FC<TextInputProps> = ({
  labelTitle,
  type = 'text',
  icon,
  error,
  className,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
  readonly,
  register,
  inputMode = 'text',
}) => {
  // const [value, setValue] = useState<string | undefined>(defaultValue);

  const updateInputValue = (val: string) => {
    updateFormValue && updateFormValue({
      updateType,
      value: val,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateInputValue(event.target.value);
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
        {updateFormValue ? (
          <input
            name={updateType}
            type={type}
            inputMode={inputMode}
            placeholder={placeholder || `Enter your ${labelTitle}`}
            defaultValue={defaultValue}
            onChange={handleChange}
            className={
              className
                ? className
                : `block w-full rounded border border-stroke bg-gray py-3 ${icon ? 'pl-11.5' : 'pl-6'
                } pr-16 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`
            }
            readOnly={readonly}
          />
        ) : (
          <input
            name={updateType}
            type={type}
            inputMode={inputMode} // Specify numeric input mode for numbers
            placeholder={placeholder || `Enter your ${labelTitle}`}
            className={
              className
                ? className
                : `block w-full rounded border border-stroke bg-gray py-3 ${icon ? 'pl-11.5' : 'pl-6'
                } pr-16 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`
            }
            readOnly={readonly}
            {...register}
          />
        )}
      </div>
      {error && (
        <ErrorText styleClass="text-start mt-2 text-sm text-red-500 dark:text-red-400">
          {error}
        </ErrorText>
      )}
    </div>
  );
};

export default TextInput;
