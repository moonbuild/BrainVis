import { useMutation } from "@tanstack/react-query";
import { fetchChannelNames } from "../api/channels";

export function useChannelNames() {
  return useMutation({
    mutationFn: fetchChannelNames,
  });
}
