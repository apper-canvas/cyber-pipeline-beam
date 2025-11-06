import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-lg mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="relative">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              404
            </h1>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-primary-200 rounded-full border-t-primary-600"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
            <p className="text-slate-600 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off. 
              Don't worry, it happens to the best of us.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            >
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="pt-8 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-4">Quick navigation:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => navigate("/leads")}
                className="inline-flex items-center px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                <ApperIcon name="Users" className="w-3 h-3 mr-1" />
                Leads
              </button>
              <button
                onClick={() => navigate("/deals")}
                className="inline-flex items-center px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                <ApperIcon name="TrendingUp" className="w-3 h-3 mr-1" />
                Deals
              </button>
              <button
                onClick={() => navigate("/calendar")}
                className="inline-flex items-center px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                Calendar
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center space-x-8 pt-8 opacity-60"
        >
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
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;