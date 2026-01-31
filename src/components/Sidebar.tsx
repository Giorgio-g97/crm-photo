"use client";

import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Clienti",
      icon: Users,
      path: "/customers",
    },
    {
      name: "Progetti", // Updated name
      icon: Briefcase,
      path: "/projects", // Updated path
    },
    {
      name: "Preventivi",
      icon: FileText,
      path: "/quotes",
    },
    {
      name: "Servizi",
      icon: Settings,
      path: "/services",
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-4 flex flex-col shadow-sm">
      <div className="flex items-center px-4 h-16 mb-6">
        <h1 className="text-xl font-bold text-primary tracking-tight">Material CRM</h1>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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