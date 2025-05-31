import { MetaData } from "../stores/summaryStore";
import { EpochsPlotMap, ImageURLBlob } from "./Plot";

export type fetchChannelNamesParams = {
  file:File;
}
export type FetchFileDataParams = {
  file: File;
  payload: string;
};

export type FetchFilterResponseParams = {
  filter_plot: ImageURLBlob,
  metadata:MetaData
}

export type FetchEventResponseParams = {
  epochs_plot:EpochsPlotMap,
  metadata:MetaData
}