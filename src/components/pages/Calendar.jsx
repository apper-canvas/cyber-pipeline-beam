import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { calendarService } from "@/services/api/calendarService";
import { leadsService } from "@/services/api/leadsService";
import { dealsService } from "@/services/api/dealsService";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from "date-fns";
import { toast } from "react-toastify";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "meeting",
    relatedTo: "",
    relatedType: "",
    startTime: "",
    endTime: "",
    location: "",
    description: ""
  });

  const eventTypes = [
    { value: "meeting", label: "Meeting", color: "bg-blue-500", icon: "Users" },
    { value: "call", label: "Call", color: "bg-green-500", icon: "Phone" },
    { value: "deadline", label: "Deadline", color: "bg-red-500", icon: "Clock" },
    { value: "follow_up", label: "Follow-up", color: "bg-yellow-500", icon: "MessageCircle" }
  ];

  const loadCalendarData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const [eventsData, leadsData, dealsData] = await Promise.all([
        calendarService.getAll(),
        leadsService.getAll(),
        dealsService.getAll()
      ]);
      
      setEvents(eventsData);
      setLeads(leadsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || "Failed to load calendar data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...newEvent,
        startTime: new Date(newEvent.startTime).toISOString(),
        endTime: new Date(newEvent.endTime).toISOString()
      };
      
      const createdEvent = await calendarService.create(eventData);
      setEvents(prev => [createdEvent, ...prev]);
      setShowAddModal(false);
      setNewEvent({
        title: "",
        type: "meeting",
        relatedTo: "",
        relatedType: "",
        startTime: "",
        endTime: "",
        location: "",
        description: ""
      });
      toast.success("Event added successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to add event");
    }
  };

  const getEventTypeConfig = (type) => {
    return eventTypes.find(et => et.value === type) || eventTypes[0];
  };

  const getRelatedName = (relatedTo, relatedType) => {
    if (!relatedTo) return "";
    
    if (relatedType === "lead") {
      const lead = leads.find(l => l.Id === parseInt(relatedTo));
      return lead ? lead.name : "Unknown Lead";
    } else if (relatedType === "deal") {
      const deal = deals.find(d => d.Id === parseInt(relatedTo));
      return deal ? deal.title : "Unknown Deal";
    }
    
    return "";
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startTime), date)
    );
  };

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayEvents = getEventsForDate(day);
        
        days.push(
          <div
            className={`min-h-[120px] border border-slate-200 p-2 cursor-pointer transition-colors hover:bg-slate-50 ${
              !isSameMonth(day, monthStart) ? "text-slate-400 bg-slate-50" :
              isSameDay(day, selectedDate) ? "bg-primary-50 border-primary-200" :
              isToday(day) ? "bg-blue-50 border-blue-200" : ""
            }`}
            key={day}
            onClick={() => {
              setSelectedDate(cloneDay);
              if (dayEvents.length === 0) {
                setNewEvent({ 
                  ...newEvent, 
                  startTime: format(cloneDay, "yyyy-MM-dd'T'09:00"),
                  endTime: format(cloneDay, "yyyy-MM-dd'T'10:00")
                });
                setShowAddModal(true);
              }
            }}
          >
            <span className={`text-sm font-medium ${
              isToday(day) ? "text-blue-600" : 
              !isSameMonth(day, monthStart) ? "text-slate-400" : 
              "text-slate-900"
            }`}>
              {formattedDate}
            </span>
            
            <div className="mt-1 space-y-1">
              {dayEvents.slice(0, 3).map((event, index) => {
                const eventType = getEventTypeConfig(event.type);
                return (
                  <motion.div
                    key={event.Id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                    className={`text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 ${eventType.color}`}
                  >
                    <div className="flex items-center">
                      <ApperIcon name={eventType.icon} className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{event.title}</span>
                    </div>
                  </motion.div>
                );
              })}
              
              {dayEvents.length > 3 && (
                <div className="text-xs text-slate-600 text-center py-1">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className="bg-white rounded-xl shadow-sm border border-slate-200">{rows}</div>;
  };

  if (isLoading) return <Loading message="Loading calendar..." />;
  if (error) return <Error message={error} onRetry={loadCalendarData} />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Calendar
            </h1>
            <p className="text-slate-600 mt-2">
              Schedule meetings and track important dates
            </p>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Calendar Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4" />
              </Button>
              
              <h2 className="text-xl font-semibold text-slate-900 min-w-[200px] text-center">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div>
          {/* Days Header */}
          <div className="grid grid-cols-7 bg-white rounded-t-xl border border-slate-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="p-4 text-center text-sm font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Body */}
          {events.length === 0 ? (
            <Empty
              title="No events scheduled"
              description="Start by adding your first meeting or event to the calendar."
              icon="Calendar"
              actionLabel="Add First Event"
              onAction={() => setShowAddModal(true)}
            />
          ) : (
            renderCalendarGrid()
          )}
        </div>

        {/* Event Legend */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Event Types</h3>
          <div className="flex flex-wrap gap-4">
            {eventTypes.map(type => (
              <div key={type.value} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                <span className="text-sm text-slate-600">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add Event Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200"
              >
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Add New Event</h3>
                </div>
                
                <form onSubmit={handleAddEvent} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Event Title *
                      </label>
                      <Input
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        required
                        placeholder="Enter event title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Event Type
                      </label>
                      <select
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Related To
                      </label>
                      <select
                        value={`${newEvent.relatedType}-${newEvent.relatedTo}`}
                        onChange={(e) => {
                          const [type, id] = e.target.value.split("-");
                          setNewEvent({ 
                            ...newEvent, 
                            relatedType: type === "none" ? "" : type, 
                            relatedTo: id === "none" ? "" : id 
                          });
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="none-none">Not related</option>
                        <optgroup label="Leads">
                          {leads.map(lead => (
                            <option key={`lead-${lead.Id}`} value={`lead-${lead.Id}`}>
                              {lead.name} - {lead.company}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Deals">
                          {deals.map(deal => (
                            <option key={`deal-${deal.Id}`} value={`deal-${deal.Id}`}>
                              {deal.title}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Start Time *
                      </label>
                      <Input
                        type="datetime-local"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        End Time *
                      </label>
                      <Input
                        type="datetime-local"
                        value={newEvent.endTime}
                        onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Location
                      </label>
                      <Input
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        placeholder="Enter location or meeting link"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Add event description..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add Event
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Detail Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200"
              >
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                        getEventTypeConfig(selectedEvent.type).color
                      }`}>
                        <ApperIcon name={getEventTypeConfig(selectedEvent.type).icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{selectedEvent.title}</h3>
                        <p className="text-sm text-slate-600">
                          {getEventTypeConfig(selectedEvent.type).label}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Clock" className="w-4 h-4 mr-3 text-slate-400" />
                    <span>
                      {format(new Date(selectedEvent.startTime), "MMM dd, yyyy 'at' h:mm a")} - {" "}
                      {format(new Date(selectedEvent.endTime), "h:mm a")}
                    </span>
                  </div>
                  
                  {selectedEvent.location && (
                    <div className="flex items-center text-sm text-slate-600">
                      <ApperIcon name="MapPin" className="w-4 h-4 mr-3 text-slate-400" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  
                  {selectedEvent.relatedTo && (
                    <div className="flex items-center text-sm text-slate-600">
                      <ApperIcon name="Link" className="w-4 h-4 mr-3 text-slate-400" />
                      <span>
                        Related to {selectedEvent.relatedType}: {getRelatedName(selectedEvent.relatedTo, selectedEvent.relatedType)}
                      </span>
                    </div>
                  )}
                  
                  {selectedEvent.description && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600">{selectedEvent.description}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3 pt-4 border-t border-slate-200">
                    <Button variant="outline" className="flex-1">
                      <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                      Edit Event
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Calendar;