import React, { useState } from "react";
import { BRAND_NAME } from "../../utils/constants";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Share2,
  Receipt,
  LogOut,
  ListSortDescending,
  IdCardLanyard,
  ToolCase,
  ShelvingUnit,
  MapPinned,
  ShoppingCart,
  ShoppingBag,
  Summary,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  const links = [
    {
      name: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Category",
      to: "/category",
      icon: ListSortDescending,
    },
    {
      name: "Vendor Creation",
      to: "/Vendor",
      icon: ShelvingUnit,
    },
    {
      name: "Location",
      to: "/Location",
      icon: MapPinned,
    },
    {
      name: "Item Creation",
      to: "/Item",
      icon: ShoppingCart,
    },
    {
      name: "Purchase Transaction",
      icon: ShoppingBag,
      children: [
        {
          name: "Purchase Bills Entry",
          to: "/purchase/entry",
        },
        {
          name: "Purchase List",
          to: "/purchase/list",
        },
      ],
    },

    {
      name: "Asset Inventory",
      to: "/assets",
      icon: Box,
    },
    {
      name: "Asset Allocation",
      to: "/allocations",
      icon: Share2,
    },
    {
      name: "Unit Allocation",
      to: "/unit",
      icon: Receipt,
    },
    // {
    //   name: "Report",
    //   icon: Summary,
    //   children: [
    //     {
    //       name: "Report Summary",
    //       path: "/report",
    //     },
    //     {
    //       name: "Location Summary",
    //       path: "/report/location-summary",
    //     },
    //   ],
    // },

    {
      name: "Report",
      icon: Summary,
      children: [
        {
          name: "Report Summary",
          to: "/report",
        },
        {
          name: "Location Summary",
          to: "/reports/location-summary",
        },
      ],
    },

    {
      name: "Maintenance",
      to: "/maintenance",
      icon: ToolCase,
    },
  ];

  return (
    <aside
      className="
  hidden lg:flex
  flex-col
  fixed top-0 left-0
  w-56
  h-screen
  overflow-y-auto
  bg-slate-900
  border-r border-slate-800
  text-white
  shrink-0
  z-50
"
    >
      {/* ================= HEADER ================= */}
      <div
        className="
    flex
    h-14
    shrink-0
    items-center
    px-5
    pt-2
    border-b border-slate-800
    gap-2.5
  "
      >
        {/* Logo */}
        <div
          className="
  w-9 h-9
  rounded-lg
  bg-sky-500
  flex items-center justify-center
  font-bold
  text-sm
  text-white
  shadow-md
  shadow-sky-500/20
  shrink-0
"
        >
          A
        </div>

        {/* Company Name */}
        <div className="min-w-0">
          <h1
            className="
              text-xs
              font-bold
              tracking-wide
              uppercase
              text-white
            "
          >
            {BRAND_NAME}
          </h1>

          <p
            className="
              text-[9px]
              text-slate-400
              font-medium
            "
          >
            Enterprise AMS
          </p>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 space-y-1 px-2.5 py-5">
        {links.map((link) => {
          const Icon = link.icon;

          // Agar Purchase transaction dropdown item hai
          if (link.children) {
            return (
              <div key={link.name} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setPurchaseOpen(!purchaseOpen)}
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    gap-2.5
                    rounded-lg
                    px-2.5
                    py-2.5
                    text-xs
                    font-medium
                    transition-colors
                    text-slate-400
                    hover:bg-slate-800
                    hover:text-slate-200
                  "
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{link.name}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      purchaseOpen ? "rotate-180 text-sky-400" : ""
                    }`}
                  />
                </button>

                {/* Dropdown ke links */}
                {purchaseOpen && (
                  <div className="pl-6 space-y-1">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          `
                          flex
                          items-center
                          rounded-lg
                          px-2.5
                          py-2
                          text-[11px]
                          font-medium
                          transition-colors
                          ${
                            isActive
                              ? "bg-sky-600 text-white shadow-sm"
                              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                          }
                          `
                        }
                      >
                        <span className="truncate">{child.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Baaki regular single links
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-2.5
                rounded-lg
                px-2.5
                py-2.5
                text-xs
                font-medium
                transition-colors
                ${
                  isActive
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }
                `
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* ================= USER SECTION ================= */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2.5 px-2 mb-3">
          <div
            className="
              w-9 h-9
              rounded-full
              bg-slate-700
              flex items-center justify-center
              font-semibold
              text-sm
              text-slate-200
              shrink-0
            "
          >
            {user?.name ? user.name[0] : "U"}
          </div>

          <div className="overflow-hidden min-w-0">
            <p
              className="
                text-[11px]
                font-semibold
                text-white
                truncate
              "
            >
              {user?.name || "Admin"}
            </p>

            <p
              className="
                text-[10px]
                text-slate-400
                truncate
              "
            >
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="
            flex
            w-full
            items-center
            gap-2
            rounded-lg
            px-2.5
            py-2
            text-xs
            font-medium
            text-rose-400
            hover:bg-rose-500/10
            hover:text-rose-300
            transition-colors
          "
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
