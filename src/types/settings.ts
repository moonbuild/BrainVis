type ChannelInfoType = {
  name: string;
  type?: "eeg" | "eog";
};

interface EEGSettings {
  samplingFreq: number;
  lowFreq: number;
  highFreq: number;
  montageType: string;
  eegReference: string;
  epochTmin: number;
  epochTmax: number;
}

interface EEGErrors {
  samplingFreq?: string;
  lowFreq?: string;
  highFreq?: string;
  montageType?: string;
  eegReference?: string;
  epochTmin?: string;
  epochTmax?: string;
}

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

export type {
  ChannelInfoType,
  EEGSettings,
  EEGErrors,
  SettingsDataProps,
};
