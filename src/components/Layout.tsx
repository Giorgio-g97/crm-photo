"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, NavLink as RouterNavLink } from "react-router-dom"; // Importa NavLink come RouterNavLink
import MobileHeader from "./MobileHeader";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Definisco il contenuto della navigazione qui per poterlo usare sia nel desktop che nel mobile sheet
const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Clienti", path: "/customers" },
  { name: "Progetti", path: "/projects" },
  { name: "Preventivi", path: "/quotes" },
  { name: "Servizi", path: "/services" },
];

const NavContent: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => {
  // Definisco il componente NavLink locale che wrappa RouterNavLink
  const NavLink: React.FC<{ path: string, name: string }> = ({ path, name }) => (
    <SheetClose asChild>
      <RouterNavLink
        to={path}
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
        {/* Icone omesse qui per semplicità, ma dovrebbero essere incluse nel Sidebar.tsx */}
        <span>{name}</span>
      </RouterNavLink>
    </SheetClose>
  );

  return (
    <nav className="flex-1 space-y-1 p-4">
      {navItems.map((item) => (
        <NavLink key={item.name} path={item.path} name={item.name} />
      ))}
    </nav>
  );
};


const Layout = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-4 flex-col shadow-sm hidden md:flex">
        <div className="flex items-center px-4 h-16 mb-6">
          <h1 className="text-xl font-bold text-primary tracking-tight">Material CRM</h1>
        </div>
        <Sidebar onLinkClick={() => {}} /> {/* Uso il componente Sidebar per il contenuto di navigazione */}
      </aside>

      {/* Mobile Header & Sheet */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-6 w-6 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <div className="flex items-center px-4 h-16 mb-6">
              <h1 className="text-xl font-bold text-primary tracking-tight">Material CRM</h1>
            </div>
            {/* Uso il componente Sidebar per il contenuto di navigazione e chiudo lo sheet al click */}
            <Sidebar onLinkClick={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold text-primary tracking-tight">Material CRM</h1>
      </header>

      {/* Contenuto Principale */}
      <main className="flex-1 p-4 md:p-8 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;