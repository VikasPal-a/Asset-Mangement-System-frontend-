import React from "react";
import {
  Box,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  ListSortDescending,
  MapPin,
  Package,
  Store,
  IndianRupee,
} from "lucide-react";
import { StatCard } from "./StatCard";

export const DashboardStats = ({ stats, metrics, formatCurrency }) => {
  const cards = [
    // ROW 1
    {
      title: "TOTAL ASSETS",
      count: stats.total,
      icon: Box,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      title: "INSTOCK ASSETS",
      count: stats.InStock,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "ASSIGNED ASSETS",
      count: stats.assigned,
      icon: UserCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },

    // ROW 2
    {
      title: "UNDER MAINTENANCE",
      count: stats.maintenance,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "CATEGORIES",
      count: stats.categories,
      icon: ListSortDescending,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "ACTIVE LOCATIONS",
      count: stats.locations,
      icon: MapPin,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },

    // ROW 3 (Same Style & Text Size)
    {
      title: "ACTIVE ASSETS",
      count: Number(metrics.TotalActiveAssets || 0).toLocaleString("en-IN"),
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "TOTAL VENDORS",
      count: Number(metrics.TotalVendors || 0).toLocaleString("en-IN"),
      icon: Store,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "TOTAL EXPENDITURE",
      count: formatCurrency(metrics.TotalExpenditure),
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default DashboardStats;
