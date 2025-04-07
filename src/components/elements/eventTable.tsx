import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const EventTable = () => {
  interface Event {
    id: number;
    name: string;
    startTime: number;
    endTime: number;
    duration: number;
  }

  const defaultNewEvent = {
    id: 1,
    name: "New Event",
    startTime: 0,
    endTime: 30,
    duration: 10,
  };

  const [events, setEvents] = useState<Event[]>([defaultNewEvent]);
  const addRow = (rowIndex: number) => {
    const newId = Math.max(...events.map((event) => event.id), 0) + 1;
    const newEvent = { ...defaultNewEvent, id: newId };
    const newEvents = [...events];
    newEvents.splice(rowIndex + 1, 0, newEvent);
    setEvents(newEvents);
  };

  const removeRow = (rowIndex: number) => {
    setEvents(events.filter((_, index) => index !== rowIndex));
  };

  const handleRowChange = (id:number, field:string, value:string) => {
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
          <thead >
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Id</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event, rowIndex) => (
              <tr
                key={event.id}
                className=" hover:bg-gray-50"
              >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={event.name}
                      className="border-0 bg-transparent focus:outline-none focus:ring-0 w-full"
                      onChange={(e) =>
                        handleRowChange(event.id, 'name', e.target.value)
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={event.startTime}
                      className="border-0 bg-transparent focus:outline-none focus:ring-0 w-16"
                      onChange={(e) =>
                        handleRowChange(event.id, 'startTime', e.target.value)
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={event.endTime}
                      className="border-0 bg-transparent focus:outline-none focus:ring-0 w-16"
                      onChange={(e) =>
                        handleRowChange(event.id, 'endTime', e.target.value)
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={event.duration}
                      className="border-0 bg-transparent focus:outline-none focus:ring-0 w-16"
                      onChange={(e) =>
                        handleRowChange(event.id, 'duration', e.target.value)
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
