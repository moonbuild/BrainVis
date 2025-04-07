import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChannelInfoType } from "../../types/settings";
import {
  useChannelData,
  useFileDataStore,
} from "../../stores/eegSettingsStore";

interface MultiSelectSearchProps {
}
export default function MultiSelectSearch({}: MultiSelectSearchProps) {
  const { channelNames } = useFileDataStore();
  const {
    selectedChannelInfo,
    selectChannel,
    unselectChannel,
    popLastSelectedChannel,
  } = useChannelData();
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback((channel: ChannelInfoType) => {
    selectChannel(channel);
  }, []);

  const handleUnselect = useCallback(
    (channel: ChannelInfoType) => {
      unselectChannel(channel);
    },
    [selectedChannelInfo]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "Backspace" &&
        inputValue === "" &&
        selectedChannelInfo.length > 0
      ) {
        popLastSelectedChannel();
      }
    },
    [inputValue, selectedChannelInfo]
  );

  const searchFilteredOptions = useMemo(() => {
    return channelNames.filter(
      (name) =>
        !selectedChannelInfo.some((ch) => ch.name === name) &&
        name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, channelNames, selectedChannelInfo]);


  return (
    <div className="w-full relative">
      <div className="p-2 rounded-md border border-grey-300">
        <div className="flex flex-wrap gap-2">
          {selectedChannelInfo.map((channel) => (
            <span
              key={channel.name}
              className={`flex items-center rounded-md gap-1 text-sm px-2 py-1 cursor-pointer ${
                channel.type === "eeg" ? "bg-blue-400" : "bg-green-400"
              }`}
              onClick={() => {
                handleSelect({ name: channel.name });
              }}
            >
              {channel.name}
              <X
                size={14}
                className="cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnselect(channel);
                }}
              />
            </span>
          ))}
          <input
            className="flex-1 outline-none bg-transparent"
            placeholder="Select channels..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
        </div>
      </div>
      {open && searchFilteredOptions.length > 0 && (
        <div className="absolute left-0 right-0 z-10 bg-white  mt-2 p-2 overflow-y-auto rounded-md shadow-md max-h-40 border border-grey-300 ">
          {searchFilteredOptions.map((name) => (
            <div
              key={name}
              className="p-1 hover:bg-grey-100 cursor-pointer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect({ name, type: "eeg" })}
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
