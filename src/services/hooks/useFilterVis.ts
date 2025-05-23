import { useMutation } from "@tanstack/react-query";
import { fetchFilterVis } from "../api/filterVis";
import { FetchFileDataParams, FetchFilterResponseParams } from "../../types/apiFileData";
import { unpackFilterPngZip } from "../../utils/unpackFilter";

export function useFilterVis() {
  return useMutation<FetchFilterResponseParams, Error, FetchFileDataParams>({
    mutationFn: async (params) => {
      const zipBlob = await fetchFilterVis(params);
      const unpackedData = unpackFilterPngZip(zipBlob);
      return unpackedData
    },
  });
}
