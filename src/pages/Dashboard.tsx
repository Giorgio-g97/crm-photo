"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClients, getQuotes } from "@/utils/localStorage"; // Importa le funzioni per ottenere i dati

const Dashboard = () => {
  const [totalClients, setTotalClients] = useState(0);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [estimatedRevenue, setEstimatedRevenue] = useState(0);

  useEffect(() => {
    // Carica i dati dal localStorage
    const clients = getClients();
    const quotes = getQuotes();

    setTotalClients(clients.length);
    setTotalQuotes(quotes.length);

    // Calcola il ricavo totale stimato dai preventivi
    const revenue = quotes.reduce((sum, quote) => sum + quote.total, 0);
    setEstimatedRevenue(revenue);
  }, []); // L'array vuoto assicura che l'effetto venga eseguito solo una volta al mount

  return (
    <div className="p-4 md:p-6 bg-card text-card-foreground rounded-xl shadow-lg">
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 md:mb-6">Dashboard CRM</h1>
      <p className="text-base md:text-lg text-muted-foreground">
        Benvenuto nella tua dashboard CRM. Qui potrai visualizzare una panoramica delle tue attività.
      </p>
      <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        <Link to="/customers" className="block">
          <div className="bg-secondary p-5 md:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <h2 className="text-xl md:text-2xl font-semibold text-secondary-foreground mb-2 md:mb-3">Clienti Totali</h2>
            <p className="text-3xl md:text-4xl font-bold text-primary">{totalClients}</p>
          </div>
        </Link>

        <Link to="/quotes" className="block">
          <div className="bg-secondary p-5 md:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <h2 className="text-xl md:text-2xl font-semibold text-secondary-foreground mb-2 md:mb-3">Preventivi Totali</h2>
            <p className="text-3xl md:text-4xl font-bold text-primary">{totalQuotes}</p>
          </div>
        </Link>

        <Link to="/quotes" className="block">
          <div className="bg-secondary p-5 md:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <h2 className="text-xl md:text-2xl font-semibold text-secondary-foreground mb-2 md:mb-3">Ricavi Totali (Stima Preventivi)</h2>
            <p className="text-3xl md:text-4xl font-bold text-primary">€{estimatedRevenue.toFixed(2)}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;