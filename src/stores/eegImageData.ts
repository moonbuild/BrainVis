import { create } from "zustand";
import { EEGPlots, EpochsPlotMap, ImageURLBlob } from "../types/Plot";

interface EEGImageDataStore extends EEGPlots{
    setFilterPlot: ({url, blob}:ImageURLBlob)=>void;
    setEpochsPlot: (epochsPlotMap: EpochsPlotMap) => void;
    resetPlots: ()=>void;
}
export const useEEGImageData = create<EEGImageDataStore>((set) => ({
    filter_plot:undefined,
    epochs_plot:{},
    setFilterPlot: ({url, blob}) => set({filter_plot : {url, blob}}),
    setEpochsPlot:(epochsPlotMap)=> set({epochs_plot: epochsPlotMap}),
    resetPlots:()=>set({filter_plot:undefined, epochs_plot:{}})
}))