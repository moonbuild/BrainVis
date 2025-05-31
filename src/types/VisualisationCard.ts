import { SetStateAction } from "react";

export type activeTabItem = "filter" | "events" | "summary";

export interface VisualisationCardProps {
  visualisationActiveTab:activeTabItem;
  setVisualisationActiveTab:React.Dispatch<SetStateAction<activeTabItem>>
}