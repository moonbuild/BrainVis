import api from "../../lib/axios";
import { FetchFileDataParams } from "../../types/apiFileData";

export const fetchEventVis = async ({
  file,
  payload,
}: FetchFileDataParams): Promise<Blob> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("data", payload);
  const response = await api.post("/eeg/plot_all_event_images", formData, {
    responseType: "blob",
  });
  return response.data;
};
