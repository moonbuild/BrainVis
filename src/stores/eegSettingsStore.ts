import { create } from "zustand";
import { ChannelInfoType } from "../types/settings";

interface EEGChannelStore{
    allChannelsInfo: ChannelInfoType[];
    selectedChannelsInfo: ChannelInfoType[];
    setAllChannelsInfo: (channels: ChannelInfoType[]) =>void;
    setSelectedChannelsInfo : (channels : ChannelInfoType[]) => void;
    addModifyChannel: (channel:ChannelInfoType) => void;
    removeChannel: (channel:ChannelInfoType) => void;
    popLastChannel: ()=> void;
}

export const useEEGChannelStore = create<EEGChannelStore>((set)=>({
    allChannelsInfo : [],
    selectedChannelsInfo: [
    {
        "name": "AF3",
        "type": "eog"
    },
    {
        "name": "F7",
        "type": "eeg"
    },
    {
        "name": "F3",
        "type": "eeg"
    },
    {
        "name": "FC5",
        "type": "eeg"
    },
    {
        "name": "T7",
        "type": "eeg"
    },
    {
        "name": "O2",
        "type": "eeg"
    },
    {
        "name": "O1",
        "type": "eeg"
    },
    {
        "name": "P8",
        "type": "eeg"
    },
    {
        "name": "P7",
        "type": "eeg"
    },
    {
        "name": "FC6",
        "type": "eeg"
    },
    {
        "name": "F4",
        "type": "eeg"
    },
    {
        "name": "T8",
        "type": "eeg"
    },
    {
        "name": "F8",
        "type": "eeg"
    },
    {
        "name": "AF4",
        "type": "eog"
    }
],
    setAllChannelsInfo: (channels) => set(()=>({
        allChannelsInfo: channels
    })),
    setSelectedChannelsInfo: (channels) => set(()=>({
        selectedChannelsInfo: channels
    })),
    addModifyChannel: (channel) => set(state=> ({
        selectedChannelsInfo : [...state.selectedChannelsInfo ?? [], channel]
    })),
    removeChannel: (channel) => set(state=> ({
        selectedChannelsInfo : (state.selectedChannelsInfo ?? []).filter(ch=> ch.name !== channel.name)
    })),
    popLastChannel: ()=> set(state=>({
        selectedChannelsInfo: (state.selectedChannelsInfo ?? []).slice(0, -1)
    }))
}))


// export const useSettingsDataStore = create<SettingsDataStore>((set) => ({
//   selectedChannelInfo: undefined,
//   samplingFreq: undefined,
//   lowFreq: undefined,
//   highFreq: undefined,
//   montageType: undefined,
//   eegReference: undefined,
//   epochTmin: undefined,
//   epochTmax: undefined,
//   eventsTable: undefined,


// }));
