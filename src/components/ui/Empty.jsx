import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item.",
  icon = "Inbox",
  actionLabel = "Add New",
  onAction,
  illustration
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[400px] flex items-center justify-center"
    >
      <div className="text-center space-y-6 max-w-lg mx-auto p-6">
        {illustration || (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto"
          >
            <ApperIcon name={icon} className="w-12 h-12 text-slate-400" />
          </motion.div>
        )}
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">{description}</p>
        </div>

        {onAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              onClick={onAction}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              {actionLabel}
            </Button>
          </motion.div>
        )}

        <div className="flex items-center justify-center space-x-8 pt-6 opacity-60">
          <div className="text-center">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Users" className="w-4 h-4 text-primary-600" />
            </div>
            <p className="text-xs text-slate-500">Manage Leads</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="TrendingUp" className="w-4 h-4 text-accent-600" />
            </div>
            <p className="text-xs text-slate-500">Track Deals</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Calendar" className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-slate-500">Schedule Events</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;