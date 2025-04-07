import { Moon, Settings, Sun, X } from "lucide-react";
import MultiSelectSearch from "../elements/multiSelectSearch";
import { useCallback, useEffect, useState } from "react";
import EventTable from "../elements/eventTable";
import { useChannelNames } from "../../services/hooks/useChannels";

import { ChannelInfoType, EEGErrors, EEGSettings } from "../../types/settings";
import {
  useChannelData,
  useEEGSettingsStore,
  useFinalSubmitData,
} from "../../stores/eegSettingsStore";
import { useloadingStore } from "../../stores/loadingStore";
import { Bounce, toast, ToastContainer, Zoom } from "react-toastify";

interface SettingsCardProps {
  isDark: boolean;
  toggleDarkMode: () => void;
}

function SettingsCard({ isDark, toggleDarkMode }: SettingsCardProps) {
  const { selectedChannelInfo } = useChannelData();
  const { settingsLoading } = useloadingStore();
  const { data, setData, setIsSubmit } = useFinalSubmitData();

  const [values, setValues] = useState<EEGSettings>({
    samplingFreq: 250,
    lowFreq: 0.1,
    highFreq: 40,
    montageType: "standard_1020",
    eegReference: "average",
    epochTmin: -0.2,
    epochTmax: 0.5,
  });

  const [baselineString, setBaselineString] = useState<string>("None, 0");
  const [baseline, setBaseline] = useState<
    [number | undefined, number | undefined]
  >([undefined, 0]);

  const [errors, setErrors] = useState<EEGErrors>({});

  const validateField = (name: keyof typeof values, value: string | number) => {
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
    console.log(error);
    return error;
  };

  const handleChange = (name: keyof typeof values, value: string | number) => {
    const error = validateField(name, value);
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  useEffect(() => {
    console.log("Errors", errors);
  }, [errors]);

  const handleBaselineChange = (value: string) => {
    setBaselineString(value);
    let [val1, val2] = value.split(",").map((v) => v.trim().toLowerCase());
    const parsedBaselines: [number | undefined, number | undefined] = [
      val1 === "none" || val1 === "" ? undefined : Number(val1),
      val2 === "none" || val2 === "" ? undefined : Number(val2),
    ];
    setBaseline(parsedBaselines);
  };

  const [showDrawer, setShowDrawer] = useState(false);
  const openDrawer = () => setShowDrawer(true);
  const closeDrawer = () => setShowDrawer(false);

  const handleSubmit = useCallback(() => {
    const isErrorEmpty = Object.values(errors).every((error) => !error);
    if (!isErrorEmpty) {
      toast.error("Provide necessary details");
      return;
    }
    const { samplingFreq, lowFreq, highFreq, montageType, eegReference } =
      values;
    const finalChannelTypes: Record<string, string | undefined> = {};
    selectedChannelInfo.forEach((ch) => {
      finalChannelTypes[ch.name] = ch.type;
    });
    console.log(
      "final: ",
      selectedChannelInfo,
      finalChannelTypes,
      JSON.stringify(finalChannelTypes)
    );
    const payload = {
      sampling_freq: samplingFreq,
      lowFreq: lowFreq,
      high_freq: highFreq,
      channel_types: finalChannelTypes,
      montage_type: montageType,
      eeg_reference: eegReference,
    };
    setData(JSON.stringify(payload));
    setIsSubmit(true);
  }, [errors, selectedChannelInfo, values]);

  return (
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
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ">
              Sampling Freq
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-blue-500 transition-all text-gray-800"
              type="number"
              name="samplingFreq"
              value={values.samplingFreq}
              onChange={(e) =>
                handleChange("samplingFreq", Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ">
              Low Freq
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-blue-500 transition-all text-gray-800"
              type="number"
              name="lowFreq"
              value={values.lowFreq}
              onChange={(e) => handleChange("lowFreq", Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ">
              High Freq
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-blue-500 transition-all text-gray-800"
              type="number"
              name="highFreq"
              value={values.highFreq}
              onChange={(e) => handleChange("highFreq", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ">
              Montage Type
            </label>
            <input
              className={`w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none  transition-all text-gray-800 focus:ring-1 ${
                errors.eegReference ? "ring-red-500" : "focus:ring-blue-500"
              }`}
              type="text"
              name="montageType"
              value={values.montageType}
              onChange={(e) => handleChange("montageType", e.target.value)}
            />
            {errors.montageType && (
              <div className=" flex items-center  ml-1 space-x-1">
                <X className="text-red-500" size={14} />
                <span className="text-red-500 text-xs font-medium">
                  {errors.montageType}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ">
              Eeg Reference
            </label>
            <input
              className={`w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none  transition-all text-gray-800 focus:ring-1 ${
                errors.eegReference ? "ring-red-500" : "focus:ring-blue-500"
              }`}
              type="text"
              name="eegReference"
              value={values.eegReference}
              onChange={(e) => handleChange("eegReference", e.target.value)}
            />
            {errors.eegReference && (
              <div className=" flex items-center  ml-1 space-x-1">
                <X className="text-red-500" size={14} />
                <span className="text-red-500 text-xs font-medium">
                  {errors.eegReference}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-1">
        <button
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-col"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-col"
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 ">
                      Sampling Freq
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                      type="number"
                      name="samplingFreq"
                      value={values.samplingFreq}
                      onChange={(e) =>
                        handleChange("samplingFreq", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 ">
                      Low Freq
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                      type="number"
                      name="lowFreq"
                      value={values.lowFreq}
                      onChange={(e) =>
                        handleChange("lowFreq", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 ">
                      High Freq
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                      type="number"
                      name="highFreq"
                      value={values.highFreq}
                      onChange={(e) =>
                        handleChange("highFreq", Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 ">
                      Montage Type
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                      type="text"
                      name="montageType"
                      value={values.montageType}
                      onChange={(e) =>
                        handleChange("montageType", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 ">
                      Eeg Reference
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                      type="text"
                      name="eegReference"
                      value={values.eegReference}
                      onChange={(e) =>
                        handleChange("eegReference", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">
                    Event Time Data
                  </h3>
                  <div className="flex justify-center">
                    <EventTable />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 ">
                      Epoch Tmin
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                      type="number"
                      name="epochTmin"
                      value={values.epochTmin}
                      onChange={(e) =>
                        handleChange("epochTmin", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 ">
                      Epoch Tmax
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                      type="number"
                      name="epochTmax"
                      value={values.epochTmax}
                      onChange={(e) =>
                        handleChange("epochTmax", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 ">
                      Epoch Baseline
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                      type="text"
                      name="epochBaseline"
                      value={baselineString}
                      onChange={(e) => handleBaselineChange(e.target.value)}
                    />
                    <p>Parsed Baseline: {JSON.stringify(baseline)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SettingsCard;
