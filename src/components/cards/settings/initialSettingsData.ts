import { SettingsDataProps } from "../../../types/settings";

export const initialSettingsData: SettingsDataProps = {
  samplingFreq: 250,
  lowFreq: 0.1,
  highFreq: 40,
  montageType: "standard_1020",
  eegReference: "average",
  epochTmin: "-0.2",
  epochTmax: "0.5",
  baseline: [undefined, 0],
};
