import { create } from "zustand";
import { ChannelInfoType } from "../types/Settings";

interface EEGChannelStore {
  allChannelsInfo: ChannelInfoType[];
  selectedChannelsInfo: ChannelInfoType[];
  setAllChannelsInfo: (channels: ChannelInfoType[]) => void;
  setSelectedChannelsInfo: (channels: ChannelInfoType[]) => void;
  addModifyChannel: (channel: ChannelInfoType) => void;
  removeChannel: (channel: ChannelInfoType) => void;
  popLastChannel: () => void;
}

export const useEEGChannelStore = create<EEGChannelStore>((set, get) => ({
  allChannelsInfo: [],
  selectedChannelsInfo: [],
  setAllChannelsInfo: (channels) =>
    set(() => ({
      allChannelsInfo: channels,
    })),
  setSelectedChannelsInfo: (channels) =>
    set(() => ({
      selectedChannelsInfo: channels,
    })),
  addModifyChannel: (channel) => {
    const { selectedChannelsInfo } = get();
    const existingIndex = selectedChannelsInfo.findIndex(
      (ch) => ch.name === channel.name
    );
    const updatedType = channel.type === "eeg" ? "eog" : "eeg";
    const updatedChannel: ChannelInfoType = {
      name: channel.name,
      type: updatedType,
    };
    if (existingIndex !== -1) {
      const updatedChannels = [...selectedChannelsInfo];
      updatedChannels[existingIndex] = updatedChannel;
      set({ selectedChannelsInfo: updatedChannels });
    } else {
      set({
        selectedChannelsInfo: [...selectedChannelsInfo, channel],
      });
    }
  },
  removeChannel: (channel) =>
    set((state) => ({
      selectedChannelsInfo: (state.selectedChannelsInfo ?? []).filter(
        (ch) => ch.name !== channel.name
      ),
    })),
  popLastChannel: () =>
    set((state) => ({
      selectedChannelsInfo: (state.selectedChannelsInfo ?? []).slice(0, -1),
    })),
}));
