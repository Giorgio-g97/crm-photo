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
import { SheetClose } from "@/components/ui/sheet"; // Importiamo SheetClose

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
  // Determiniamo se stiamo usando la Sidebar all'interno di un Sheet (cioè, se onLinkClick è fornito)
  const isMobileSheet = !!onLinkClick;

  const NavItemContent: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
    <NavLink
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
  );

  return (
    <nav className="flex-1 space-y-1 p-4">
      {navItems.map((item) => (
        <React.Fragment key={item.name}>
          {isMobileSheet ? (
            <SheetClose asChild>
              <NavItemContent item={item} />
            </SheetClose>
          ) : (
            <NavItemContent item={item} />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Sidebar;