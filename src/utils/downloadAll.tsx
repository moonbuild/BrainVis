import { useEffect, useState } from "react";
import { EpochsPlotMap, ImageURLBlob } from "../types/Plot";
import { AsyncZipDeflate, Zip } from "fflate";
import { Download, LoaderCircle, Sparkles } from "lucide-react";
import { MetaData } from "../stores/summaryStore";

export const DownloadImages = ({
  epochsPlotMap,
  filterPlot,
  metadata,
}: {
  epochsPlotMap: EpochsPlotMap;
  filterPlot?: ImageURLBlob;
  metadata?: MetaData;
}) => {
  const [downloadURL, setDownloadURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const processEventPlotFile = async (
    zip: Zip,
    eventName: string,
    plotType: string,
    plotData: ImageURLBlob,
    processedFiles: number
  ): Promise<boolean> => {
    if (!plotData || !plotData.blob) {
      console.warn(`Missing blob for ${eventName} - ${plotType}`);
      return false;
    }
    try {
      const arrayBuffer = await plotData.blob.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const filePath = `${eventName}/${eventName}_${plotType}.png`;

      const asyncZip = new AsyncZipDeflate(filePath);

      asyncZip.ondata = (err, data, final) => {
        if (err) {
          console.error("There was an error when compressing the files: ", err);
          return;
        }
        if (final) processedFiles++;
      };
      zip.add(asyncZip);
      asyncZip.push(buffer, true);
      await new Promise((resolve) => setTimeout(resolve, 10));
      return true;
    } catch (err) {
      console.error(
        `Error processing the plot ${plotType} of Event: ${eventName}: `,
        err
      );
      return false;
    }
  };

  const processFilterMap = async (
    zip: Zip,
    filterPlot: ImageURLBlob
  ): Promise<boolean> => {
    try {
      const arrayBuffer = await filterPlot.blob.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const filename = "filter_comparision.png";
      const asyncZip = new AsyncZipDeflate(filename);
      asyncZip.ondata = (err, data, final) => {
        if (err) {
          console.error(
            "There was an error when compressing filter comparision image :",
            err
          );
          return;
        }
      };
      zip.add(asyncZip);
      asyncZip.push(buffer, true);
      return true;
    } catch (err) {
      console.error("Error processing filterPlot blob: ", err);
      return false;
    }
  };
  const processMetadata = async (zip: Zip, metadata:MetaData): Promise<boolean> => {
    try {
      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: "application/json",
      });
      const arrayBuffer = await metadataBlob.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const filename = "metadata.json";
      const asyncZip = new AsyncZipDeflate(filename);
      asyncZip.ondata = (err, data, final) => {
        if (err) {
          console.error("There was an error when compressing metadata: ", err);
          return;
        }
      };
      zip.add(asyncZip);
      asyncZip.push(buffer, true);
      return true;
    } catch (err) {
      console.error("Error serializing metadata: ", err);
      return false;
    }
  };
  const generateZip = async (epochsPlotMap: EpochsPlotMap) => {
    setIsLoading(true);
    setError("");

    try {
      const zip = new Zip();
      const zipData: Uint8Array[] = [];

      zip.ondata = (err, data, final) => {
        if (err) {
          console.error("Error in zip data handling: ", err);
          return;
        }
        zipData.push(data);
      };
      let processedFiles = 0;
      let totalFiles = 0;

      for (const [eventName, eventPlot] of Object.entries(epochsPlotMap)) {
        for (const [plotType, plotData] of Object.entries(eventPlot)) {
          totalFiles++;
          processEventPlotFile(
            zip,
            eventName,
            plotType,
            plotData,
            processedFiles
          );
        }
      }
      if (filterPlot?.blob) {
        processFilterMap(zip, filterPlot)
      }
      if (metadata) {
        processMetadata(zip, metadata)
      }
      const waitForProcessing = async () => {
        const maxWait = 10000;
        const startTime = Date.now();
        while (processedFiles < totalFiles) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          if (Date.now() - startTime > maxWait) {
            console.warn(
              `Timeout waiting for all files to process. Processed ${processedFiles}/${totalFiles}`
            );
            break;
          }
        }
      };
      if (totalFiles > 0) {
        await waitForProcessing();
      } else {
        setError("No valid files to compress");
        setIsLoading(false);
        return;
      }
      zip.end();
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Timeout waiting for zip finalization");
          resolve();
        }, 3000);
        const checkInterval = setInterval(() => {
          if (zipData.length > 0) {
            clearTimeout(timeout);
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });

      if (zipData.length === 0) {
        setError("Failed to generate zip file (no data)");
        setIsLoading(false);
        return;
      }

      const totalLength = zipData.reduce((len, arr) => len + arr.length, 0);
      const zipBytes = new Uint8Array(totalLength);
      let offset = 0;

      zipData.forEach((arr) => {
        zipBytes.set(arr, offset);
        offset += arr.length;
      });

      const blob = new Blob([zipBytes], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      setDownloadURL(url);
    } catch (err) {
      console.error("There was an error when generating the zip: ", err);
      setError("Failed to generate zip File.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownload = () => {
    if (downloadURL) {
      const filename = "event_plots.zip";
      const link = document.createElement("a");
      link.download = filename;
      link.href = downloadURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      generateZip(epochsPlotMap);
    }
  };
  useEffect(() => {
    return () => {
      if (downloadURL) {
        URL.revokeObjectURL(downloadURL);
      }
    };
  }, [downloadURL]);

  return (
    <>
      <button
        onClick={handleDownload}
        className="bg-orange-500 cursor-pointer p-2 rounded-lg hover:bg-orange-600 "
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2 text-white">
            Generating Zip <LoaderCircle size={17} className="animate-spin" />
          </span>
        ) : downloadURL ? (
          <span className="flex items-center gap-2 text-white">
            Download Zip <Download size={17} />
          </span>
        ) : (
          <span className="flex items-center gap-2 text-white">
            Generate Zip <Sparkles size={17} />
          </span>
        )}
      </button>
    </>
  );
};
