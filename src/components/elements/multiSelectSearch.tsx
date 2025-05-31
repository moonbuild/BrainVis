import { X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useFileDataStore } from "../../stores/fileStore";
import { toast } from "react-toastify";
import { useEEGChannelStore } from "../../stores/eegSettingsStore";

export default function MultiSelectSearch() {
  const {
    allChannelsInfo,
    selectedChannelsInfo,
    addModifyChannel,
    removeChannel,
    popLastChannel,
  } = useEEGChannelStore();
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const { file } = useFileDataStore();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "Backspace" &&
        inputValue === "" &&
        selectedChannelsInfo.length > 0
      ) {
        popLastChannel();
      }
    },
    [inputValue, selectedChannelsInfo]
  );

  const filteredChannelInfo = useMemo(() => {
    return allChannelsInfo.filter((originalChannel) => {
      const notSelected = selectedChannelsInfo.every(
        (selectedChannel) => selectedChannel.name !== originalChannel.name
      );
      const searchInputMatch = originalChannel.name
        .toLowerCase()
        .includes(inputValue.trim().toLowerCase());
      return notSelected && searchInputMatch 
    });
  }, [allChannelsInfo, selectedChannelsInfo, inputValue]);

  const handleFocus = useCallback(() => {
    if (!file) {
      toast.warning("Please Select a file first", { autoClose: 3000 });
      return;
    }
    if (allChannelsInfo.length == 0) {
      toast.warning("Please wait while the channel names are fetched", {
        autoClose: 3000,
      });
      return;
    }
    setOpen(true);
  }, [file, allChannelsInfo]);

  return (
    <div className="w-full relative">
      <div className="p-2 rounded-md border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {selectedChannelsInfo.map((channel) => (
            <span
              key={channel.name}
              className={`flex items-center rounded-md gap-1 text-sm px-2 py-1 cursor-pointer ${
                channel.type === "eeg" ? "bg-blue-400" : "bg-green-400"
              }`}
              onClick={() => {
                addModifyChannel({
                  name: channel.name,
                  type: channel.type,
                });
              }}
            >
              {channel.name}
              <X
                size={14}
                className="cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  removeChannel(channel);
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
            onFocus={() => handleFocus()}
            onBlur={() => setOpen(false)}
          />
        </div>
      </div>
      {open && filteredChannelInfo.length > 0 && (
        <div className="absolute left-0 right-0 z-10 bg-white  mt-2 p-2 overflow-y-auto rounded-md shadow-md max-h-40 border border-gray-300 ">
          {filteredChannelInfo.map((channel) => (
            <div
              key={channel.name}
              className="p-1 hover:bg-grey-100 cursor-pointer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                addModifyChannel({ name: channel.name, type: channel.type })
              }
            >
              {channel.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
