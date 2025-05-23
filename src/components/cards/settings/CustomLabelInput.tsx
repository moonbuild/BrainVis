import { X } from "lucide-react";
import { ChangeEvent } from "react";

interface CustomLabelInputProps {
  label: React.ReactNode;
  name: string;
  type: string;
  value?: number | string;
  errorMessage?: string;
  onChange? : (e:ChangeEvent<HTMLInputElement>) => void;
}
const CustomLabelInput = ({
  label,
  name,
  type,
  value,
  errorMessage,
  onChange
}: CustomLabelInputProps) => {
  if (!value) {
    return <div />;
  }
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500 ">{label}</label>
      <input
        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-blue-500 transition-all text-gray-800"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
      {errorMessage && (
        <div className=" flex items-center  ml-1 space-x-1">
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
