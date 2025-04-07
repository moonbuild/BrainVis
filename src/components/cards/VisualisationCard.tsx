import { BarChart } from "lucide-react";
import {
  useFileDataStore,
  useFinalSubmitData,
} from "../../stores/eegSettingsStore";
import { useFilterVis } from "../../services/hooks/useFilterVis";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export const VisualisationCard = () => {
  const toastId = useRef<string | number | null>(null);

  const { file } = useFileDataStore();
  const { data, isSubmit, setIsSubmit } = useFinalSubmitData();
  const {
    mutate: uploadFileData,
    isPending,
    error,
    data: imageBlob,
  } = useFilterVis();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    console.log("This is data: ", data);
    if (file && isSubmit) {
      uploadFileData({ file, data });
      setIsSubmit(false);
    }
  }, [data, isSubmit]);

  useEffect(() => {
    if (imageBlob && !error) {
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [imageBlob, error]);

  useEffect(() => {
    if (isPending && !toastId.current) {
      toastId.current = toast.loading("Generating Filter Comparision...");
    } else if (!isPending && toastId.current) {
      toast.update(toastId.current, {
        render: "Filter Plot ready!",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        pauseOnHover: true,
      });
    } else if (error && toastId.current) {
      toast.update(toastId.current, {
        render: "Failed to fetch channel names",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        pauseOnHover: true,
      });
    }
  }, [isPending, error]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold =">Visualisations</h2>
          </div>
          <div className="tex-sm text-gray-500">
            Showing results for:
            <span className="font-medium">
              {file ? file.name : "No file selected"}
            </span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg min-h-96 flex items-center justify-center p-6">
          {isPending ? (
            <p className="">Loading...</p>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              className="transition-opacity duration-300"
              alt="Filtered Visualisation"
            />
          ) : (
            <div className="btext-center text-gray-500">
              <BarChart className="mx-auto mb-4 opacity-30" size={64} />
              <p className="text-lg">No Visualisation data available</p>
              <p className="text-sm">
                Upload a EDF file to see visualisations here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
