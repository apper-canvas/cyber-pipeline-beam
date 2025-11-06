import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { emailTemplateService } from "@/services/api/emailTemplateService";
import { toast } from "react-toastify";

const EmailComposerModal = ({ isOpen, onClose, selectedLead }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    content: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [availableVariables] = useState(emailTemplateService.getAvailableVariables());

  useEffect(() => {
    if (isOpen && selectedLead) {
      setEmailData({
        to: selectedLead.email,
        subject: "",
        content: ""
      });
      loadTemplates();
    }
  }, [isOpen, selectedLead]);

  const loadTemplates = async () => {
    try {
      const templatesData = await emailTemplateService.getAll();
      setTemplates(templatesData);
    } catch (error) {
      console.error("Failed to load templates:", error);
      toast.error("Failed to load email templates");
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    const variables = getLeadVariables();
    setEmailData({
      to: selectedLead?.email || "",
      subject: emailTemplateService.replaceVariables(template.subject, variables),
      content: emailTemplateService.replaceVariables(template.content, variables)
    });
    setShowTemplateSelector(false);
  };

  const getLeadVariables = () => {
    if (!selectedLead) return {};
    
    return {
      name: selectedLead.name,
      company: selectedLead.company,
      position: selectedLead.position || selectedLead.title,
      email: selectedLead.email,
      phone: selectedLead.phone,
      source: selectedLead.source,
      currentDate: new Date().toLocaleDateString(),
      senderName: "Sales Representative",
      companyName: "Pipeline Pro"
    };
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Email sent to ${selectedLead?.name || 'contact'}!`);
      onClose();
      resetForm();
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setEmailData({ to: "", subject: "", content: "" });
    setShowTemplateSelector(true);
  };

  const insertVariable = (variable) => {
    const placeholder = `{{${variable.key}}}`;
    setEmailData(prev => ({
      ...prev,
      content: prev.content + placeholder
    }));
  };

  const getTemplatesByCategory = (category) => {
    return templates.filter(template => template.category === category);
  };

  const categories = [
    { key: "prospecting", label: "Prospecting", icon: "Target", color: "bg-blue-500" },
    { key: "follow_up", label: "Follow-up", icon: "MessageCircle", color: "bg-green-500" },
    { key: "nurturing", label: "Nurturing", icon: "Heart", color: "bg-purple-500" },
    { key: "scheduling", label: "Scheduling", icon: "Calendar", color: "bg-yellow-500" },
    { key: "closing", label: "Closing", icon: "CheckCircle", color: "bg-red-500" }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl bg-white rounded-xl shadow-xl border border-slate-200 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                  <ApperIcon name="Mail" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {showTemplateSelector ? "Select Email Template" : "Compose Email"}
                  </h3>
                  {selectedLead && (
                    <p className="text-sm text-slate-600">
                      To: {selectedLead.name} ({selectedLead.email})
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!showTemplateSelector && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTemplateSelector(true)}
                  >
                    <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-1" />
                    Templates
                  </Button>
                )}
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-[600px]">
            {/* Template Selector */}
            {showTemplateSelector ? (
              <div className="w-full p-6 overflow-y-auto">
                <div className="space-y-6">
                  {categories.map(category => {
                    const categoryTemplates = getTemplatesByCategory(category.key);
                    if (categoryTemplates.length === 0) return null;

                    return (
                      <div key={category.key}>
                        <div className="flex items-center mb-4">
                          <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center text-white mr-3`}>
                            <ApperIcon name={category.icon} className="w-4 h-4" />
                          </div>
                          <h4 className="text-lg font-semibold text-slate-900">{category.label}</h4>
                          <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                            {categoryTemplates.length}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {categoryTemplates.map(template => (
                            <motion.div
                              key={template.Id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleTemplateSelect(template)}
                              className="p-4 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-slate-900">{template.name}</h5>
                                <ApperIcon name="ChevronRight" className="w-4 h-4 text-slate-400" />
                              </div>
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                {template.description}
                              </p>
                              <div className="bg-slate-50 p-2 rounded text-xs text-slate-700">
                                <strong>Subject:</strong> {template.subject}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowTemplateSelector(false)}
                    >
                      <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                      Start from Blank
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Email Composer */}
                <div className="flex-1 flex flex-col">
                  <form onSubmit={handleSendEmail} className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-200 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            To
                          </label>
                          <Input
                            value={emailData.to}
                            onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                            required
                            disabled
                            className="bg-slate-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Subject *
                          </label>
                          <Input
                            value={emailData.subject}
                            onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                            required
                            placeholder="Enter email subject"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        value={emailData.content}
                        onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                        required
                        rows={12}
                        className="w-full h-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Type your message here..."
                      />
                    </div>

                    <div className="p-6 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-500">
                          {selectedTemplate && (
                            <span className="flex items-center">
                              <ApperIcon name="FileText" className="w-4 h-4 mr-1" />
                              Using template: {selectedTemplate.name}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                          >
                            {isLoading ? (
                              <>
                                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                                Send Email
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Variables Panel */}
                <div className="w-80 border-l border-slate-200 bg-slate-50">
                  <div className="p-4 border-b border-slate-200">
                    <h4 className="font-medium text-slate-900 flex items-center">
                      <ApperIcon name="Braces" className="w-4 h-4 mr-2" />
                      Variables
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Click to insert personalization variables
                    </p>
                  </div>
                  <div className="p-4 space-y-2 overflow-y-auto h-full">
                    {availableVariables.map(variable => (
                      <button
                        key={variable.key}
                        type="button"
                        onClick={() => insertVariable(variable)}
                        className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-white transition-colors bg-white"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-900">
                            {variable.label}
                          </span>
                          <ApperIcon name="Plus" className="w-3 h-3 text-slate-400" />
                        </div>
                        <div className="text-xs text-slate-600">
                          <code className="bg-slate-100 px-1 py-0.5 rounded">
                            {`{{${variable.key}}}`}
                          </code>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Example: {variable.example}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailComposerModal;