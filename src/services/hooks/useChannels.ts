import { useMutation } from "@tanstack/react-query";
import { fetchChannelNames } from "../api/channels";
import { fetchChannelNamesParams } from "../../types/apiFileData";

export function useChannelNames({onSuccess}:{onSuccess: (data:string[])=>void}) {
  return useMutation<string[], Error, fetchChannelNamesParams> ({
    mutationFn: fetchChannelNames,
    onSuccess,
  });
}
