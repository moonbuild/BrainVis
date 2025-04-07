import api from "../../lib/axios";

export const fetchChannelNames = async (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/eeg/fetch_ch_names", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
