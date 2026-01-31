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

interface SidebarProps {
  onLinkClick?: () => void;
}

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
    name: "Progetti",
    icon: Briefcase,
    path: "/projects",
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

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  return (
    <nav className="flex-1 space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          onClick={onLinkClick}
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
  );
};

export default Sidebar;