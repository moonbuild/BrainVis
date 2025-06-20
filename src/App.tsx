import { useEffect, useState } from "react";
import FileUploadCard from "./components/cards/fileUpload/fileUploadCard";
import SettingsCard from "./components/cards/settings/SettingsCard";
import { ToastContainer, Zoom } from "react-toastify";
import { VisualisationCard } from "./components/cards/visualisations/VisualisationCard";
import { useEEGImageData } from "./stores/eegImageData";
import { useMetadataStore } from "./stores/summaryStore";
import { useFilterRequest } from "./services/hooks/useFilterRequest";
import { useEventsRequest } from "./services/hooks/useEventsRequest";
import { useToastAPI } from "./services/hooks/useToastAPI";
import { activeTabItem } from "./types/VisualisationCard";
import './App.css';

function App() {
  // store
  const { setFilterPlot, setEpochsPlot } = useEEGImageData();
  const { setMetadata } = useMetadataStore();
  const [visualisationActiveTab, setVisualisationActiveTab] =
    useState<activeTabItem>("filter");

  // mutate functions
  const {
    mutate: filterMutate,
    isPending: filterIsPending,
    isSuccess: filterIsSuccess,
    isError: filterIsError,
    error: filterError,
  } = useFilterRequest({
    onSuccess: (data) => {
      setFilterPlot(data.filter_plot);
      setMetadata(data.metadata);
      setVisualisationActiveTab("filter")
    },
  });

  const {
    mutate: eventsMutate,
    isPending: eventsIsPending,
    isSuccess: eventsIsSuccess,
    isError: eventsIsError,
    error: eventsError,
  } = useEventsRequest({
    onSuccess: (data) => {
      setEpochsPlot(data.epochs_plot);
      setMetadata(data.metadata);
      setVisualisationActiveTab("events")
    },
  });

  function handleFilterFunc(file: File, payload: string) {
    filterMutate({ file, payload });
  }

  function handleEventFunc(file: File, payload: string) {
    eventsMutate({ file, payload });
  }

  useToastAPI(
    {
      loadingMessage: "Filter Comparision Plot is being fetched",
      successMessage: "Filter Comparision Plot is ready!",
    },
    {
      isPending: filterIsPending,
      isSuccess: filterIsSuccess,
      isError: filterIsError,
      error: filterError,
    }
  );
  useToastAPI(
    {
      loadingMessage: "Event Plots are being fetched",
      successMessage: "Event Plots are ready!",
    },
    {
      isPending: eventsIsPending,
      isSuccess: eventsIsSuccess,
      isError: eventsIsError,
      error: eventsError,
    }
  );

  const getInitialtheme = () => {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme") === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDark, setIsDark] = useState<boolean>(getInitialtheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return (
    <div className="min-h-screen bg-baseColor">
      <div className="max-w-6xl mx-auto space-y-6 p-10">
        <div className="flex flex-row justify-center gap-6 ">
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Zoom}
          />
          <FileUploadCard />
          <SettingsCard
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
            handleFilterFunc={handleFilterFunc}
            handleEventFunc={handleEventFunc}
          />
        </div>
        <VisualisationCard
          visualisationActiveTab={visualisationActiveTab}
          setVisualisationActiveTab={setVisualisationActiveTab}
        />
      </div>
    </div>
  );
}

export default App;
