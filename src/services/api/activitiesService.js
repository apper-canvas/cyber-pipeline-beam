import activitiesData from "@/services/mockData/activities.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activitiesService = {
  async getAll() {
    await delay(250);
    return [...activitiesData];
  },

  async getById(id) {
    await delay(200);
    const activity = activitiesData.find(item => item.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(350);
    const newActivity = {
      ...activityData,
      Id: Math.max(...activitiesData.map(item => item.Id), 0) + 1,
      scheduledAt: activityData.scheduledAt || new Date().toISOString(),
      createdBy: activityData.createdBy || "Current User"
    };
    activitiesData.push(newActivity);
    return { ...newActivity };
  },

  async update(id, updates) {
    await delay(300);
    const index = activitiesData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    activitiesData[index] = {
      ...activitiesData[index],
      ...updates,
      Id: parseInt(id)
    };
    
    return { ...activitiesData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = activitiesData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    const deletedActivity = activitiesData[index];
    activitiesData.splice(index, 1);
    return { ...deletedActivity };
  },

  async getByRelatedItem(relatedTo, relatedType) {
    await delay(200);
    return activitiesData
      .filter(activity => activity.relatedTo === relatedTo && activity.relatedType === relatedType)
      .map(activity => ({ ...activity }));
  },

  async getByType(type) {
    await delay(200);
    return activitiesData.filter(activity => activity.type === type).map(activity => ({ ...activity }));
  },

  async markCompleted(id) {
    await delay(250);
    const index = activitiesData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    activitiesData[index] = {
      ...activitiesData[index],
      completedAt: new Date().toISOString()
    };
    
    return { ...activitiesData[index] };
  }
};