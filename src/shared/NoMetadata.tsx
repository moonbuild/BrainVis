import { FileJson2 } from "lucide-react";

const NoMetadata = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-medium">Analysis Summary</h2>
      </div>
      <div className="text-center text-gray-500 ">
      <FileJson2 className="mx-auto mb-4 opacity-30" size={64} />
      <p className="text-lg">No Summary data available</p>
      <p className="text-sm">Upload a EDF File and fetch a plot to see Summary here</p>
    </div>
    </div>
  );
};
export default NoMetadata;
