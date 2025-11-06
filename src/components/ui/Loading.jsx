import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading...", type = "default" }) => {
  if (type === "skeleton") {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded animate-pulse w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-32"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-50 last:border-b-0">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="flex-1 grid grid-cols-4 gap-4">
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-16"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded animate-pulse w-24 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded animate-pulse w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin mx-auto"></div>
          <div className="w-12 h-12 border-4 border-transparent border-t-primary-600 rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-slate-900">{message}</h3>
          <p className="text-sm text-slate-600">Please wait while we load your data</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;