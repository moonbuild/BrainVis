import { Activity, BarChart, FileText, FilterIcon } from "lucide-react";
import { useFileDataStore } from "../../../stores/fileStore";
import Summary from "./summary/Summary";
import FilterVisualisation from "./filter/FilterVisualisation";
import EventVisualisation from "./events/EventVisualisation";
import { VisualisationCardProps } from "../../../types/VisualisationCard";

export const VisualisationCard = ({
  visualisationActiveTab,
  setVisualisationActiveTab,
}: VisualisationCardProps) => {
  const { file } = useFileDataStore();

  return (
    <div className="bg-white rounded-xl shadow-md ">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold ">Visualisations</h2>
          </div>
          <div className="text-sm text-gray-500">
            Showing results for:{" "}
            <span className="font-medium">
              {file ? file.name : "No file selected"}
            </span>
          </div>
        </div>
        <div className="border-b border-gray-300">
          <div className="flex">
            <button
              className={`px-6 py-4 font-medium cursor-pointer flex items-center ${
                visualisationActiveTab === "filter"
                  ? "border-b-2 text-orange-500 border-orange-500"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setVisualisationActiveTab("filter")}
            >
              <FilterIcon className="mr-2" /> Filter Comparision
            </button>
            <button
              className={`px-6 py-4 font-medium cursor-pointer flex items-center ${
                visualisationActiveTab === "events"
                  ? "border-b-2 text-orange-500 border-orange-500"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setVisualisationActiveTab("events")}
            >
              <Activity className="mr-2" /> Epoch Visualisation
            </button>
            <button
              className={`px-6 py-4 font-medium cursor-pointer flex items-center ${
                visualisationActiveTab === "summary"
                  ? "border-b-2 text-orange-500 border-orange-500"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setVisualisationActiveTab("summary")}
            >
              <FileText className="mr-2" /> Summary
            </button>
          </div>
        </div>
        <div className="p-6">
          {visualisationActiveTab === "filter" && <FilterVisualisation />}
          {visualisationActiveTab === "events" && <EventVisualisation />}
          {visualisationActiveTab === "summary" && <Summary />}
        </div>
      </div>
    </div>
  );
};
