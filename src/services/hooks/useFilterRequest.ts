import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { fetchFilterVis } from "../api/filterVis";
import {
  FetchFileDataParams,
  FetchFilterResponseParams,
} from "../../types/apiFileData";
import { unpackFilterPngZip } from "../../utils/unpackFilter";

export function useFilterRequest({
  onSuccess,
}: {
  onSuccess: (data: FetchFilterResponseParams) => void;
}) {
  return useMutation<FetchFilterResponseParams, Error, FetchFileDataParams>({
    mutationFn: async (params) => {
      try {
        const zipBlob = await fetchFilterVis(params);
        const unpackedData = unpackFilterPngZip(zipBlob);
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
