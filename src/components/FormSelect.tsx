import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Form } from "react-bootstrap";
import { FieldErrors, Control, Controller } from "react-hook-form";

interface SelectInputProps {
    name: string;
    label?: string;
    options: Array<{ value: string; label: string }>;
    control?: Control<any>;
    errors?: FieldErrors;
    className?: string;
    onChange?: (selectedValue: any) => void;
    placeholder?: string;
    isMulti?: boolean;
    labelClassName?: string;
    containerClass?: string;
    defaultValue?: string; // Add a prop for default value
}

const SelectInput: React.FC<SelectInputProps> = ({
    name,
    label,
    options,
    control,
    errors,
    className,
    placeholder,
    isMulti = false,
    onChange,
    labelClassName,
    containerClass,
    defaultValue,
}) => {
    const [localValue, setLocalValue] = useState<string | string[] | null>(
        defaultValue || (isMulti ? [] : null)
    );

    useEffect(() => {
        if (defaultValue) {
            setLocalValue(isMulti ? [defaultValue] : defaultValue);
        }
    }, [defaultValue, isMulti]);

    const handleChange = (selected: any) => {
        const value = isMulti
            ? selected.map((option: any) => option.value)
            : selected?.value;

        if (control) {
            // react-hook-form case
            return value;
        } else {
            // Local state case
            setLocalValue(value);
            if (onChange) {
                onChange(value);
            }
        }
    };

    return (
        <Form.Group className={containerClass}>
            {label && <Form.Label className={labelClassName}>{label}</Form.Label>}

            {control ? (
                <Controller
                    name={name}
                    control={control}
                    defaultValue={localValue}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={options}
                            isMulti={isMulti}
                            classNamePrefix="react-select"
                            className={className}
                            placeholder={placeholder || "Select..."}
                            onChange={(selected: any) => {
                                const value = isMulti
                                    ? selected.map((option: any) => option.value)
                                    : selected?.value;

                                field.onChange(value);
                                if (onChange) {
                                    onChange(value);
                                }
                            }}
                            value={
                                isMulti
                                    ? options.filter((option) =>
                                        (field.value || []).includes(option.value)
                                    )
                                    : options.find((option) => option.value === field.value)
                            }
                        />
                    )}
                />
            ) : (
                <Select
                    options={options}
                    isMulti={isMulti}
                    classNamePrefix="react-select"
                    className={className}
                    placeholder={placeholder || "Select..."}
                    onChange={handleChange}
                    value={
                        isMulti
                            ? options.filter((option) =>
                                (localValue as string[]).includes(option.value)
                            )
                            : options.find((option) => option.value === localValue)
                    }
                />
            )}

            {errors && errors[name] && (
                <div className="text-danger">{errors[name]?.message}</div>
            )}
        </Form.Group>
    );
};

export default SelectInput;
