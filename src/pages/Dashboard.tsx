"use client";

import React from "react";

const Dashboard = () => {
  return (
    <div className="p-6 bg-card text-card-foreground rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-primary mb-6">CRM Dashboard</h1>
      <p className="text-lg text-muted-foreground">
        Benvenuto nella tua dashboard CRM. Qui potrai visualizzare una panoramica delle tue attività.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-secondary-foreground mb-3">Total Customers</h2>
          <p className="text-4xl font-bold text-primary">120</p>
        </div>
        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-secondary-foreground mb-3">Open Deals</h2>
          <p className="text-4xl font-bold text-primary">35</p>
        </div>
        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-secondary-foreground mb-3">Revenue This Month</h2>
          <p className="text-4xl font-bold text-primary">$15,000</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;