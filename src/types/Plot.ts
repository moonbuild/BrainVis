export type ImageURLBlob = {
  url:string,
  blob: Blob
}

export type EpochPlot = {
  epoch_plot?: ImageURLBlob;
  psd_plot?: ImageURLBlob;
  topomap_plot?: ImageURLBlob;
  mini_topomap_plot?: ImageURLBlob;
};
export type EpochsPlotMap = {
  [epochId: string]: EpochPlot;
};
export type EEGPlots = {
  filter_plot?: ImageURLBlob;
  epochs_plot: EpochsPlotMap;
};
