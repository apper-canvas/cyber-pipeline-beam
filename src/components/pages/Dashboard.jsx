import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ReactApexChart from "react-apexcharts";
import { leadsService } from "@/services/api/leadsService";
import { dealsService } from "@/services/api/dealsService";
import { activitiesService } from "@/services/api/activitiesService";
import { format, subDays } from "date-fns";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: {},
    recentActivities: [],
    chartData: {
      revenue: [],
      pipeline: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const [leads, deals, activities] = await Promise.all([
        leadsService.getAll(),
        dealsService.getAll(),
        activitiesService.getAll()
      ]);

      // Calculate metrics
      const totalLeads = leads.length;
      const qualifiedLeads = leads.filter(lead => lead.status === "qualified").length;
      const activeDeals = deals.filter(deal => !["closed_won", "closed_lost"].includes(deal.stage)).length;
      const totalRevenue = deals
        .filter(deal => deal.stage === "closed_won")
        .reduce((sum, deal) => sum + deal.value, 0);
      
      const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

      // Generate revenue trend data (last 7 days)
      const revenueData = [];
      const categories = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        categories.push(format(date, "MMM dd"));
        // Simulate revenue growth
        revenueData.push(Math.floor(Math.random() * 50000) + 10000);
      }

      // Pipeline distribution
      const stageData = [
        { stage: "New", count: deals.filter(d => d.stage === "new").length },
        { stage: "Qualified", count: deals.filter(d => d.stage === "qualified").length },
        { stage: "Proposal", count: deals.filter(d => d.stage === "proposal").length },
        { stage: "Negotiation", count: deals.filter(d => d.stage === "negotiation").length }
      ];

      // Recent activities
      const recentActivities = activities
        .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
        .slice(0, 8);

      setDashboardData({
        metrics: {
          totalLeads,
          activeDeals,
          conversionRate,
          totalRevenue
        },
        recentActivities,
        chartData: {
          revenue: {
            series: [{
              name: "Revenue",
              data: revenueData
            }],
            options: {
              chart: {
                type: "area",
                toolbar: { show: false },
                zoom: { enabled: false }
              },
              colors: ["#2563eb"],
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.7,
                  opacityTo: 0.1
                }
              },
              dataLabels: { enabled: false },
              stroke: { curve: "smooth", width: 3 },
              xaxis: {
                categories,
                labels: { style: { colors: "#64748b" } },
                axisBorder: { show: false },
                axisTicks: { show: false }
              },
              yaxis: {
                labels: {
                  style: { colors: "#64748b" },
                  formatter: (value) => `$${(value/1000).toFixed(0)}K`
                }
              },
              grid: {
                borderColor: "#f1f5f9",
                strokeDashArray: 4
              },
              tooltip: {
                y: {
                  formatter: (value) => `$${value.toLocaleString()}`
                }
              }
            }
          },
          pipeline: {
            series: stageData.map(item => item.count),
            options: {
              chart: {
                type: "donut"
              },
              colors: ["#64748b", "#2563eb", "#7c3aed", "#f59e0b"],
              labels: stageData.map(item => item.stage),
              legend: {
                position: "bottom",
                fontSize: "14px"
              },
              plotOptions: {
                pie: {
                  donut: {
                    size: "70%"
                  }
                }
              },
              dataLabels: {
                enabled: true,
                formatter: (val, opts) => {
                  return opts.w.config.series[opts.seriesIndex];
                }
              }
            }
          }
        }
      });

    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (isLoading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const { metrics, recentActivities, chartData } = dashboardData;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Sales Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor your pipeline performance and track key metrics
          </p>
        </div>

        {/* Metrics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard
            title="Total Leads"
            value={metrics.totalLeads}
            change="+12%"
            changeType="positive"
            icon="Users"
            color="primary"
          />
          <MetricCard
            title="Active Deals"
            value={metrics.activeDeals}
            change="+8%"
            changeType="positive"
            icon="TrendingUp"
            color="accent"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            change="+3%"
            changeType="positive"
            icon="Target"
            color="success"
          />
          <MetricCard
            title="Total Revenue"
            value={`$${(metrics.totalRevenue/1000).toFixed(0)}K`}
            change="+25%"
            changeType="positive"
            icon="DollarSign"
            color="success"
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Revenue Trend</h3>
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <ApperIcon name="TrendingUp" className="w-3 h-3 mr-1" />
                +15.2%
              </div>
            </div>
            <ReactApexChart
              options={chartData.revenue.options}
              series={chartData.revenue.series}
              type="area"
              height={300}
            />
          </motion.div>

          {/* Pipeline Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Pipeline Distribution</h3>
              <div className="text-sm text-slate-600">
                {chartData.pipeline.series.reduce((a, b) => a + b, 0)} total deals
              </div>
            </div>
            <ReactApexChart
              options={chartData.pipeline.options}
              series={chartData.pipeline.series}
              type="donut"
              height={300}
            />
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200"
        >
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent Activities</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "call" ? "bg-blue-100" :
                    activity.type === "email" ? "bg-purple-100" :
                    activity.type === "meeting" ? "bg-green-100" :
                    activity.type === "task" ? "bg-yellow-100" :
                    "bg-slate-100"
                  }`}>
                    <ApperIcon 
                      name={
                        activity.type === "call" ? "Phone" :
                        activity.type === "email" ? "Mail" :
                        activity.type === "meeting" ? "Calendar" :
                        activity.type === "task" ? "CheckSquare" :
                        "FileText"
                      }
                      className={`w-5 h-5 ${
                        activity.type === "call" ? "text-blue-600" :
                        activity.type === "email" ? "text-purple-600" :
                        activity.type === "meeting" ? "text-green-600" :
                        activity.type === "task" ? "text-yellow-600" :
                        "text-slate-600"
                      }`}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.subject}
                      </p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(activity.scheduledAt), "MMM dd, HH:mm")}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-xs text-slate-500">
                        by {activity.createdBy}
                      </span>
                      {activity.completedAt && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;