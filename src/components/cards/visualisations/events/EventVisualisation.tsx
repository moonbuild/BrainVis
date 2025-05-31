import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { useEEGImageData } from "../../../../stores/eegImageData";
import { NoVisualisations } from "../../../../shared/NoVisualisations";

const EventVisualisation = () => {
  const { epochs_plot } = useEEGImageData();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(
    Object.keys(epochs_plot)[0] ?? null
  );
  const allEventsKeys = useMemo(() => Object.keys(epochs_plot), [epochs_plot]);

  const [eventPosition, setEventPosition] = useState<number>(0);

  const eventsPerWindow = 4;

  const [searchEvent, setSearchEvent] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<string[]>([]);

  useEffect(() => {
    setFilteredEvents(allEventsKeys);
    setSelectedEvent(allEventsKeys[0]);
    setEventPosition(0);
  }, [allEventsKeys]);

  useEffect(() => {
    if (searchEvent.trim() === "") {
      setFilteredEvents(allEventsKeys);
    } else {
      const matchedEvents =
        allEventsKeys?.filter((event) =>
          event.toLowerCase().includes(searchEvent.trim().toLowerCase())
        ) ?? [];
      setFilteredEvents(matchedEvents);
    }
    setEventPosition(0);
  }, [searchEvent, allEventsKeys]);

  const handlePrev = () => {
    setEventPosition((prev) => Math.max(prev - eventsPerWindow, 0));
  };
  const handleNext = () => {
    if (filteredEvents) {
      setEventPosition((prev) =>
        Math.min(prev + eventsPerWindow, filteredEvents.length - 1)
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium">Epoch Visualisation</h2>
        {Object.keys(epochs_plot).length > 0 && (
          <div className="flex flex-end gap-4">
            <div className="relative gap-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-1">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full px-10 py-1 text-sm rounded-xl border-1 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 hover:ring-2 hover:ring-orange-400"
                placeholder="Search Events ..."
                value={searchEvent}
                onChange={(e) => setSearchEvent(e.target.value)}
              />
            </div>
            <div className="rounded-xl bg-gray-100 flex">
              <button
                className={`p-2 cursor-pointer  ${
                  eventPosition > 0
                    ? "text-gray-800 hover:text-gray-700"
                    : "text-gray-500 cursor-not-allowed"
                }`}
                disabled={eventPosition === 0}
                onClick={handlePrev}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center">
                {(filteredEvents ?? [])
                  .slice(eventPosition, eventPosition + eventsPerWindow)
                  .map((event) => (
                    <button
                      key={event}
                      className={`px-2 py-1 mx-1 text-sm rounded-md cursor-pointer ${
                        selectedEvent === event
                          ? "bg-orange-500 text-white"
                          : "text-gray-800 hover:text-gray-700"
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      {event}
                    </button>
                  ))}
              </div>
              <div className="relative group">
                <button
                  className={`p-2 cursor-pointer text-gray-800 hover:text-gray-700 `}
                >
                  <MoreHorizontal size={16} />
                </button>
                <div
                  className="absolute bg-white text-gray-800 top-full left-1/2 transform -translate-x-1/2 mt-2 rounded-md shadow-lg scale-0 group-hover:scale-100 transition-all duration-200 ease-out origin-top
                          max-h-60 overflow-auto 
                          "
                >
                  <ul className="p-2 space-y-2 overflow-auto">
                    {filteredEvents.map((event) => (
                      <li
                        key={event}
                        className="hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                className={`p-2 cursor-pointer ${
                  eventPosition + eventsPerWindow >=
                  (filteredEvents?.length ?? 0)
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-800 hover:text-gray-700"
                }`}
                disabled={
                  eventPosition + eventsPerWindow >=
                  (filteredEvents?.length ?? 0)
                }
                onClick={handleNext}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      {Object.keys(epochs_plot).length === 0 || !selectedEvent ? (
        <NoVisualisations />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
              <div className="flex justify-between mb-2">
                <h2 className="text-lg font-medium text-gray-800">
                  Epoch Plot
                </h2>
                <span className="px-2 py-1 text-sm font-normal  bg-orange-100 text-orange-800 rounded">
                  {selectedEvent}
                </span>
              </div>
              <div className="p-2 flex-1 flex items-center justify-center bg-white border rounded">
                <img
                  src={epochs_plot[selectedEvent].epoch_plot?.url}
                  alt="epochs_plot"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col ">
              <div className="flex justify-between mb-2">
                <h2 className="text-lg font-medium text-gray-800">
                  Peak Brain Activity Plot
                </h2>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 text-sm font-normal rounded">
                  {selectedEvent}
                </span>
              </div>
              <div className="p-2 flex-1 flex items-center justify-center bg-white border rounded">
                <img
                  src={epochs_plot[selectedEvent].mini_topomap_plot?.url}
                  alt="mini_topomap_plot"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
              <div className="flex justify-between mb-2">
                <h2 className="text-lg font-medium text-gray-800">PSD Plot</h2>
                <span className="px-2 py-1 text-sm font-normal rounded bg-orange-100 text-orange-800">
                  {selectedEvent}
                </span>
              </div>
              <div className="p-2 flex-1 flex items-center justify-center bg-white rounded border">
                <img
                  src={epochs_plot[selectedEvent].psd_plot?.url}
                  alt="psd_plot"
                />
              </div>
            </div>
            <div className="bg-gray-50 rounded p-4 flex flex-col">
              <div className="flex justify-between mb-2">
                <h2 className="text-lg font-medium  text-gray-800">
                  Topomap Plot
                </h2>
                <span className="px-2 py-1 rounded bg-orange-100 text-orange-800">
                  {selectedEvent}
                </span>
              </div>
              <div className="p-2 flex-1 flex items-center justify-center bg-white border rounded">
                <img src={epochs_plot[selectedEvent].topomap_plot?.url} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default EventVisualisation;
