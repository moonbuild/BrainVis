import { useEffect, useState } from "react";
import FileUploadCard from "./components/cards/fileUploadCard";
import SettingsCard from "./components/cards/SettingsCard";
import { ToastContainer, Zoom } from "react-toastify";
import { VisualisationCard } from "./components/cards/VisualisationCard";

function App() {
  const [file, setFile] = useState<File | null>(null);

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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-row justify-center gap-6 p-10">
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
          <SettingsCard isDark={isDark} toggleDarkMode={toggleDarkMode} />
        </div>
        <VisualisationCard />
        </div>
    </div>
  );
}

export default App;
