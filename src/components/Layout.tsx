"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { MadeWithDyad } from "./made-with-dyad";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
      <div className="fixed bottom-0 right-0 p-4">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Layout;