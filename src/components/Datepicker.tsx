import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import classNames from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from "react-bootstrap";
import { FieldErrors } from "react-hook-form";

interface DatepickerInputProps {
  onClick?: () => void;
  value?: string;
  inputClass?: string;
  children?: React.ReactNode;
}

/* Datepicker with Input */
const DatepickerInput = forwardRef<HTMLInputElement, DatepickerInputProps>(
  ({ onClick, value, inputClass }, ref) => (
    <input
      type="text"
      className={classNames("form-control", inputClass)}
      onClick={onClick}
      value={value}
      readOnly
      ref={ref}
    />
  )
);

/* Datepicker with Addon Input */
const DatepickerInputWithAddon = forwardRef<
  HTMLDivElement,
  DatepickerInputProps
>(({ onClick, value, inputClass }, ref) => (
  <div className="input-group input-group-sm" ref={ref}>
    <input
      type="text"
      className={classNames("form-control", inputClass)}
      onClick={onClick}
      value={value}
      readOnly
    />
    <span className="input-group-text bg-blue border-blue text-white">
      <i className="mdi mdi-calendar-range"></i>
    </span>
  </div>
));

interface HyperDatepickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  hideAddon?: boolean;
  inputClass?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  showTimeSelect?: boolean;
  register?: any;
  timeIntervals?: number;
  timeCaption?: string;
  timeFormat?: string;
  showTimeSelectOnly?: boolean;
  monthsShown?: number;
  inline?: boolean;
  containerClass?: string;
  label?: string;
  labelClassName?: string;
  name?: string;
  errors: FieldErrors;
}

const HyperDatepicker: React.FC<HyperDatepickerProps> = ({
  value,
  onChange,
  hideAddon = false,
  inputClass = "",
  dateFormat = "MM/dd/yyyy",
  minDate,
  maxDate,
  showTimeSelect = false,
  register,
  timeIntervals,
  timeCaption,
  timeFormat = "hh:mm a",
  showTimeSelectOnly = false,
  monthsShown,
  inline = false,
  containerClass = "",
  label,
  labelClassName,
  name,
  errors,
}) => {
  const input = hideAddon ? (
    <DatepickerInput inputClass={inputClass} value={value?.toDateString()} />
  ) : (
    <DatepickerInputWithAddon inputClass={inputClass} value={value?.toDateString()} />
  );

  return (
    <>
      <Form.Group className={containerClass}>
        {label ? <Form.Label className={labelClassName}>{label}</Form.Label> : null}

        <DatePicker
          customInput={input}
          timeIntervals={timeIntervals}
          selected={value}
          onChange={(date) => onChange(date as Date | null)}
          showTimeSelect={showTimeSelect}
          timeFormat={timeFormat}
          timeCaption={timeCaption}
          dateFormat={dateFormat}
          minDate={minDate}
          maxDate={maxDate}
          monthsShown={monthsShown}
          showTimeSelectOnly={showTimeSelectOnly}
          inline={inline}
          autoComplete="off"
          {...(register && name ? register(name) : {})}
        />

        {errors && name && errors[name] ? (
          <Form.Control.Feedback type="invalid">
            {errors[name]?.message || "Input tidak valid"}
          </Form.Control.Feedback>
        ) : null}
      </Form.Group>
    </>
  );
};

export default HyperDatepicker;
