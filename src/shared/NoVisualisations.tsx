import { BarChart } from "lucide-react";

export const NoVisualisations = () => {
  return (
    <div className="text-center text-gray-500 ">
      <BarChart className="mx-auto mb-4 opacity-30" size={64} />
      <p className="text-lg">No Visualisation data available</p>
      <p className="text-sm">Upload a EDF file to see visualisations here</p>
    </div>
  );
};
