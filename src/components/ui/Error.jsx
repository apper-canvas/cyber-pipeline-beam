import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  title = "Oops!",
  description = "We encountered an error while loading your data. Please try again."
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[400px] flex items-center justify-center"
    >
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto"
        >
          <ApperIcon name="AlertCircle" className="w-10 h-10 text-red-600" />
        </motion.div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{description}</p>
          {message !== "Something went wrong" && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 font-medium">{message}</p>
            </div>
          )}
        </div>

        {onRetry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button onClick={onRetry} className="bg-primary-600 hover:bg-primary-700">
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </motion.div>
        )}
        
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            If this problem persists, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Error;