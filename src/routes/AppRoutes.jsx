import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { Layout } from "../components/layout/Layout";
import { useAuth } from "../hooks/useAuth";

import { Login } from "../pages/auth/Login";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Assets } from "../pages/assets/Assets";
import { Allocations } from "../pages/allocations/Allocations";

import Category from "../pages/category/Category";
import Vendor from "../pages/vendor/Vendor";
import Location from "../pages/location/Location";
import Item from "../pages/item/Item";

import Employees from "../pages/Employee/Employees";
import PurchaseEntry from "../pages/purchase/PurchaseEntry";
import PurchaseList from "../pages/purchase/PurchaseList";
import UnitAllocation from "../pages/unitAllocation/UnitAllocation";

import AddMaintenance from "../pages/maintenance/AddMaintenance";
import { ViewHistory } from "../pages/view-history/ViewHistory";
import LocationSummary from "../pages/report/LocationSummary";
import ReportSummary from "../pages/report/ReportSummary";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Login */}

      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/assets" element={<Assets />} />

          <Route path="/allocations" element={<Allocations />} />

          <Route path="/category" element={<Category />} />
          <Route path="/Employee" element={<Employees />} />
          <Route path="/vendor" element={<Vendor />} />
          <Route path="/item" element={<Item />} />
          <Route path="/unit" element={<UnitAllocation />} />
          <Route path="/report" element={<ReportSummary />} />
          <Route
            path="/reports/location-summary"
            element={<LocationSummary />}
          />

          <Route path="/maintenance" element={<AddMaintenance />} />
          <Route path="/location" element={<Location />} />
          <Route path="/purchase/entry" element={<PurchaseEntry />} />
          <Route path="/purchase/list" element={<PurchaseList />} />

          {/* 🚨 YAHAN CHANGE KIYA HAI :assetId laga kar */}
          <Route
            path="/allocations/view-history/:assetId"
            element={<ViewHistory />}
          />
        </Route>
      </Route>

      {/* Unknown URL */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
