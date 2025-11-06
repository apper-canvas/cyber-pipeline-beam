import calendarData from "@/services/mockData/calendarEvents.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const calendarService = {
  async getAll() {
    await delay(300);
    return [...calendarData];
  },

  async getById(id) {
    await delay(200);
    const event = calendarData.find(item => item.Id === parseInt(id));
    if (!event) {
      throw new Error("Calendar event not found");
    }
    return { ...event };
  },

  async create(eventData) {
    await delay(400);
    const newEvent = {
      ...eventData,
      Id: Math.max(...calendarData.map(item => item.Id), 0) + 1
    };
    calendarData.push(newEvent);
    return { ...newEvent };
  },

  async update(id, updates) {
    await delay(300);
    const index = calendarData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Calendar event not found");
    }
    
    calendarData[index] = {
      ...calendarData[index],
      ...updates,
      Id: parseInt(id)
    };
    
    return { ...calendarData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = calendarData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Calendar event not found");
    }
    
    const deletedEvent = calendarData[index];
    calendarData.splice(index, 1);
    return { ...deletedEvent };
  },

  async getByDateRange(startDate, endDate) {
    await delay(250);
    return calendarData
      .filter(event => {
        const eventDate = new Date(event.startTime);
        return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
      })
      .map(event => ({ ...event }));
  },

  async getByType(type) {
    await delay(200);
    return calendarData.filter(event => event.type === type).map(event => ({ ...event }));
  }
};