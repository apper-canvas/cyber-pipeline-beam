import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { leadsService } from "@/services/api/leadsService";
import { dealsService } from "@/services/api/dealsService";

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ leads: [], deals: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ leads: [], deals: [] });
      return;
    }

    const searchData = async () => {
      setIsLoading(true);
      try {
        const [leads, deals] = await Promise.all([
          leadsService.getAll(),
          dealsService.getAll()
        ]);

        const filteredLeads = leads.filter(lead =>
          lead.name.toLowerCase().includes(query.toLowerCase()) ||
          lead.company.toLowerCase().includes(query.toLowerCase()) ||
          lead.email.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        const filteredDeals = deals.filter(deal =>
          deal.title.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        setResults({ leads: filteredLeads, deals: filteredDeals });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Search Input */}
          <div className="p-6 border-b border-slate-100">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search leads, deals, companies..."
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-3.5 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="p-8 text-center">
                <ApperIcon name="Loader2" className="w-6 h-6 text-primary-600 animate-spin mx-auto" />
                <p className="mt-2 text-slate-600">Searching...</p>
              </div>
            )}

            {!isLoading && query.length >= 2 && results.leads.length === 0 && results.deals.length === 0 && (
              <div className="p-8 text-center">
                <ApperIcon name="Search" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No results found</h3>
                <p className="text-slate-600">Try searching for something else</p>
              </div>
            )}

            {/* Leads Results */}
            {results.leads.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Leads</h3>
                <div className="space-y-2">
                  {results.leads.map((lead) => (
                    <div
                      key={lead.Id}
                      className="flex items-center p-3 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {lead.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                        <p className="text-xs text-slate-600">{lead.company} • {lead.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          lead.status === "qualified" ? "bg-green-100 text-green-700" :
                          lead.status === "contacted" ? "bg-blue-100 text-blue-700" :
                          lead.status === "new" ? "bg-gray-100 text-gray-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {lead.status}
                        </span>
                        <ApperIcon name="ChevronRight" className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deals Results */}
            {results.deals.length > 0 && (
              <div className="p-4 border-t border-slate-100">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Deals</h3>
                <div className="space-y-2">
                  {results.deals.map((deal) => (
                    <div
                      key={deal.Id}
                      className="flex items-center p-3 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                        <ApperIcon name="TrendingUp" className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-slate-900">{deal.title}</p>
                        <p className="text-xs text-slate-600">{deal.stage} • ${deal.value.toLocaleString()}</p>
                      </div>
                      <ApperIcon name="ChevronRight" className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchBar;