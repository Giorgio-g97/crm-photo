"use client";

import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Handshake, Settings } from "lucide-react"; // Added Settings icon
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Customers",
      icon: Users,
      path: "/customers",
    },
    {
      name: "Deals",
      icon: Handshake,
      path: "/deals",
    },
    {
      name: "Services", // New item for Services
      icon: Settings, // Using Settings icon for Services
      path: "/services",
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground shadow-lg rounded-r-xl p-4 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border mb-6">
        <h1 className="text-2xl font-bold text-sidebar-primary-foreground">Simple CRM</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;