import { NavLink } from "react-router-dom";
import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Leads", path: "/leads", icon: "Users" },
    { name: "Deals", path: "/deals", icon: "TrendingUp" },
    { name: "Calendar", path: "/calendar", icon: "Calendar" }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-2">
                <ApperIcon name="Zap" className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Pipeline Pro
                </h1>
              </div>
            </div>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                        : "text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <ApperIcon name="Search" className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative">
                <ApperIcon name="Bell" className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-slate-200 bg-white/90 backdrop-blur-sm">
          <nav className="flex justify-around py-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "text-primary-600"
                      : "text-slate-600"
                  }`
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mb-1" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <SearchBar onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
};

export default Header;