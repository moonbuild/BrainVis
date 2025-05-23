import { create } from "zustand";

interface FileDataStore {
  file: File | null;
  setFile: (file: File | null) => void;
}

export const useFileDataStore = create<FileDataStore>((set) => ({
  file: null,

  setFile: (file) => set({ file }),
}));
