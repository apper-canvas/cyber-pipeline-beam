import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import EmailComposerModal from "@/components/molecules/EmailComposerModal";
import EmailTemplateModal from "@/components/molecules/EmailTemplateModal";
import { leadsService } from "@/services/api/leadsService";
import { format } from "date-fns";
import { toast } from "react-toastify";
const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [emailLead, setEmailLead] = useState(null);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    source: "Website",
    status: "new",
    value: "",
    assignedTo: "Current User",
    notes: ""
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "unqualified", label: "Unqualified" }
  ];

  const sourceOptions = [
    { value: "all", label: "All Sources" },
    { value: "Website", label: "Website" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "Referral", label: "Referral" },
    { value: "Trade Show", label: "Trade Show" },
    { value: "Google Ads", label: "Google Ads" },
    { value: "Email Campaign", label: "Email Campaign" }
  ];

  const loadLeads = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const data = await leadsService.getAll();
      setLeads(data);
      setFilteredLeads(data);
    } catch (err) {
      setError(err.message || "Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    let filtered = leads;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Apply source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const handleAddLead = async (e) => {
    e.preventDefault();
    
    try {
      const leadData = {
        ...newLead,
        value: parseFloat(newLead.value) || 0
      };
      
      const createdLead = await leadsService.create(leadData);
      setLeads(prev => [createdLead, ...prev]);
      setShowAddModal(false);
      setNewLead({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        source: "Website",
        status: "new",
        value: "",
        assignedTo: "Current User",
        notes: ""
      });
      toast.success("Lead added successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to add lead");
    }
  };

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      const updatedLead = await leadsService.update(leadId, { 
        status: newStatus,
        lastContactedAt: newStatus !== "new" ? new Date().toISOString() : null
      });
      
      setLeads(prev => prev.map(lead => 
        lead.Id === leadId ? updatedLead : lead
      ));
      
      toast.success("Lead status updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update lead status");
    }
  };

  if (isLoading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Leads Management
            </h1>
            <p className="text-slate-600 mt-2">
              Track and manage your sales leads
            </p>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add New Lead
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Source</label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sourceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSourceFilter("all");
                }}
                className="w-full"
              >
                <ApperIcon name="X" className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        {filteredLeads.length === 0 ? (
          <Empty
            title="No leads found"
            description="Get started by adding your first lead or adjust your filters."
            icon="Users"
            actionLabel="Add First Lead"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Last Contact
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {lead.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                            <p className="text-sm text-slate-600">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{lead.company}</p>
                          <p className="text-sm text-slate-600">{lead.position}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(lead.Id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm border-0 bg-transparent focus:ring-0 focus:outline-none cursor-pointer"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="unqualified">Unqualified</option>
                        </select>
                        <StatusBadge status={lead.status} type="lead" />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">
                          ${lead.value?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {lead.lastContactedAt 
                            ? format(new Date(lead.lastContactedAt), "MMM dd, yyyy")
                            : "Never"
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle call action
                              toast.success("Call initiated");
                            }}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Phone" className="w-4 h-4" />
                          </button>
                          <button
onClick={(e) => {
                              e.stopPropagation();
                              setEmailLead(lead);
                              setShowEmailComposer(true);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Mail" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Lead Modal */}
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
                  <h3 className="text-lg font-semibold text-slate-900">Add New Lead</h3>
                </div>
                
                <form onSubmit={handleAddLead} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        value={newLead.name}
                        onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                        required
                        placeholder="Enter full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={newLead.email}
                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                        required
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone
                      </label>
                      <Input
                        value={newLead.phone}
                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company *
                      </label>
                      <Input
                        value={newLead.company}
                        onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                        required
                        placeholder="Enter company name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Position
                      </label>
                      <Input
                        value={newLead.position}
                        onChange={(e) => setNewLead({ ...newLead, position: e.target.value })}
                        placeholder="Enter job title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Source
                      </label>
                      <select
                        value={newLead.source}
                        onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="Website">Website</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Referral">Referral</option>
                        <option value="Trade Show">Trade Show</option>
                        <option value="Google Ads">Google Ads</option>
                        <option value="Email Campaign">Email Campaign</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Estimated Value
                      </label>
                      <Input
                        type="number"
                        value={newLead.value}
                        onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                        placeholder="Enter estimated deal value"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Assigned To
                      </label>
                      <Input
                        value={newLead.assignedTo}
                        onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
                        placeholder="Assign to team member"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={newLead.notes}
                      onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Add any additional notes..."
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
                      Add Lead
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
{/* Email Composer Modal */}
        <EmailComposerModal
          isOpen={showEmailComposer}
          onClose={() => {
            setShowEmailComposer(false);
            setEmailLead(null);
          }}
          selectedLead={emailLead}
        />

        {/* Email Template Modal */}
        <EmailTemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
        />

        {/* Lead Detail Modal */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLead(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                        {selectedLead.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{selectedLead.name}</h3>
                        <p className="text-slate-600">{selectedLead.position} at {selectedLead.company}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <ApperIcon name="X" className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <ApperIcon name="Mail" className="w-4 h-4 text-slate-400 mr-3" />
                          <span className="text-sm text-slate-600">{selectedLead.email}</span>
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Phone" className="w-4 h-4 text-slate-400 mr-3" />
                          <span className="text-sm text-slate-600">{selectedLead.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Lead Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Status:</span>
                          <StatusBadge status={selectedLead.status} type="lead" />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Source:</span>
                          <span className="text-sm font-medium">{selectedLead.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Value:</span>
                          <span className="text-sm font-medium">${selectedLead.value?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Assigned to:</span>
                          <span className="text-sm font-medium">{selectedLead.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedLead.notes && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Notes</h4>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600">{selectedLead.notes}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3 pt-4 border-t border-slate-200">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                      Call Lead
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <ApperIcon name="TrendingUp" className="w-4 h-4 mr-2" />
                      Create Deal
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

export default Leads;