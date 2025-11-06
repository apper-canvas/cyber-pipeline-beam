import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon, 
  color = "primary",
  onClick 
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    accent: "from-accent-500 to-accent-600", 
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    error: "from-red-500 to-red-600"
  };

  const changeColors = {
    positive: "text-green-600 bg-green-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-slate-600 bg-slate-50"
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-lg ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-sm`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${changeColors[changeType]}`}>
            <ApperIcon 
              name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
              className="w-3 h-3 inline mr-1" 
            />
            {change}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-600 font-medium">{title}</p>
      </div>
    </motion.div>
  );
};

export default MetricCard;