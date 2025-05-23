export type EventTableType = {
  id: number;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
};

export const initialEvent = [
  {
    id: 1,
    name: "E1",
    startTime: 0,
    endTime: 30,
    duration: 10,
  },
  {
    id: 2,
    name: "E2",
    startTime: 31,
    endTime: 61,
    duration: 10,
  },
  {
    id: 3,
    name: "E3",
    startTime: 62,
    endTime: 92,
    duration: 10,
  },
  {
    id: 4,
    name: "EQ",
    startTime: 93,
    endTime: 103,
    duration: 10,
  },
];
