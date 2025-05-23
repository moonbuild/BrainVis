import api from "../../lib/axios";
import { FetchFileDataParams } from "../../types/apiFileData";

export const fetchFilterVis = async ({file, payload}:FetchFileDataParams): Promise<Blob>=>{
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", payload);
    const response = await api.post("/eeg/get_filter_img", formData, {
        responseType:'blob'
    })
    return response.data;
}