import emailTemplatesData from "@/services/mockData/emailTemplates.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const emailTemplateService = {
  async getAll() {
    await delay(200);
    return [...emailTemplatesData];
  },

  async getById(id) {
    await delay(150);
    const template = emailTemplatesData.find(item => item.Id === parseInt(id));
    if (!template) {
      throw new Error("Email template not found");
    }
    return { ...template };
  },

  async create(templateData) {
    await delay(300);
    const newTemplate = {
      ...templateData,
      Id: Math.max(...emailTemplatesData.map(item => item.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    emailTemplatesData.push(newTemplate);
    return { ...newTemplate };
  },

  async update(id, updates) {
    await delay(250);
    const index = emailTemplatesData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Email template not found");
    }
    
    emailTemplatesData[index] = {
      ...emailTemplatesData[index],
      ...updates,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...emailTemplatesData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = emailTemplatesData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Email template not found");
    }
    
    const deletedTemplate = emailTemplatesData[index];
    emailTemplatesData.splice(index, 1);
    return { ...deletedTemplate };
  },

  async getByCategory(category) {
    await delay(150);
    return emailTemplatesData.filter(template => template.category === category).map(template => ({ ...template }));
  },

  // Helper function to replace variables in template content
  replaceVariables(content, variables) {
    let processedContent = content;
    Object.keys(variables).forEach(key => {
      const placeholder = `{{${key}}}`;
      const value = variables[key] || `[${key}]`;
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value);
    });
    return processedContent;
  },

  // Get available variables for templates
  getAvailableVariables() {
    return [
      { key: 'name', label: 'Contact Name', example: 'John Smith' },
      { key: 'company', label: 'Company Name', example: 'Acme Corp' },
      { key: 'position', label: 'Position/Title', example: 'Marketing Director' },
      { key: 'email', label: 'Email Address', example: 'john@acme.com' },
      { key: 'phone', label: 'Phone Number', example: '+1 (555) 123-4567' },
      { key: 'source', label: 'Lead Source', example: 'Website' },
      { key: 'currentDate', label: 'Current Date', example: new Date().toLocaleDateString() },
      { key: 'senderName', label: 'Your Name', example: 'Sales Representative' },
      { key: 'companyName', label: 'Your Company', example: 'Pipeline Pro' }
    ];
  }
};