import { unzipSync } from "fflate";
import { MetaData } from "../stores/summaryStore";
import {  FetchFilterResponseParams } from "../types/apiFileData";

export const unpackFilterPngZip = async (
  zipBlob: Blob
): Promise<FetchFilterResponseParams> => {
  const arrayBuffer = await zipBlob.arrayBuffer();
  const zip = unzipSync(new Uint8Array(arrayBuffer));
  let url: string = "";
  let blob = new Blob();
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
        /(filter_plot).png$/
      );
      if (!match) continue;
      blob = new Blob([fileData], { type: "image/png" });
      url = URL.createObjectURL(blob);
    } else if (filename.endsWith(".json")) {
      const decoder = new TextDecoder("utf-8");
      const recievedJsonData = JSON.parse(decoder.decode(fileData));
      metadata = recievedJsonData;
    }
  }
  return { filter_plot:{url, blob}, metadata };
};
