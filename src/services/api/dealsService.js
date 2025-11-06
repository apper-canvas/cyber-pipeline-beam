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
  },

  async getMetrics() {
    await delay(200);
    const closedWonDeals = dealsData.filter(deal => deal.stage === "closed_won");
    const allDeals = [...dealsData];
    
    // Average deal size
    const avgDealSize = closedWonDeals.length > 0 
      ? closedWonDeals.reduce((sum, deal) => sum + deal.value, 0) / closedWonDeals.length
      : 0;
    
    // Time to close (average days from creation to close)
    const timeToClose = closedWonDeals.length > 0
      ? closedWonDeals.reduce((sum, deal) => {
          const created = new Date(deal.createdAt);
          const closed = new Date(deal.closedAt || deal.updatedAt);
          return sum + Math.ceil((closed - created) / (1000 * 60 * 60 * 24));
        }, 0) / closedWonDeals.length
      : 0;
    
    // Sales velocity: (Number of deals × Average deal value) / Average sales cycle
    const salesVelocity = timeToClose > 0 
      ? (closedWonDeals.length * avgDealSize) / timeToClose
      : 0;
    
    return {
      avgDealSize,
      timeToClose,
      salesVelocity,
      totalClosedWonDeals: closedWonDeals.length
    };
  }
};