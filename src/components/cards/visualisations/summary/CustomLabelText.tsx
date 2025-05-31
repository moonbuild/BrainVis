import React from "react";

const CustomLabelText = ({
  label,
  icon,
  value,
  valueClassName,
}: {
  label: React.ReactNode;
  icon?: React.ReactNode;
  value: number | string;
  valueClassName?: string;
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-4">
        {icon}
        <span className="text-gray-600">{label}:</span>
      </div>
      <span className={valueClassName ?? "font-medium"}>{value}</span>
    </div>
  );
};
export default CustomLabelText;
