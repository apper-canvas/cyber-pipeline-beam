import dealsData from "@/services/mockData/deals.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealsService = {
  async getAll() {
    await delay(350);
    return [...dealsData];
  },

  async getById(id) {
    await delay(200);
    const deal = dealsData.find(item => item.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(450);
    const newDeal = {
      ...dealData,
      Id: Math.max(...dealsData.map(item => item.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dealsData.push(newDeal);
    return { ...newDeal };
  },

  async update(id, updates) {
    await delay(300);
    const index = dealsData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    dealsData[index] = {
      ...dealsData[index],
      ...updates,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...dealsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = dealsData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const deletedDeal = dealsData[index];
    dealsData.splice(index, 1);
    return { ...deletedDeal };
  },

  async getByStage(stage) {
    await delay(200);
    return dealsData.filter(deal => deal.stage === stage).map(deal => ({ ...deal }));
  },

  async updateStage(id, newStage) {
    await delay(300);
    const index = dealsData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    dealsData[index] = {
      ...dealsData[index],
      stage: newStage,
      updatedAt: new Date().toISOString()
    };
    
    return { ...dealsData[index] };
  }
};