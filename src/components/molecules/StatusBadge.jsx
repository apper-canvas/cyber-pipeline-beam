import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatusBadge = ({ status, type = "lead" }) => {
const leadStatuses = {
    connected: { 
      label: "Connected", 
      color: "bg-blue-100 text-blue-700 border-blue-200", 
      icon: "Link" 
    },
    locked: { 
      label: "Locked", 
      color: "bg-amber-100 text-amber-700 border-amber-200", 
      icon: "Lock" 
    },
    "meeting-booked": { 
      label: "Meeting Booked", 
      color: "bg-purple-100 text-purple-700 border-purple-200", 
      icon: "Calendar" 
    },
    "meeting-done": { 
      label: "Meeting Done", 
      color: "bg-indigo-100 text-indigo-700 border-indigo-200", 
      icon: "CheckCircle" 
    },
    negotiation: { 
      label: "Negotiation", 
      color: "bg-orange-100 text-orange-700 border-orange-200", 
      icon: "MessageSquare" 
    },
    closed: { 
      label: "Closed", 
      color: "bg-green-100 text-green-700 border-green-200", 
      icon: "CheckCircle2" 
    },
    lost: { 
      label: "Lost", 
      color: "bg-red-100 text-red-700 border-red-200", 
      icon: "XCircle" 
    },
    "launched-appsumo": { 
      label: "Launched on AppSumo", 
      color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
      icon: "Rocket" 
    },
    "launched-prime": { 
      label: "Launched on Prime Club", 
      color: "bg-teal-100 text-teal-700 border-teal-200", 
      icon: "Star" 
    },
    "keep-eye": { 
      label: "Keep an Eye", 
      color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      icon: "Eye" 
    },
    rejected: { 
      label: "Rejected", 
      color: "bg-red-100 text-red-700 border-red-200", 
      icon: "X" 
    },
    unsubscribed: { 
      label: "Unsubscribed", 
      color: "bg-gray-100 text-gray-700 border-gray-200", 
      icon: "UserMinus" 
    },
    outdated: { 
      label: "Outdated", 
      color: "bg-slate-100 text-slate-700 border-slate-200", 
      icon: "Clock" 
    },
    hotlist: { 
      label: "Hotlist", 
      color: "bg-red-100 text-red-700 border-red-200", 
      icon: "Flame" 
    },
    "out-of-league": { 
      label: "Out of League", 
      color: "bg-gray-100 text-gray-700 border-gray-200", 
      icon: "TrendingUp" 
    }
  };

  const dealStatuses = {
    new: { 
      label: "New", 
      color: "bg-slate-100 text-slate-700 border-slate-200", 
      icon: "Plus" 
    },
    qualified: { 
      label: "Qualified", 
      color: "bg-blue-100 text-blue-700 border-blue-200", 
      icon: "Target" 
    },
    proposal: { 
      label: "Proposal", 
      color: "bg-purple-100 text-purple-700 border-purple-200", 
      icon: "FileText" 
    },
    negotiation: { 
      label: "Negotiation", 
      color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      icon: "MessageSquare" 
    },
    closed_won: { 
      label: "Won", 
      color: "bg-green-100 text-green-700 border-green-200", 
      icon: "Trophy" 
    },
    closed_lost: { 
      label: "Lost", 
      color: "bg-red-100 text-red-700 border-red-200", 
      icon: "X" 
    }
  };

const statuses = type === "lead" ? leadStatuses : dealStatuses;
  const statusConfig = statuses[status] || statuses.connected;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
      statusConfig.color
    )}>
      <ApperIcon name={statusConfig.icon} className="w-3 h-3 mr-1" />
      {statusConfig.label}
    </span>
  );
};

export default StatusBadge;