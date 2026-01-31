"use client";

import React from "react";

const Projects = () => {
  return (
    <div className="p-4 md:p-6 bg-card text-card-foreground rounded-xl shadow-lg">
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 md:mb-6">Progetti</h1>
      <p className="text-base md:text-lg text-muted-foreground">
        Tieni traccia dei tuoi progetti attivi e completati.
      </p>
      <div className="mt-6 md:mt-8">
        <ul className="space-y-4">
          <li className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground">
            <h3 className="font-semibold text-xl">Progetto Alpha - €10.000</h3>
            <p className="text-muted-foreground">Stato: In Corso</p>
          </li>
          <li className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground">
            <h3 className="font-semibold text-xl">Servizio Beta - €5.000</h3>
            <p className="text-muted-foreground">Stato: Pianificazione</p>
          </li>
          <li className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground">
            <h3 className="font-semibold text-xl">Prodotto Gamma - €2.500</h3>
            <p className="text-muted-foreground">Stato: Completato</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Projects;