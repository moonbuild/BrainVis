import { Info, X } from "lucide-react";
import { ChangeEvent } from "react";
import { SettingsDataProps } from "../../../types/Settings";
import { initialSettingsData } from "./initialSettingsData";

interface CustomLabelInputProps {
  label: React.ReactNode;
  name: string;
  value?: number | string;
  placeholder: string;
  errorMessage?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
const CustomLabelInput = ({
  label,
  name,
  value,
  placeholder,
  errorMessage,
  onChange,
}: CustomLabelInputProps) => {
  const defaultValue =
    name === "epochBaseline"
      ? "None, 0"
      : initialSettingsData[name as keyof SettingsDataProps];
  return (
    <div className="space-y-1">
      <label className="ml-1 text-sm font-medium text-gray-500 truncate">
        {label}
      </label>
      <div className="relative">
        <input
          className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 placeholder:text-sm focus:outline-none focus:ring-blue-500 transition-all text-gray-800 truncate"
          type="text"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        <div className="absolute group inset-y-0 right-2 top-0 flex items-center justify-center">
          <Info className="text-blue-500" size={18} />
          <div className="absolute right-full mb-1 hidden  group-hover:block whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-sm text-white shadow-lg">
            By default value is {defaultValue}
          </div>
        </div>
      </div>
      {errorMessage && (
        <div className="flex items-center  ml-1 space-x-1">
          <X className="text-red-500" size={14} />
          <span className="text-red-500 text-xs font-medium">
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
};
export default CustomLabelInput;
