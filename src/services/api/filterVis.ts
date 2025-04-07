import api from "../../lib/axios";

export const fetchFilterVis = async ({file, data}:{file: File, data: string}): Promise<Blob>=>{
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", data);
    const response = await api.post("/eeg/get_filter_img", formData, {
        responseType:'blob'
    })
    return response.data;
}