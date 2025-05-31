import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EventTableType } from "../../types/eventTable";
import { useMetadataStore } from "../../stores/summaryStore";
import ErrorToolTip from "../../utils/errorToolTip";

interface EventTableProps {
  events: EventTableType[];
  setEvents: React.Dispatch<React.SetStateAction<EventTableType[]>>;
  setIsEventsTableInvalid: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventTable = ({
  events,
  setEvents,
  setIsEventsTableInvalid,
}: EventTableProps) => {
  const { metadata } = useMetadataStore();
  interface ValidationErrors {
    [eventId: number]: { name?: string; timeRange?: string };
  }
  const rowDeleteDisabled = useMemo(
    () => Object.keys(events).length === 1,
    [events]
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const resequenceIds = (eventList: EventTableType[]) => {
    return eventList.map((event, index) => ({
      ...event,
      id: index + 1,
    }));
  };
  const addRow = (rowIndex: number) => {
    const newEvents = [...events];
    const insertAt = rowIndex + 1;
    const { endTime } = events[rowIndex];
    const defaultNewEvent: EventTableType = {
      id: -1,
      name: `E${rowIndex + 2}`,
      startTime: endTime + 1,
      endTime: Math.floor(metadata?.duration ?? endTime + 1),
      duration: Math.floor((metadata?.duration ?? endTime + 1) - (endTime + 1)),
    };

    newEvents.splice(insertAt, 0, defaultNewEvent);
    const resequencedEvents = resequenceIds(newEvents);
    setEvents(resequencedEvents);
  };

  const removeRow = (rowIndex: number) => {
    const updatedEvents = events.filter((_, index) => index !== rowIndex);
    const resequencedEvents = resequenceIds(updatedEvents);
    setEvents(resequencedEvents);
  };

  useEffect(() => {
    const newErrors: ValidationErrors = {};
    const eventNames = new Set<string>();
    const duplicateNames = new Set<string>();
    events.forEach((event) => {
      if (eventNames.has(event.name)) {
        duplicateNames.add(event.name);
      } else {
        eventNames.add(event.name);
      }
      if (event.startTime >= event.endTime) {
        if (!newErrors[event.id]) newErrors[event.id] = {};
        newErrors[event.id].timeRange = "Start time must be less than end time";
      } else if (metadata?.duration) {
        if (event.startTime > metadata?.duration) {
          if (!newErrors[event.id]) newErrors[event.id] = {};
          newErrors[event.id].timeRange =
            "Start Time must be less than duration in the edf file";
        }
        if (event.endTime > metadata?.duration) {
          if (!newErrors[event.id]) newErrors[event.id] = {};
          newErrors[event.id].timeRange =
            "End Time must be less than duration in the edf file";
        }
      }
    });
    events.forEach((event) => {
      if (duplicateNames.has(event.name)) {
        if (!newErrors[event.id]) newErrors[event.id] = {};
        newErrors[event.id].name = "Duplicate event name";
      }
    });
    setIsEventsTableInvalid(Object.keys(newErrors).length > 0);
    setErrors(newErrors);
  }, [events, metadata?.duration]);

  const handleRowChange = (id: number, field: string, value: string) => {
    const updatedEvents = events.map((event) => {
      if (event.id === id) {
        const numericValue =
          field === "name" ? value : parseInt(value, 10) || 0;
        return { ...event, [field]: numericValue };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  return (
    <div className="p-6 max-w-4xl ">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event, rowIndex) => (
              <tr key={event.id} className=" hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <div className="relative inline-block w-full group">
                    <input
                      type="text"
                      value={event.name}
                      placeholder="Enter Event name"
                      className={`border-0 bg-transparent focus:outline-none focus:ring-0 w-full placeholder:text-sm${
                        errors[event.id]?.name
                          ? "border-b border-red-300 text-red-600"
                          : ""
                      }`}
                      onChange={(e) =>
                        handleRowChange(event.id, "name", e.target.value)
                      }
                    />
                    {errors[event.id]?.name && (
                      <div className="hidden group-hover:block">
                        <ErrorToolTip message={errors[event.id].name!} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative inline-block w-full group">
                    <input
                      type="number"
                      value={event.startTime}
                      className={`border-0 bg-transparent focus:outline-none focus:ring-0 w-full ${
                        errors[event.id]?.timeRange
                          ? "border-b border-red-300 text-red-600"
                          : ""
                      }`}
                      onChange={(e) =>
                        handleRowChange(event.id, "startTime", e.target.value)
                      }
                    />
                    {errors[event.id]?.timeRange && (
                      <div className="hidden group-hover:block">
                        <ErrorToolTip message={errors[event.id].timeRange!} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative inline-block w-full group">
                    <input
                      type="number"
                      value={event.endTime}
                      className={`border-0 bg-transparent focus:outline-none focus:ring-0 w-full ${
                        errors[event.id]?.timeRange
                          ? "border-b border-red-300 text-red-600"
                          : ""
                      }`}
                      onChange={(e) =>
                        handleRowChange(event.id, "endTime", e.target.value)
                      }
                    />
                    {errors[event.id]?.timeRange && (
                      <div className="hidden group-hover:block">
                        <ErrorToolTip message={errors[event.id].timeRange!} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={event.duration}
                    className="border-0 bg-transparent focus:outline-none focus:ring-0 w-16"
                    onChange={(e) =>
                      handleRowChange(event.id, "duration", e.target.value)
                    }
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => removeRow(rowIndex)}
                      disabled={rowDeleteDisabled}
                      className={`text-gray-400 transition-colors p-1 rounded ${
                        rowDeleteDisabled
                          ? "text-gray-300"
                          : "hover: text-red-500"
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => addRow(rowIndex)}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;
