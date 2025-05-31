import { useCallback} from "react";
import { useDropzone } from "react-dropzone";
import { useChannelNames } from "../../../services/hooks/useChannels";
import { useFileDataStore } from "../../../stores/fileStore";
import { useEEGChannelStore } from "../../../stores/eegSettingsStore";
import { ChannelInfoType } from "../../../types/Settings";
import { useToastAPI } from "../../../services/hooks/useToastAPI";

function FileUploadCard() {
  const { file, setFile } = useFileDataStore();
  const { setAllChannelsInfo } = useEEGChannelStore();
  const {
    mutate: uploadFile,
    isPending: chNamesIsPending,
    isSuccess: chNamesIsSuccess,
    isError: chNamesIsError,
    error: chNamesError,
  } = useChannelNames({
    onSuccess: (data) => {
      const channelData: ChannelInfoType[] = data.map((channel) => ({
        name: channel,
        type: "eeg",
      }));
      setAllChannelsInfo(channelData);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.name.endsWith(".edf")) {
        setFile(file);
        uploadFile({ file });
      }
    },
    [setFile, uploadFile]
  );

  useToastAPI(
    {
      loadingMessage: "Fetching Channel Names...",
      successMessage: "Channel Names fetched!",
    },
    {
      isPending: chNamesIsPending,
      isSuccess: chNamesIsSuccess,
      isError: chNamesIsError,
      error: chNamesError,
    }
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <>
      <div
        className="w-1/4 bg-cardColor rounded-[10%] shadow-lg flex flex-col items-center
      gap-2
        pt-30 pb-10 "
      >
        <div className="text-center py-4">
          <h2 className="text-xl font-semibold ">Upload an EDF File</h2>
          <p className="text-sm text-grey-500">Only EDF Files are allowed</p>
        </div>
        <div className="flex flex-col w-full items-center justify-between  gap-4">
          <div
            {...getRootProps()}
            className={`p-1 flex items-center justify-center border-2 border-dashed rounded-3xl border-gray-500  hover:border-gray-800 ${
              isDragActive ? "border-gray-800" : "border-gray-500"
            } ${file ? "border-none" : "border-2"}`}
          >
            <input {...getInputProps()} type="file" accept=".edf" hidden />
            {!file ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="94"
                height="94"
                viewBox="0 0 64 64"
              >
                <path
                  fill="orange"
                  d="M49,19.999V52H13c-2.761,0-5-2.239-5-5V15c0-2.209,1.791-4,4-4h11.046c1.756,0,3.307,1.145,3.823,2.824l0.234,0.761c0.258,0.839,1.033,1.412,1.911,1.412l15.986,0.003C47.21,16,49,17.79,49,19.999z"
                ></path>
                <ellipse
                  cx="32"
                  cy="60.993"
                  opacity=".3"
                  rx="22.563"
                  ry="3"
                ></ellipse>
                <path
                  fill="#ffce29"
                  d="M55.22,23H24.7c-3.319,0-6.182,2.331-6.855,5.582L13,52h36.3c3.319,0,6.182-2.331,6.855-5.582l3.674-17.758C60.433,25.739,58.203,23,55.22,23z"
                ></path>
              </svg>
            ) : (
              <svg
                width="94"
                height="94"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <title>Layer 1</title>
                  <ellipse
                    cx="32"
                    cy="60.993"
                    opacity="0.3"
                    rx="22.563"
                    ry="3"
                    id="svg_9"
                  />
                  <path
                    fill="orange"
                    d="m49,19.999l0,32.001l-36,0c-2.761,0 -5,-2.239 -5,-5l0,-32c0,-2.209 1.791,-4 4,-4l11.046,0c1.756,0 3.307,1.145 3.823,2.824l0.234,0.761c0.258,0.839 1.033,1.412 1.911,1.412l15.986,0.003c2.21,0 4,1.79 4,3.999z"
                    id="svg_7"
                  />
                  <rect
                    fill="#fff"
                    x="11.5235"
                    y="19.11867"
                    width="42.24664"
                    height="31.54253"
                    id="svg_4"
                    strokeWidth="0"
                    rx="3"
                    stroke="#000"
                  />
                  <path
                    fill="#ffce29"
                    d="m55.22,23l-30.52,0c-3.319,0 -6.182,2.331 -6.855,5.582l-4.845,23.418l36.3,0c3.319,0 6.182,-2.331 6.855,-5.582l3.674,-17.758c0.604,-2.921 -1.626,-5.66 -4.609,-5.66z"
                    id="svg_6"
                  />
                  <g id="svg_13">
                    <rect
                      fill="#cccccc"
                      strokeWidth="0"
                      x="41.104"
                      y="20.32172"
                      width="10.41722"
                      height="0.71225"
                      id="svg_8"
                      rx="0.5"
                      stroke="#000"
                    />
                    <rect
                      fill="#cccccc"
                      strokeWidth="0"
                      x="44.63157"
                      y="21.49758"
                      width="6.9919"
                      height="0.71225"
                      id="svg_11"
                      rx="0.5"
                      stroke="#000"
                    />
                  </g>
                </g>
              </svg>
            )}
          </div>
          {file && (
            <div className="w-full flex justify-center flex-col items-center">
              <p className="text-sm font-normal ">Selected File: </p>
              <div className="text-sm underline truncate font-light overflow-hidden w-[80%] whitespace-nowrap">
                {file.name}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FileUploadCard;
