import leadsData from "@/services/mockData/leads.json";
import React from "react";
import Error from "@/components/ui/Error";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const leadsService = {
  async getAll() {
    await delay(300);
    return [...leadsData];
  },

  async getById(id) {
    await delay(200);
    const lead = leadsData.find(item => item.Id === parseInt(id));
    if (!lead) {
      throw new Error("Lead not found");
    }
    return { ...lead };
  },

  async create(leadData) {
    await delay(400);
    const newLead = {
      ...leadData,
      Id: Math.max(...leadsData.map(item => item.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      lastContactedAt: null
    };
    leadsData.push(newLead);
    return { ...newLead };
  },

  async update(id, updates) {
    await delay(300);
    const index = leadsData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Lead not found");
    }
    
    leadsData[index] = {
      ...leadsData[index],
      ...updates,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...leadsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = leadsData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Lead not found");
    }
    
    const deletedLead = leadsData[index];
    leadsData.splice(index, 1);
    return { ...deletedLead };
  },

  async getByStatus(status) {
    await delay(200);
    return leadsData.filter(lead => lead.status === status).map(lead => ({ ...lead }));
  },

async getBySource(source) {
    await delay(200);
    return leadsData.filter(lead => lead.source === source).map(lead => ({ ...lead }));
  },

  async getWinRateBySource(deals) {
    await delay(200);
    const sources = [...new Set(leadsData.map(lead => lead.source))];
    const sourceStats = {};
    
    sources.forEach(source => {
      const leadsFromSource = leadsData.filter(lead => lead.source === source);
      const dealsFromSource = deals.filter(deal => 
        leadsFromSource.some(lead => lead.Id === deal.leadId)
      );
      const wonDeals = dealsFromSource.filter(deal => deal.stage === "closed_won");
      
      sourceStats[source] = {
        totalDeals: dealsFromSource.length,
        wonDeals: wonDeals.length,
        winRate: dealsFromSource.length > 0 ? Math.round((wonDeals.length / dealsFromSource.length) * 100) : 0
      };
    });
    
    // Return overall win rate across all sources
    const totalDeals = Object.values(sourceStats).reduce((sum, stat) => sum + stat.totalDeals, 0);
    const totalWon = Object.values(sourceStats).reduce((sum, stat) => sum + stat.wonDeals, 0);
    const overallWinRate = totalDeals > 0 ? Math.round((totalWon / totalDeals) * 100) : 0;
    
    return {
      bySource: sourceStats,
      overall: overallWinRate
    };
  }