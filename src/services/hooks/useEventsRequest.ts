import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { fetchEventVis } from "../api/events";
import {
  FetchEventResponseParams,
  FetchFileDataParams,
} from "../../types/apiFileData";
import { unpackEventsPngZip } from "../../utils/unpackEvents";

export function useEventsRequest({
  onSuccess,
}: {
  onSuccess: (data: FetchEventResponseParams) => void;
}) {
  return useMutation<FetchEventResponseParams, Error, FetchFileDataParams>({
    mutationFn: async (params) => {
      try {
        const zipBlob = await fetchEventVis(params);
        const unpackedData = unpackEventsPngZip(zipBlob);
        return unpackedData;
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.data instanceof Blob
        ) {
          const errorBlob = error.response.data;
          const text = await errorBlob.text();
          try {
            const json = JSON.parse(text);
            throw Error(`Server error: ${json.detail ?? json} text: ${text}`);
          } catch {
            throw Error(`Server error: ${text} text`);
          }
        } else {
          throw error;
        }
      }
    },
    onSuccess,
  });
}
