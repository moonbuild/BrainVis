import { create } from "zustand";
import { ChannelInfoType, EEGSettings } from "../types/settings";

interface FileDataStore {
  file: File | null;
  channelNames: string[];
  setFile: (file: File | null) => void;
  setChannelNames: (channels: string[]) => void;
}

export const useFileDataStore = create<FileDataStore>((set) => ({
  file: null,
  channelNames: [],

  setFile: (file) => set({ file }),
  setChannelNames: (channelNames) => set({ channelNames }),
}));

interface EEGSettingsStore {
  settings: EEGSettings;
  baselineString: string;
  baseline: [number | undefined, number | undefined];
  setBaselineString: (value: string) => void;
  setBaseline: (baseline: [number | undefined, number | undefined]) => void;
  setSettings: (settings: Partial<EEGSettings>) => void;
}

export const useEEGSettingsStore = create<EEGSettingsStore>((set) => ({
  settings: {
    samplingFreq: 250,
    lowFreq: 0.1,
    highFreq: 40,
    montageType: "standard_1020",
    eegReference: "average",
    epochTmin: -0.2,
    epochTmax: 0.8,
  },
  baselineString: "None, 0",
  baseline: [undefined, 0],

  setSettings: (partialSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...partialSettings },
    })),
  setBaselineString: (value) => set({ baselineString: value }),
  setBaseline: (baseline) => set({ baseline }),
}));

interface ChannelData {
  selectedChannelInfo: ChannelInfoType[];
  setSelectedChannelInfo: (channels: ChannelInfoType[]) => void;
  selectChannel: (channel: ChannelInfoType) => void;
  unselectChannel: (channel: ChannelInfoType) => void;
  popLastSelectedChannel: () => void;
}

export const useChannelData = create<ChannelData>((set, get) => ({
  selectedChannelInfo: [],
  setSelectedChannelInfo: (selected) => set({ selectedChannelInfo: selected }),
  selectChannel: (channel: ChannelInfoType) => {
    const prev = get().selectedChannelInfo;
    const existingChannel = prev.find((ch) => ch.name === channel.name);
    if (existingChannel) {
      const newType = existingChannel.type === "eeg" ? "eog" : "eeg";
      const updated = prev.map((ch) =>
        ch.name === channel.name ? { ...ch, type: newType } : ch
      );
      set({ selectedChannelInfo: updated });
    } else {
      set({
        selectedChannelInfo: [
          ...prev,
          { ...channel, type: channel.type || "eeg" },
        ],
      });
    }
  },
  unselectChannel: (channel: ChannelInfoType) => {
    const prev = get().selectedChannelInfo;
    set({
      selectedChannelInfo: prev.filter((ch) => ch.name !== channel.name),
    });
  },
  popLastSelectedChannel: () => {
    const prev = get().selectedChannelInfo;
    set({
      selectedChannelInfo: prev.slice(0, -1),
    });
  },
}));

interface finalSubmitData{
  data:string;
  isSubmit:boolean;
  setIsSubmit:(value:boolean) => void;
  setData:(data:string)=>void;
}

export const useFinalSubmitData = create<finalSubmitData>((set) => ({
  data:"",
  isSubmit:false,
  setIsSubmit: (value) => set({isSubmit: value}),
  setData: (data) => set({data}),
}))