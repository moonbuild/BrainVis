import api from "../../lib/axios";
import { fetchChannelNamesParams } from "../../types/apiFileData";

export const fetchChannelNames = async ({file}:fetchChannelNamesParams): Promise<string[]> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/eeg/fetch_ch_names", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
