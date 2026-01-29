"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard"); // Reindirizza alla dashboard
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Caricamento CRM...</h1>
        <p className="text-xl text-gray-600">
          Reindirizzamento alla tua dashboard.
        </p>
      </div>
    </div>
  );
};

export default Index;