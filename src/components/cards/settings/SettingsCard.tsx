import { Moon, Settings, Sun, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import MultiSelectSearch from "../../elements/multiSelectSearch";
import { EventTableType, initialEvent } from "../../../types/eventTable";
import EventTable from "../../elements/eventTable";
import { useEEGChannelStore } from "../../../stores/eegSettingsStore";
import CustomLabelInput from "./CustomLabelInput";
import { useFileDataStore } from "../../../stores/fileStore";
import { initialSettingsData } from "./initialSettingsData";
import { SettingsDataProps } from "../../../types/settings";

interface SettingsCardProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  handleFilterFunc: (file: File, payload: string) => void;
  handleEventFunc: (file: File, payload: string) => void;
}

function SettingsCard({
  isDark,
  toggleDarkMode,
  handleFilterFunc,
  handleEventFunc,
}: SettingsCardProps) {
  // store
  const { file } = useFileDataStore();
  const { selectedChannelsInfo } = useEEGChannelStore();

  // data
  const [settingsData, setSettingsData] = useState<SettingsDataProps>({});
  const [baselineString, setBaselineString] = useState<string>("");

  const [events, setEvents] = useState<EventTableType[]>(initialEvent);
  const [isEventsTableInvalid, setIsEventsTableInvalid] =
    useState<boolean>(false);

  // drawer
  const [showDrawer, setShowDrawer] = useState(false);
  const openDrawer = () => setShowDrawer(true);
  const closeDrawer = () => setShowDrawer(false);

  const raiseExpectedValidity = useCallback(
    (filterFetch: boolean) => {
      if (!file) {
        toast.error("Please Provide an Input EDF file before submit", {
          autoClose: 3000,
        });
        return false;
      }
      if (selectedChannelsInfo.length === 0) {
        toast.error(
          "Please select channels that u want in you visualisation, Blue is EEG, Green is EOG",
          {
            autoClose: 3000,
          }
        );
        return false;
      }

      const noErrors = selectedChannelsInfo.length > 0;
      if (
        (filterFetch && !noErrors) ||
        (!filterFetch && (isEventsTableInvalid || !noErrors))
      ) {
        toast.error("Invalid Configuration. Provide correct input Values", {
          autoClose: 3000,
        });
        return false;
      }
      return true;
    },
    [file, selectedChannelsInfo]
  );

  const handleFilterFetch = useCallback(() => {
    const expectedValidity = raiseExpectedValidity(true);
    if (!expectedValidity || !file) return;
    const {
      samplingFreq = initialSettingsData.samplingFreq,
      lowFreq = initialSettingsData.lowFreq,
      highFreq = initialSettingsData.highFreq,
      montageType = initialSettingsData.montageType,
      eegReference = initialSettingsData.eegReference,
    } = settingsData;
    const finalChannelTypes: Record<string, string> = {};
    selectedChannelsInfo.forEach((ch) => {
      finalChannelTypes[ch.name] = ch.type ?? "eeg";
    });
    const payload = JSON.stringify({
      sampling_freq: samplingFreq,
      low_freq: lowFreq,
      high_freq: highFreq,
      montage_type: montageType,
      eeg_reference: eegReference,
      channel_types: finalChannelTypes,
    });
    handleFilterFunc(file, payload);
  }, [file, settingsData, selectedChannelsInfo]);

  const handleEventsFetch = useCallback(() => {
    const expectedValidity = raiseExpectedValidity(false);
    if (!expectedValidity || !file) return;

    const finalChannelTypes: Record<string, string> = {};
    selectedChannelsInfo.forEach((ch) => {
      finalChannelTypes[ch.name] = ch.type ?? "eeg";
    });
    const eventData: Record<string, [number, number, number, number]> = {};
    events.forEach(({ id, name, startTime, endTime, duration }) => {
      eventData[name] = [id, startTime, endTime, duration];
    });
    const {
      samplingFreq = initialSettingsData.samplingFreq,
      lowFreq = initialSettingsData.lowFreq,
      highFreq = initialSettingsData.highFreq,
      epochTmin = initialSettingsData.epochTmin,
      epochTmax = initialSettingsData.epochTmax,
      baseline = initialSettingsData.baseline,
      montageType = initialSettingsData.montageType,
      eegReference = initialSettingsData.eegReference,
    } = settingsData;

    const payload = JSON.stringify({
      sampling_freq: samplingFreq,
      low_freq: lowFreq,
      high_freq: highFreq,
      epoch_tmin: Number(epochTmin),
      epoch_tmax: Number(epochTmax),
      epoch_baseline: baseline,
      montage_type: montageType,
      eeg_reference: eegReference,
      channel_types: finalChannelTypes,
      event_data: eventData,
    });
    handleEventFunc(file, payload);
    closeDrawer();
  }, [file, selectedChannelsInfo, events, settingsData]);

  // const validateField = (name: keyof typeof settingsData, value: string) => {
  //   let error = "";
  //   switch (name) {
  //     case "montageType":
  //       if (value.toString().trim() === "")
  //         error = "Montage Type cannot be empty";
  //       break;
  //     case "eegReference":
  //       if (value.toString().trim() === "")
  //         error = "EEG Reference cannot be empty";
  //       break;
  //   }
  //   return error;
  // };

  const handleChange = (name: keyof typeof settingsData, value: string) => {
    setSettingsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (
    name: keyof typeof settingsData,
    value: number
  ) => {
    setSettingsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleBaselineChange = (value: string) => {
    setBaselineString(value);
    const [val1, val2] = value.split(",").map((v) => v.trim().toLowerCase());
    const parsedBaselines: [number | undefined, number | undefined] = [
      val1 === "none" || val1 === "" ? undefined : Number(val1),
      val2 === "none" || val2 === "" ? undefined : Number(val2),
    ];
    setSettingsData((prev) => ({ ...prev, baseline: parsedBaselines }));
  };
  return (
    <>
      <div className="w-3/4 bg-white rounded-xl shadow-lg overflow-hidden p-6 transition-all">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Settings className="text-gray-600" size={18} />
            <h2 className="text-xl font-medium text-gray-800">Settings</h2>
          </div>
          <div>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={toggleDarkMode}
              hidden
            >
              {isDark ? (
                <Moon className="text-gray-600" size={18} />
              ) : (
                <Sun className="text-gray-600" size={18} />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Select Channel Names
            </label>
            <MultiSelectSearch />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <CustomLabelInput
              label="Sampling freq"
              name="samplingFreq"
              value={settingsData.samplingFreq}
              placeholder="Enter sampling freq"
              type="number"
              onChange={(e) =>
                handleNumberChange("samplingFreq", Number(e.target.value))
              }
            />
            <CustomLabelInput
              label="Low freq"
              name="lowFreq"
              value={settingsData.lowFreq}
              placeholder="Enter low freq"
              type="number"
              onChange={(e) =>
                handleNumberChange("lowFreq", Number(e.target.value))
              }
            />
            <CustomLabelInput
              label="High freq"
              name="highFreq"
              value={settingsData.highFreq}
              placeholder="Enter high freq"
              type="number"
              onChange={(e) =>
                handleNumberChange("highFreq", Number(e.target.value))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomLabelInput
              label="Montage Type"
              name="montageType"
              value={settingsData.montageType}
              placeholder="Enter montage type"
              onChange={(e) => {
                handleChange("montageType", e.target.value);
              }}
            />
            <CustomLabelInput
              label="EEG Reference"
              name="eegReference"
              value={settingsData.eegReference}
              placeholder="Enter eeg reference"
              onChange={(e) => handleChange("eegReference", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-1">
          <button
            className="cursor-pointer px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            onClick={handleFilterFetch}
          >
            Submit
          </button>
          <button
            className="cursor-pointer px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            onClick={openDrawer}
          >
            Advanced Options
          </button>
        </div>
        {showDrawer && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] flex justify-center items-center ">
            <div className="bg-white max-w-[80%] w-4/5 h-4/5 max-h-[90%] rounded-xl shadow-2xl flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 ">
                <h2 className="text-xl font-medium text-gray-800">
                  Advanced Settings
                </h2>
                <button
                  className="cursor-pointer rounded-full p-2 hover:bg-gray-100 transition-colors"
                  onClick={closeDrawer}
                >
                  <X className="text-gray-600" size={20} />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-grey-600">
                      Channel Names
                    </h3>
                    <MultiSelectSearch />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <CustomLabelInput
                      label="Sampling freq"
                      name="samplingFreq"
                      value={settingsData.samplingFreq}
                      placeholder="Enter sampling freq"
                      type="number"
                      onChange={(e) =>
                        handleNumberChange(
                          "samplingFreq",
                          Number(e.target.value)
                        )
                      }
                    />
                    <CustomLabelInput
                      label="Low freq"
                      name="lowFreq"
                      value={settingsData.lowFreq}
                      placeholder="Enter low freq"
                      type="number"
                      onChange={(e) =>
                        handleNumberChange("lowFreq", Number(e.target.value))
                      }
                    />
                    <CustomLabelInput
                      label="High freq"
                      name="highFreq"
                      value={settingsData.highFreq}
                      placeholder="Enter high freq"
                      type="number"
                      onChange={(e) =>
                        handleNumberChange("highFreq", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <CustomLabelInput
                      label="Montage Type"
                      name="montageType"
                      value={settingsData.montageType}
                      placeholder="Enter montage type"
                      onChange={(e) =>
                        handleChange("montageType", e.target.value)
                      }
                    />
                    <CustomLabelInput
                      label="EEG Reference"
                      name="eegReference"
                      value={settingsData.eegReference}
                      placeholder="Enter eeg reference"
                      onChange={(e) =>
                        handleChange("eegReference", e.target.value)
                      }
                    />
                  </div>
                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-4">
                      Event Time Data
                    </h3>
                    <div className="flex justify-center">
                      <EventTable
                        events={events}
                        setEvents={setEvents}
                        setIsEventsTableInvalid={setIsEventsTableInvalid}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <CustomLabelInput
                      label=" Epoch Tmin"
                      name="epochTmin"
                      value={settingsData.epochTmin}
                      placeholder="Enter epoch tmin"
                      type="number"
                      onChange={(e) =>
                        handleChange("epochTmin", e.target.value)
                      }
                    />
                    <CustomLabelInput
                      label=" Epoch Tmax"
                      name="epochTmax"
                      value={settingsData.epochTmax}
                      placeholder="Enter epoch tmax"
                      type="number"
                      onChange={(e) =>
                        handleChange("epochTmax", e.target.value)
                      }
                    />
                    <CustomLabelInput
                      label="Epoch Baseline"
                      name="epochBaseline"
                      value={baselineString}
                      placeholder="Enter epoch baseline"
                      onChange={(e) => handleBaselineChange(e.target.value)}
                    />
                  </div>
                  <div className="mt-8 flex justify-end space-x-1">
                    <button
                      className="cursor-pointer px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                      onClick={handleEventsFetch}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default SettingsCard;
