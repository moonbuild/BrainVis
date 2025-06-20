import { Download, LoaderCircle, Sparkles } from "lucide-react";
import { EpochsPlotMap, ImageURLBlob } from "../types/Plot";
import { MetaData, useMetadataStore } from "../stores/summaryStore";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { useEEGImageData } from "../stores/eegImageData";
import { toast } from "react-toastify";

export const DownloadImages = ({}: {}) => {
  const { metadata } = useMetadataStore();
  const { filter_plot, epochs_plot } = useEEGImageData();

  const [downloadURL, setDownloadURL] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const processEventPlotFile = async (
    zip: JSZip,
    eventName: string,
    plotType: string,
    plotData: ImageURLBlob
  ): Promise<boolean> => {
    if (!plotData || !plotData.blob) {
      console.warn(`Missing blob for ${eventName}`);
      return false;
    }
    try {
      const arrayBuffer = await plotData.blob.arrayBuffer();
      const filePath = `${eventName}/${plotType}.png`;

      zip.file(filePath, arrayBuffer);
      return true;
    } catch (err) {
      console.error(`Error processing ${eventName}/${plotType}: ${err}`);
      return false;
    }
  };

  const processFilterFile = async (
    zip: JSZip,
    filterPlot: ImageURLBlob
  ): Promise<boolean> => {
    try {
      const arrayBuffer = filterPlot.blob.arrayBuffer();
      const filePath = "filterPlot.png";
      zip.file(filePath, arrayBuffer);
      return true;
    } catch (err) {
      console.warn(`Error processing Filter Plot: ${err}`);
      return false;
    }
  };

  const processMetadata = async (
    zip: JSZip,
    metadata: MetaData
  ): Promise<boolean> => {
    try {
      const metadataContent = JSON.stringify(metadata);
      const filePath = "metadata.json";
      zip.file(filePath, metadataContent);
      return true;
    } catch (err) {
      console.warn(`Error processing Metadata: ${err}`);
      return false;
    }
  };

  const generateZip = async (
    epochsPlotMap: EpochsPlotMap,
    filterPlot?: ImageURLBlob,
    metadata?: MetaData
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const zip = new JSZip();
      let totalFiles = 0;
      let processedFiles = 0;
      let hasAdditionalContent = false;

      for (const [eventName, eventPlot] of Object.entries(epochsPlotMap)) {
        for (const [plotType, plotData] of Object.entries(eventPlot)) {
          totalFiles++;
          const success = await processEventPlotFile(
            zip,
            eventName,
            plotType,
            plotData
          );
          if (success) processedFiles++;
        }
      }

      if (filterPlot?.blob) {
        const success = await processFilterFile(zip, filterPlot);
        if (success) {
          hasAdditionalContent = true;
        }
      }
      if (metadata) {
        const success = await processMetadata(zip, metadata);
        if (success) {
          hasAdditionalContent = true;
        }
      }
      if (totalFiles === 0 && !hasAdditionalContent) {
        setError("No Valid Files to compress");
        setIsLoading(false);
        return;
      }
      if (totalFiles > 0 && processedFiles === 0 && !hasAdditionalContent) {
        setError("Failed to Process Files");
        setIsLoading(false);
        return;
      }
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      });
      const url = URL.createObjectURL(zipBlob);
      setDownloadURL(url);
    } catch (err) {
      setError("Failed to generate zip file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadURL) {
      const filename = "events_plot.zip";
      const link = document.createElement("a");
      link.download = filename;
      link.href = downloadURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      generateZip(epochs_plot, filter_plot, metadata);
    }
  };

  useEffect(() => {
    return () => {
      if (downloadURL) {
        URL.revokeObjectURL(downloadURL);
      }
    };
  }, [downloadURL]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error, {
        isLoading: false,
        autoClose: 6000,
        pauseOnHover: true,
      });
    }
  }, [error]);

  return (
    <button
      onClick={handleDownload}
      className="bg-orange-500 cursor-pointer p-2 rounded-lg hover:bg-orange-600"
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2 text-white">
          Generating Zip <LoaderCircle size={18} className="animate-spin" />
        </span>
      ) : downloadURL ? (
        <span className="flex items-center gap-2 text-white">
          Download Zip <Download size={18} />
        </span>
      ) : (
        <span className="flex items-center gap-2 text-white">
          Generate Zip <Sparkles size={18} />
        </span>
      )}
    </button>
  );
};
