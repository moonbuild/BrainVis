export type EventTableType = {
  id: number;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
};

export const initialEvent = [
  {
    id: 0,
    name: "E1",
    startTime: 0,
    endTime: 30,
    duration: 10,
  },
];