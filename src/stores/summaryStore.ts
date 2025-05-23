import { create } from "zustand";

export interface MetaData{
    sfreq:number;
    max_freq: number;
    duration:number;
    total_samples:number;
    total_channels:number;
    n_bad:number;
    n_good:number;
}
type MetaDataStore = {
    metadata?: MetaData;
    setMetadata: (newMetadata: MetaData) => void;
    resetMetadata: ()=>void;
}

export const useMetadataStore = create<MetaDataStore>((set)=>({
    metadata:undefined,
    setMetadata: (newMetadata)=> set({metadata:newMetadata}),
    resetMetadata:()=>set({metadata:undefined})
}))