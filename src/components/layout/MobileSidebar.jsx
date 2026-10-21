import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Box, Share2, Receipt, LogOut, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const MobileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const links = [
    { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { name: "Asset Inventory", to: "/assets", icon: Box },
    { name: "Asset Allocation", to: "/allocations", icon: Share2 },
    { name: "Bills & Invoices", to: "/bills", icon: Receipt },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white">
              A
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              Unios AMS
            </span>
          </div>
          {/* <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button> */}
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-6">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sky-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </div>
  );
};
