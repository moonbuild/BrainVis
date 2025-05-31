import { NoVisualisations } from "../../../../shared/NoVisualisations";
import { useEEGImageData } from "../../../../stores/eegImageData";

const FilterVisualisation = () => {
  const { filter_plot } = useEEGImageData();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-medium">Filter Visualisation</h2>
      <div className="flex items-center justify-center w-full h-full">
        {!filter_plot ? (
          <NoVisualisations />
        ) : (
          <img
            src={filter_plot.url}
            alt="Filter Comparision Plot"
            className="rounded-md shadow-md"
          />
        )}
      </div>
    </div>
  );
};
export default FilterVisualisation;
