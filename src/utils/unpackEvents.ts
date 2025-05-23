import { unzipSync } from "fflate";
import { EpochPlot, EpochsPlotMap } from "../types/Plot";
import { MetaData } from "../stores/summaryStore";
import { FetchEventResponseParams } from "../types/apiFileData";

export const unpackEventsPngZip = async (
  zipBlob: Blob
): Promise<FetchEventResponseParams> => {
  const arrayBuffer = await zipBlob.arrayBuffer();
  const zip = unzipSync(new Uint8Array(arrayBuffer));
  const epochsPlotMap: EpochsPlotMap = {};
  let metadata: MetaData = {
    sfreq: 0,
    duration: 0,
    total_samples: 0,
    max_freq: 0,
    total_channels: 0,
    n_bad: 0,
    n_good: 0,
  };
  for (const [filename, fileData] of Object.entries(zip)) {
    if (filename.endsWith(".png")) {
      const match = filename.match(
        /(epoch_plot|psd_plot|topomap_plot|mini_topomap_plot).*_(.+)\.png$/
      );
      if (!match) continue;
      const [_, plotType, epochName] = match;
      const blob = new Blob([fileData], { type: "image/png" });
      const objectUrl = URL.createObjectURL(blob);
      if (!epochsPlotMap[epochName]) {
        epochsPlotMap[epochName] = {
          epoch_plot: {url: "", blob: new Blob()},
          psd_plot: {url:"", blob:new Blob()},
          topomap_plot: {url:"", blob: new Blob()},
          mini_topomap_plot: {url:"", blob: new Blob()},
        };
      }
      epochsPlotMap[epochName][plotType as keyof EpochPlot] = {url: objectUrl, blob};
    } else if (filename.endsWith(".json")) {
      const decoder = new TextDecoder("utf-8");
      const recievedJsonData = JSON.parse(decoder.decode(fileData));
      metadata = recievedJsonData;
    }
  }
  return { epochs_plot:epochsPlotMap, metadata };
};
