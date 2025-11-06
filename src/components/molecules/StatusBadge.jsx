import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatusBadge = ({ status, type = "lead" }) => {
  const leadStatuses = {
    new: { 
      label: "New", 
      color: "bg-slate-100 text-slate-700 border-slate-200", 
      icon: "UserPlus" 
    },
    contacted: { 
      label: "Contacted", 
      color: "bg-blue-100 text-blue-700 border-blue-200", 
      icon: "Phone" 
    },
    qualified: { 
      label: "Qualified", 
      color: "bg-green-100 text-green-700 border-green-200", 
      icon: "CheckCircle" 
    },
    unqualified: { 
      label: "Unqualified", 
      color: "bg-red-100 text-red-700 border-red-200", 
      icon: "XCircle" 
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
  const statusConfig = statuses[status] || statuses.new;

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