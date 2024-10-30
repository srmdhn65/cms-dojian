import React, { useEffect } from 'react';
import Select from 'react-select';
import ErrorText from '../Typography/ErrorText';

interface SelectCustomObjectProps {
  title: string;
  updateType: string;
  className?: string;
  items: { label: string; value: string }[]; // Label and value for react-select
  errors?: string;
  placeholder?: string;
  isSearchable?: boolean;
  defaultValue?: { label: string; value: string }; // Updated type to match option format
  onChange?: (selectedOption: any) => void; // Handle selection change
}

const SelectCustomObject: React.FC<SelectCustomObjectProps> = ({
  title,
  className,
  placeholder,
  errors,
  items,
  onChange,
  updateType,
  isSearchable = false,
  defaultValue,
}) => {
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    if(defaultValue){
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);


  // Custom styles with dark mode support
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.selectProps.menuIsOpen ? 'transparent' : 'var(--tw-bg-gray)',
      borderColor: state.isFocused ? 'var(--tw-border-primary)' : 'var(--tw-border-stroke)',
      color: 'var(--tw-text-black)',
      boxShadow: state.isFocused ? '0 0 0 1px var(--tw-border-primary)' : 'none',
      '&:hover': {
        borderColor: 'var(--tw-border-primary)',
      },
      transition: 'all 0.2s',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'var(--tw-bg-white)',
      borderRadius: '0.25rem',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'var(--tw-text-black)',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'var(--tw-text-gray)',
    }),
  };

  return (
    loading ? (
      <div></div> 
    ) : (
      <div className="w-full mb-4">
      {title && (
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          {title}
        </label>
      )}
      <div className="relative z-20 bg-white dark:bg-form-input">
        <Select
          isSearchable={isSearchable}
          name={updateType}
          className={className || 'single-basic'}
          classNamePrefix="select"
          options={items}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          styles={customStyles} // Apply custom styles for light and dark mode
        />
        {errors && (
          <ErrorText styleClass="text-start mt-2 text-sm text-red-500 dark:text-red-400">
            {errors}
          </ErrorText>
        )}
      </div>
    </div>
    )
  );
};

export default SelectCustomObject;
