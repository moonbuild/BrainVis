import { CircleCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useChannelNames } from "../../services/hooks/useChannels";
import { useFileDataStore } from "../../stores/eegSettingsStore";
import { toast } from "react-toastify";

function FileUploadCard() {
  const { file, setFile, channelNames, setChannelNames } = useFileDataStore();
  const { mutate: uploadFile, isPending, error, data } = useChannelNames();
  const toastId = useRef<string | number | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith(".edf")) {
      setFile(file);
      uploadFile(file);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setChannelNames(data);
    }
  }, [data]);

  useEffect(() => {
    if (isPending && !toastId.current) {
      toastId.current = toast.loading("Fetching Channel Names...");
    } else if (!isPending && toastId.current) {
      toast.update(toastId.current, {
        render: "Channel Names fetched!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
        pauseOnHover: true,
      });
    } else if (error && toastId.current) {
      toast.update(toastId.current, {
        render: "Failed to fetch channel names.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        pauseOnHover: true,
      });
    }
  }, [isPending, error]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "": [".edf"] },
    multiple: false,
  });

  return (
    <div className="w-1/4  bg-cardColor rounded-[10%] shadow-md pb-1 flex flex-col">
      <div className="px-6 pt-24">
        <h2 className="text-xl font-semibold text-center">
          Upload an EDF File
        </h2>
        <p className="text-sm text-grey-500 text-center mt-1 mb-1">
          Only EDF Files are allowed
        </p>
      </div>
      <div className="flex flex-grow flex-col items-center justify-center p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-[20%] p-2 flex flex-col items-center justify-center cursor-pointer  ${
            isDragActive ? "border-gray-600" : "border-gray-500"
          }`}
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
            <CircleCheck className="text-orange-400" size={85} />
          )}
        </div>
        {file && (
          <div className="w-full mt-2 px-2 flex justify-center flex-col items-center">
            <p className="text-sm font-normal ">Selected File: </p>
            <div className="text-sm underline font-light truncate overflow-hidden max-w-full whitespace-nowrap">
              {file.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploadCard;
