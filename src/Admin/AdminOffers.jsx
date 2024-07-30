import React, { useState } from "react";
import "./AdminOrders.css";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";

const AdminOffers = () => {
  return (
    <div className="dashboard-main">
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">dashboard-right</div>
      </div>
    </div>
  );
};

export default AdminOffers;
