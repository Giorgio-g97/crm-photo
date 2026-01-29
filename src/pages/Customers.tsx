"use client";

import React from "react";

const Customers = () => {
  return (
    <div className="p-6 bg-card text-card-foreground rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-primary mb-6">Customers</h1>
      <p className="text-lg text-muted-foreground">
        Gestisci qui i tuoi clienti.
      </p>
      <div className="mt-8">
        <ul className="space-y-4">
          <li className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground">
            <h3 className="font-semibold text-xl">Alice Smith</h3>
            <p className="text-muted-foreground">alice.smith@example.com</p>
          </li>
          <li className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground">
            <h3 className="font-semibold text-xl">Bob Johnson</h3>
            <p className="text-muted-foreground">bob.johnson@example.com</p>
          </li>
          <li className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground">
            <h3 className="font-semibold text-xl">Charlie Brown</h3>
            <p className="text-muted-foreground">charlie.brown@example.com</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Customers;