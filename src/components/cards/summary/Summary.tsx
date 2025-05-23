import {
  Activity,
  AudioWaveform,
  CheckCircle2Icon,
  Hash,
  Layers,
  Timer,
  XCircle,
} from "lucide-react";
import { useMetadataStore } from "../../../stores/summaryStore";
import CustomLabelText from "./CustomLabelText";
import { useEEGImageData } from "../../../stores/eegImageData";
import { DownloadImages } from "../../../utils/downloadAll";
import NoMetadata from "../../../shared/NoMetadata";

const Summary = () => {
  const { metadata } = useMetadataStore();
  const { filter_plot, epochs_plot } = useEEGImageData();

  if (!metadata) return <NoMetadata />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-medium">Analysis Summary</h2>
        <DownloadImages epochsPlotMap={epochs_plot} filterPlot={filter_plot} metadata={metadata} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-100 rounded-2xl p-4 ">
          <div className="space-y-2">
            <div>
              <span className="text-gray-700 font-medium">
                Signal Properties
              </span>
            </div>
            <CustomLabelText
              label="Sampling Frequency"
              icon={<AudioWaveform size={20} />}
              value={`${metadata.sfreq} Hz`}
            />
            <CustomLabelText
              label="Maximum Frequency"
              icon={<Activity size={20} />}
              value={`${metadata.max_freq} Hz`}
            />
            <CustomLabelText
              label="Duration"
              icon={<Timer size={20} />}
              value={`${metadata.duration} sec`}
            />
            <CustomLabelText
              label="Total no. of samples"
              icon={<Hash size={20} />}
              value={metadata.total_samples}
            />
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl p-4 space-y-2">
          <div>
            <span className="text-gray-700 font-medium">
              Channel Properties
            </span>
          </div>
          <CustomLabelText
            label="Total number of Channels"
            icon={<Layers size={20} />}
            value={metadata.total_channels}
          />
          <CustomLabelText
            label="Number of Good Channels"
            icon={<CheckCircle2Icon size={20} />}
            value={metadata.n_good}
            valueClassName="text-green-500"
          />
          <CustomLabelText
            label="Number of Bad Channels"
            icon={<XCircle size={20} />}
            value={metadata.n_bad}
            valueClassName="text-red-500"
          />
        </div>
      </div>
    </div>
  );
};
export default Summary;
