import { ChangeEvent, useState } from "react";

type InputType = "text" | "number";
type InputSize = "small" | "medium" | "large";

interface CustomInputProps {
  type?: InputType;
  placeholder?: "";
  value?: "";
  defaultValue?: "";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  isError?: boolean;
  suffixIcon?: React.ReactNode;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  size?: InputSize;
}

const CustomInput = ({
  type = "text",
  placeholder = "",
  value = "",
  defaultValue = "",
  onChange,
  id,
  name,
  className = "",
  style = {},
  disabled = false,
  isError = false,
  suffixIcon,
  minLength,
  maxLength,
  pattern,
  autoComplete = "off",
  autoFocus = false,
  readOnly = false,
  fullWidth = false,
  size = "medium",
}: CustomInputProps) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e);
  };

  const containerClasses = `relative ${
    fullWidth ? "w-full" : "w-auto"
  } ${className ?? ''}`;

  const inputSizeClasses = {
    small: "px-2 py-1 text-sm h-8",
    medium: "px-3 py-2  h-10",
    large: "px-3 py-2  h-10",
  };

  const inputClasses = `
    rounded-md 
    ${inputSizeClasses[size]} 
    bg-white 
    ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
    ${isError ? "border-red-500" : "border-gray-300 focus:border-orange-500"}
    border
    outline-none transition-all duration-200 focus-ring-2 
    ${isError ? "focus:ring-red-500" : "focus:ring-orange-500"}
    focus:border-transparet
    ${suffixIcon ? "pr-10" : ""}
    ${fullWidth ? "w-full" : "w-auto"}
    `;
  return (
    <div className={containerClasses} style={style}>
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        value={inputValue}
        defaultValue={defaultValue}
        type={type}
        className={inputClasses}
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        readOnly={readOnly}
        onChange={handleChange}
      />
      {suffixIcon && (
        <span
          className="absoulte inset-block right-2 flex items-center pointer-events-none"
          draggable={false}
        >
          {suffixIcon}
        </span>
      )}
    </div>
  );
};

export default CustomInput;
