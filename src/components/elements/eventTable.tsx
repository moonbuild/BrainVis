import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { EventTableType } from "../../types/eventTable";

interface EventTableProps {
  events: EventTableType[];
  setEvents: React.Dispatch<React.SetStateAction<EventTableType[]>>;
}
const ErrorToolTip = ({ message }: { message: string }) => {
  return (
    <div className="absolute z-10 top-1/2 -translate-y-1/2 left-full ml-2 bg-red-50 border border-red-200 rounded px-2 py-1 shadown-sm">
      <div className="flex items-center">
        <AlertCircle size={14} className="text-red-500 mr-1 flex-shrink-0" />
        <span className="text-xs text-red-600 font-medium">{message}</span>
      </div>
      <div className="absolute top-1/2 -left-1 w-1 h-2 bg-red-50 border-1 border-t border-red-200 transform -rotate-45 translate-y-[-50%]" />
    </div>
  );
};
const EventTable = ({ events, setEvents }: EventTableProps) => {
  interface ValidationErrors {
    [eventId: number]: { name?: string; timeRange?: string };
  }
  const [errors, setErrors] = useState<ValidationErrors>({});
  const defaultNewEvent = {
    id: 1,
    name: "New Event",
    startTime: 0,
    endTime: 30,
    duration: 10,
  };
  const resequenceIds = (eventList: EventTableType[]) => {
    return eventList.map((event, index) => ({
      ...event,
      id: index + 1,
    }));
  };
  const addRow = (rowIndex: number) => {
    const newEvents = [...events];
    const insertAt = rowIndex + 1;
    const newEvent = {
      ...defaultNewEvent,
      id: -1,
    };

    newEvents.splice(insertAt, 0, newEvent);
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
      }
    });
    events.forEach((event) => {
      if (duplicateNames.has(event.name)) {
        if (!newErrors[event.id]) newErrors[event.id] = {};
        newErrors[event.id].name = "Duplicate event name";
      }
    });
    setErrors(newErrors);
  }, [events]);

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
                Event Id
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
                      className={`border-0 bg-transparent focus:outline-none focus:ring-0 w-full ${
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
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded "
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
