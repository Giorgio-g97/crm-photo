"use client";

import React from "react";

const Deals = () => {
  return (
    <div className="p-6 bg-card text-card-foreground rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-primary mb-6">Deals</h1>
      <p className="text-lg text-muted-foreground">
        Tieni traccia delle tue trattative.
      </p>
      <div className="mt-8">
        <ul className="space-y-4">
          <li className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground">
            <h3 className="font-semibold text-xl">Project Alpha - $10,000</h3>
            <p className="text-muted-foreground">Status: Proposal Sent</p>
          </li>
          <li className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground">
            <h3 className="font-semibold text-xl">Service Beta - $5,000</h3>
            <p className="text-muted-foreground">Status: Negotiation</p>
          </li>
          <li className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground">
            <h3 className="font-semibold text-xl">Product Gamma - $2,500</h3>
            <p className="text-muted-foreground">Status: Closed Won</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Deals;