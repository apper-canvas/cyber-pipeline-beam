import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealsService } from "@/services/api/dealsService";
import { leadsService } from "@/services/api/leadsService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [newDeal, setNewDeal] = useState({
    title: "",
    leadId: "",
    stage: "new",
    value: "",
    probability: 25,
    expectedCloseDate: "",
    assignedTo: "Current User",
    notes: ""
  });

  const stages = [
    { id: "new", name: "New", color: "bg-slate-100 text-slate-700", count: 0 },
    { id: "qualified", name: "Qualified", color: "bg-blue-100 text-blue-700", count: 0 },
    { id: "proposal", name: "Proposal", color: "bg-purple-100 text-purple-700", count: 0 },
    { id: "negotiation", name: "Negotiation", color: "bg-yellow-100 text-yellow-700", count: 0 },
    { id: "closed_won", name: "Won", color: "bg-green-100 text-green-700", count: 0 },
    { id: "closed_lost", name: "Lost", color: "bg-red-100 text-red-700", count: 0 }
  ];

  const loadDeals = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const [dealsData, leadsData] = await Promise.all([
        dealsService.getAll(),
        leadsService.getAll()
      ]);
      setDeals(dealsData);
      setLeads(leadsData);
    } catch (err) {
      setError(err.message || "Failed to load deals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleAddDeal = async (e) => {
    e.preventDefault();
    
    try {
      const dealData = {
        ...newDeal,
        value: parseFloat(newDeal.value) || 0,
        probability: parseInt(newDeal.probability) || 25
      };
      
      const createdDeal = await dealsService.create(dealData);
      setDeals(prev => [createdDeal, ...prev]);
      setShowAddModal(false);
      setNewDeal({
        title: "",
        leadId: "",
        stage: "new",
        value: "",
        probability: 25,
        expectedCloseDate: "",
        assignedTo: "Current User",
        notes: ""
      });
      toast.success("Deal added successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to add deal");
    }
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    
    if (!draggedDeal || draggedDeal.stage === newStage) {
      setDraggedDeal(null);
      return;
    }

    try {
      const updatedDeal = await dealsService.update(draggedDeal.Id, { 
        stage: newStage,
        probability: newStage === "closed_won" ? 100 : newStage === "closed_lost" ? 0 : draggedDeal.probability
      });
      
      setDeals(prev => prev.map(deal => 
        deal.Id === draggedDeal.Id ? updatedDeal : deal
      ));
      
      toast.success(`Deal moved to ${stages.find(s => s.id === newStage)?.name}`);
    } catch (err) {
      toast.error(err.message || "Failed to update deal stage");
    } finally {
      setDraggedDeal(null);
    }
  };

  const getLeadName = (leadId) => {
    const lead = leads.find(l => l.Id === parseInt(leadId));
    return lead ? lead.name : "Unknown Lead";
  };

  const getLeadCompany = (leadId) => {
    const lead = leads.find(l => l.Id === parseInt(leadId));
    return lead ? lead.company : "Unknown Company";
  };

  const getStageDeals = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getTotalValue = (stageId) => {
    return getStageDeals(stageId).reduce((sum, deal) => sum + deal.value, 0);
  };

  if (isLoading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadDeals} />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Deal Pipeline
            </h1>
            <p className="text-slate-600 mt-2">
              Track deals through your sales stages
            </p>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add New Deal
          </Button>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {stages.map(stage => (
            <div key={stage.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{getStageDeals(stage.id).length}</p>
                <p className="text-xs text-slate-600 font-medium uppercase tracking-wide mb-2">{stage.name}</p>
                <p className="text-sm font-medium text-slate-700">
                  ${getTotalValue(stage.id).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        {deals.length === 0 ? (
          <Empty
            title="No deals found"
            description="Start building your pipeline by adding your first deal."
            icon="TrendingUp"
            actionLabel="Add First Deal"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-6 min-h-[600px]">
            {stages.map((stage) => (
              <motion.div
                key={stage.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">{stage.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                    {getStageDeals(stage.id).length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {getStageDeals(stage.id).map((deal, index) => (
                    <motion.div
                      key={deal.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      className="bg-slate-50 rounded-lg p-4 cursor-move hover:shadow-md transition-all duration-200 border border-slate-100 hover:border-slate-200"
                      onClick={() => setSelectedDeal(deal)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                          {getLeadCompany(deal.leadId).charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-500">
                          {deal.probability}%
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-slate-900 text-sm mb-1 line-clamp-2">
                        {deal.title}
                      </h4>
                      
                      <p className="text-xs text-slate-600 mb-2">
                        {getLeadName(deal.leadId)} • {getLeadCompany(deal.leadId)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-accent-600">
                          ${(deal.value / 1000).toFixed(0)}K
                        </span>
                        {deal.expectedCloseDate && (
                          <span className="text-xs text-slate-500">
                            {format(new Date(deal.expectedCloseDate), "MMM dd")}
                          </span>
                        )}
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                        <div
                          className="bg-gradient-to-r from-accent-500 to-accent-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${deal.probability}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Deal Modal */}
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
                  <h3 className="text-lg font-semibold text-slate-900">Add New Deal</h3>
                </div>
                
                <form onSubmit={handleAddDeal} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Deal Title *
                      </label>
                      <Input
                        value={newDeal.title}
                        onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                        required
                        placeholder="Enter deal title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Associated Lead *
                      </label>
                      <select
                        value={newDeal.leadId}
                        onChange={(e) => setNewDeal({ ...newDeal, leadId: e.target.value })}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select a lead</option>
                        {leads.map(lead => (
                          <option key={lead.Id} value={lead.Id}>
                            {lead.name} - {lead.company}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Deal Value *
                      </label>
                      <Input
                        type="number"
                        value={newDeal.value}
                        onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                        required
                        placeholder="Enter deal value"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Probability (%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={newDeal.probability}
                        onChange={(e) => setNewDeal({ ...newDeal, probability: e.target.value })}
                        placeholder="Enter probability"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Expected Close Date
                      </label>
                      <Input
                        type="date"
                        value={newDeal.expectedCloseDate}
                        onChange={(e) => setNewDeal({ ...newDeal, expectedCloseDate: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Assigned To
                      </label>
                      <Input
                        value={newDeal.assignedTo}
                        onChange={(e) => setNewDeal({ ...newDeal, assignedTo: e.target.value })}
                        placeholder="Assign to team member"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={newDeal.notes}
                      onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
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
                      Add Deal
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Deal Detail Modal */}
        <AnimatePresence>
          {selectedDeal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedDeal(null)}
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
                      <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white font-medium">
                        <ApperIcon name="TrendingUp" className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{selectedDeal.title}</h3>
                        <p className="text-slate-600">
                          {getLeadName(selectedDeal.leadId)} • {getLeadCompany(selectedDeal.leadId)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDeal(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <ApperIcon name="X" className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Deal Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Stage:</span>
                          <StatusBadge status={selectedDeal.stage} type="deal" />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Value:</span>
                          <span className="text-sm font-medium">${selectedDeal.value?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Probability:</span>
                          <span className="text-sm font-medium">{selectedDeal.probability}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Expected Close:</span>
                          <span className="text-sm font-medium">
                            {selectedDeal.expectedCloseDate 
                              ? format(new Date(selectedDeal.expectedCloseDate), "MMM dd, yyyy")
                              : "Not set"
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Assignment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Assigned to:</span>
                          <span className="text-sm font-medium">{selectedDeal.assignedTo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Created:</span>
                          <span className="text-sm font-medium">
                            {format(new Date(selectedDeal.createdAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Last Updated:</span>
                          <span className="text-sm font-medium">
                            {format(new Date(selectedDeal.updatedAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedDeal.notes && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Notes</h4>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600">{selectedDeal.notes}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3 pt-4 border-t border-slate-200">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                      Call Contact
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                      Schedule Meeting
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

export default Deals;