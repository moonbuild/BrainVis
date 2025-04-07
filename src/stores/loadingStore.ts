import { create } from "zustand";

interface LoadingStore{
    mainLoading: boolean;
    settingsLoading: boolean;
    channelNamesLoading: boolean;
    visualisationLoading: boolean;

    setMainLoading: (mainLoading: boolean) => void;
    setSettingsLoading: (settingsLoading: boolean) => void;
    setChannelNamesLoading: (settingsLoading: boolean) => void;
    setVisualisationLoading: (visualisationLoading: boolean) => void;
}

export const useloadingStore = create<LoadingStore>((set)=>({
    mainLoading: false,
    settingsLoading: false,
    channelNamesLoading:false,
    visualisationLoading: false,

    setMainLoading: (mainLoading: boolean) => set({mainLoading}),
    setSettingsLoading: (settingsLoading: boolean) => set({settingsLoading}),
    setChannelNamesLoading: (channelNamesLoading: boolean) => set({channelNamesLoading}),
    setVisualisationLoading: (visualisationLoading: boolean) => set({visualisationLoading}),
}))