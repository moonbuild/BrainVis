import { Moon, Settings, Sun, X } from "lucide-react";
import MultiSelectSearch from "../../elements/multiSelectSearch";
import {
  useCallback,
  useState,
} from "react";

import { EEGErrors } from "../../../types/settings";
import { toast } from "react-toastify";
import { EventTableType, initialEvent } from "../../../types/eventTable";
import EventTable from "../../elements/eventTable";
import { useEEGChannelStore } from "../../../stores/eegSettingsStore";
import CustomLabelInput from "./CustomLabelInput";
import { useFileDataStore } from "../../../stores/fileStore";

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

  interface SettingsDataProps {
    samplingFreq?: number;
    lowFreq?: number;
    highFreq?: number;
    montageType?: string;
    eegReference?: string;
    epochTmin?: number;
    epochTmax?: number;
    baseline?: [number | undefined, number | undefined];
  }
  // data
  const [settingsData, setSettingsData] = useState<SettingsDataProps>({
    samplingFreq: 250,
    lowFreq: 0.1,
    highFreq: 40,
    montageType: "standard_1020",
    eegReference: "average",
    epochTmin: -0.2,
    epochTmax: 0.5,
    baseline: [undefined, 0],
  });
  const [baselineString, setBaselineString] = useState<string>("None, 0");
  const [events, setEvents] = useState<EventTableType[]>(initialEvent);

  const [SettingsErrors, setSettingsErrors] = useState<EEGErrors>({});

  // drawer
  const [showDrawer, setShowDrawer] = useState(false);
  const openDrawer = () => setShowDrawer(true);
  const closeDrawer = () => setShowDrawer(false);

  const checkBaseValidity = useCallback(
    (filterFetch: boolean) => {
      const newErrors: EEGErrors = {};

      if (!settingsData.samplingFreq)
        newErrors.samplingFreq = "Sampling Freq cannot be empty";
      if (!settingsData.lowFreq) newErrors.lowFreq = "Low Freq cannot be empty";
      if (!settingsData.highFreq)
        newErrors.highFreq = "High Freq cannot be empty";
      if (!settingsData.montageType)
        newErrors.montageType = "Montage Type cannot be empty";
      if (!settingsData.eegReference)
        newErrors.eegReference = "EEG Reference cannot be empty";
      if (!filterFetch) {
        if (!settingsData.epochTmin)
          newErrors.montageType = "Epoch Tmin cannot be empty";
        if (!settingsData.epochTmax)
          newErrors.montageType = "Epoch Tmax cannot be empty";
        if (!settingsData.baseline)
          newErrors.montageType = "Baseline cannot be empty";
      }
      const noErrors = Object.values(newErrors).every((err) => err === "");
      setSettingsErrors((prev) => ({ ...prev, ...newErrors }));
      return noErrors;
    },
    [settingsData]
  );

  const raiseExpectedValidity = useCallback(() => {
    if (!file) {
      toast.error("Please Provide an Input EDF file before submit", {
        autoClose: 3000,
      });
      return false;
    }
    const noErrors = Object.values(SettingsErrors).every((error) => !error);
    if (!noErrors) {
      toast.error("Invalid Configuration. Provide correct input Values", {
        autoClose: 3000,
      });
      return false;
    }
    return true;
  }, [file, SettingsErrors]);

  const handleFilterFetch = useCallback(() => {
    const baseValidity = checkBaseValidity(true);
    const expectedValidity = raiseExpectedValidity();
    if (!baseValidity || !expectedValidity || !file) return;

    const { samplingFreq, lowFreq, highFreq, montageType, eegReference } =
      settingsData;

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
    const baseValidity = checkBaseValidity(true);
    const expectedValidity = raiseExpectedValidity();
    if (!baseValidity || !expectedValidity || !file) return;

    const finalChannelTypes: Record<string, string> = {};
    selectedChannelsInfo.forEach((ch) => {
      finalChannelTypes[ch.name] = ch.type ?? "eeg";
    });
    const eventData: Record<string, [number, number, number, number]> = {};
    events.forEach(({ id, name, startTime, endTime, duration }) => {
      eventData[name] = [id, startTime, endTime, duration];
    });
    const {
      samplingFreq,
      lowFreq,
      highFreq,
      epochTmin,
      epochTmax,
      baseline,
      montageType,
      eegReference,
    } = settingsData;

    const payload = JSON.stringify({
      sampling_freq: samplingFreq,
      low_freq: lowFreq,
      high_freq: highFreq,
      epoch_tmin: epochTmin,
      epoch_tmax: epochTmax,
      epoch_baseline: baseline,
      montage_type: montageType,
      eeg_reference: eegReference,
      channel_types: finalChannelTypes,
      event_data: eventData,
    });
    handleEventFunc(file, payload);
    closeDrawer();
  }, [file, selectedChannelsInfo, events, settingsData]);

  const validateField = (name: keyof typeof settingsData, value: string) => {
    let error = "";
    switch (name) {
      case "montageType":
        if (value.toString().trim() === "")
          error = "Montage Type cannot be empty";
        break;
      case "eegReference":
        if (value.toString().trim() === "")
          error = "EEG Reference cannot be empty";
        break;
    }
    return error;
  };

  const handleChange = (name: keyof typeof settingsData, value: string) => {
    const error = validateField(name, value);
    setSettingsData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSettingsErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBaselineChange = (value: string) => {
    setBaselineString(value);
    let [val1, val2] = value.split(",").map((v) => v.trim().toLowerCase());
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
              type="number"
              name="samplingFreq"
              value={settingsData.samplingFreq}
            />
            <CustomLabelInput
              label="Low freq"
              type="number"
              name="lowFreq"
              value={settingsData.lowFreq}
            />
            <CustomLabelInput
              label="High freq"
              type="number"
              name="highFreq"
              value={settingsData.highFreq}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomLabelInput
              label="Montage Type"
              type="text"
              name="montageType"
              value={settingsData.montageType}
              errorMessage={SettingsErrors.montageType}
            />
            <CustomLabelInput
              label="EEG Reference"
              type="text"
              name="eegReference"
              value={settingsData.eegReference}
              errorMessage={SettingsErrors.eegReference}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-1">
          <button
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            onClick={handleFilterFetch}
          >
            Submit
          </button>
          <button
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
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
                      type="number"
                      name="samplingFreq"
                      value={settingsData.samplingFreq}
                    />
                    <CustomLabelInput
                      label="Low freq"
                      type="number"
                      name="lowFreq"
                      value={settingsData.lowFreq}
                    />
                    <CustomLabelInput
                      label="High freq"
                      type="number"
                      name="highFreq"
                      value={settingsData.highFreq}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <CustomLabelInput
                      label="Montage Type"
                      type="text"
                      name="montageType"
                      value={settingsData.montageType}
                      errorMessage={SettingsErrors.montageType}
                      onChange={(e) =>
                        handleChange("montageType", e.target.value)
                      }
                    />
                    <CustomLabelInput
                      label="EEG Reference"
                      type="text"
                      name="eegReference"
                      value={settingsData.eegReference}
                      errorMessage={SettingsErrors.eegReference}
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
                      <EventTable events={events} setEvents={setEvents} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <CustomLabelInput
                      label=" Epoch Tmin"
                      type="number"
                      name="epochTmin"
                      value={settingsData.epochTmin}
                    />
                    <CustomLabelInput
                      label=" Epoch Tmax"
                      type="number"
                      name="epochTmax"
                      value={settingsData.epochTmax}
                    />
                    <CustomLabelInput
                      label=" Epoch Baseline"
                      type="text"
                      name="epochBaseline"
                      value={baselineString}
                      onChange={(e) => handleBaselineChange(e.target.value)}
                    />
                  </div>
                  <div className="mt-8 flex justify-end space-x-1">
                    <button
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
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
