import { AlertCircle } from "lucide-react";

const ErrorToolTip = ({ message }: { message: string}) => {
  return (
    <div className="absolute z-10 top-1/2 -translate-y-1/2 left-full ml-2 bg-red-50 border border-red-200 rounded px-2 py-1 shadown-sm">
      <div className="flex items-center">
        <AlertCircle size={14} className="text-red-500 mr-1 flex-shrink-0" />
        <span className="text-xs text-red-600 font-medium">{message}</span>
      </div>
      <div className="absolute top-1/2 -left-1 w-1 h-2 bg-red-50 border-1 border-t border-red-200 transform -rotate-45 translate-y-[-50%]" />
    </div>
  );
};
export default ErrorToolTip