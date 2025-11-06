import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { emailTemplateService } from "@/services/api/emailTemplateService";
import { toast } from "react-toastify";

const EmailTemplateModal = ({ isOpen, onClose, template = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "prospecting",
    subject: "",
    content: "",
    description: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [availableVariables] = useState(emailTemplateService.getAvailableVariables());

  const categories = [
    { key: "prospecting", label: "Prospecting" },
    { key: "follow_up", label: "Follow-up" },
    { key: "nurturing", label: "Nurturing" },
    { key: "scheduling", label: "Scheduling" },
    { key: "closing", label: "Closing" }
  ];

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        category: template.category,
        subject: template.subject,
        content: template.content,
        description: template.description
      });
    } else {
      setFormData({
        name: "",
        category: "prospecting",
        subject: "",
        content: "",
        description: ""
      });
    }
  }, [template, isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let savedTemplate;
      if (template) {
        savedTemplate = await emailTemplateService.update(template.Id, formData);
        toast.success("Template updated successfully!");
      } else {
        savedTemplate = await emailTemplateService.create(formData);
        toast.success("Template created successfully!");
      }

      if (onSave) {
        onSave(savedTemplate);
      }
      
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save template");
    } finally {
      setIsLoading(false);
    }
  };

  const insertVariable = (field, variable) => {
    const placeholder = `{{${variable.key}}}`;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] + placeholder
    }));
  };

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
          className="w-full max-w-4xl bg-white rounded-xl shadow-xl border border-slate-200 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  <ApperIcon name="FileText" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {template ? "Edit Email Template" : "Create Email Template"}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {template ? "Update your existing template" : "Create a new reusable email template"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex h-[600px]">
            {/* Form */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Template Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Enter template name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category.key} value={category.key}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of when to use this template"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Subject Line *
                    </label>
                    <div className="flex space-x-1">
                      {availableVariables.slice(0, 3).map(variable => (
                        <button
                          key={variable.key}
                          type="button"
                          onClick={() => insertVariable('subject', variable)}
                          className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                        >
                          {variable.key}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    required
                    placeholder="Enter email subject line"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Email Content *
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {availableVariables.slice(0, 4).map(variable => (
                        <button
                          key={variable.key}
                          type="button"
                          onClick={() => insertVariable('content', variable)}
                          className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                        >
                          {variable.key}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    rows={12}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Enter your email template content..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
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
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    {isLoading ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                        {template ? "Update Template" : "Create Template"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Variables Panel */}
            <div className="w-80 border-l border-slate-200 bg-slate-50">
              <div className="p-4 border-b border-slate-200">
                <h4 className="font-medium text-slate-900 flex items-center">
                  <ApperIcon name="Braces" className="w-4 h-4 mr-2" />
                  Available Variables
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Click to insert into subject or content
                </p>
              </div>
              <div className="p-4 space-y-2 overflow-y-auto h-full">
                {availableVariables.map(variable => (
                  <div
                    key={variable.key}
                    className="p-3 rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {variable.label}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => insertVariable('subject', variable)}
                          className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          title="Insert in subject"
                        >
                          S
                        </button>
                        <button
                          type="button"
                          onClick={() => insertVariable('content', variable)}
                          className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          title="Insert in content"
                        >
                          C
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600">
                      <code className="bg-slate-100 px-1 py-0.5 rounded">
                        {`{{${variable.key}}}`}
                      </code>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {variable.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailTemplateModal;