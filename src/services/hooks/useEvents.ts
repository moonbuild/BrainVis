import { useMutation } from "@tanstack/react-query";
import { fetchEventVis } from "../api/events";
import { FetchEventResponseParams, FetchFileDataParams } from "../../types/apiFileData";
import { unpackEventsPngZip } from "../../utils/unpackEvents";

export function useEvents() {
  return useMutation<FetchEventResponseParams, Error, FetchFileDataParams>({
    mutationFn: async (params) => {
      const zipBlob = await fetchEventVis(params);
      const unpackedData = unpackEventsPngZip(zipBlob);
      return unpackedData;
    },
  });
}
