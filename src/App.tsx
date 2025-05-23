import { useEffect, useRef, useState } from "react";
import FileUploadCard from "./components/cards/fileUploadCard";
import SettingsCard from "./components/cards/settings/SettingsCard";
import { ToastContainer, Zoom } from "react-toastify";
import { VisualisationCard } from "./components/cards/VisualisationCard";
import { useFilterVis } from "./services/hooks/useFilterVis";
import { useEvents } from "./services/hooks/useEvents";
import { toastAPIHandler } from "./shared/toastAPI";
import { useEEGImageData } from "./stores/eegImageData";
import { useMetadataStore } from "./stores/summaryStore";


function App() {
  // store
  const { setFilterPlot, setEpochsPlot } = useEEGImageData();
  const { setMetadata } = useMetadataStore();

  // mutate functions
  const {
    mutate: filterMutate,
    data: filterData,
    isPending: filterIsPending,
    isSuccess: filterIsSuccess,
    isError: filterIsError,
    error: filterError,
  } = useFilterVis();

  const {
    mutate: eventsMutate,
    data: eventsData,
    isPending: eventsIsPending,
    isSuccess: eventsIsSuccess,
    isError: eventsIsError,
    error: eventsError,
  } = useEvents();

  const filterToastRef = useRef<string | number | null>(null);
  const eventToastRef = useRef<string | number | null>(null);
  function handleFilterFunc(file:File, payload:string){
    filterMutate({file, payload})
  }
  function handleEventFunc(file:File, payload:string){
    eventsMutate({file, payload})
  }
  useEffect(() => {
    const loadingMessage = "Filter Comparision Plot is being fetched";
    const successMessage = "Filter Comparision Plot is ready!";
    toastAPIHandler(
      loadingMessage,
      successMessage,
      filterIsPending,
      filterIsSuccess,
      filterIsError,
      filterError,
      filterToastRef
    );
    if (filterIsSuccess && filterData) {
      setFilterPlot(filterData.filter_plot);
      setMetadata(filterData.metadata);
    }
  }, [
    filterIsPending,
    filterIsSuccess,
    filterIsError,
    filterError,
    filterToastRef,
    filterData,
  ]);

  useEffect(() => {
    const loadingMessage = "Event Plots are being fetched";
    const successMessage = "Event Plots have been fetched!";

    toastAPIHandler(
      loadingMessage,
      successMessage,
      eventsIsPending,
      eventsIsSuccess,
      eventsIsError,
      eventsError,
      eventToastRef
    );
    if (eventsIsSuccess) {
      setEpochsPlot(eventsData.epochs_plot);
      setMetadata(eventsData.metadata);
    }
  }, [
    eventsIsPending,
    eventsIsSuccess,
    eventsIsError,
    eventsError,
    eventToastRef,
    eventsData,
  ]);
  
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
        <VisualisationCard />
      </div>
    </div>
  );
}

export default App;
