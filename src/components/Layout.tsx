"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Layout = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Funzione per chiudere il menu dopo la navigazione su mobile
  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      
      {/* Sidebar Desktop (Hidden on mobile) */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-4 flex-col shadow-sm hidden md:flex">
        <div className="flex items-center px-4 h-16 mb-6">
          <h1 className="text-xl font-bold text-primary tracking-tight">Material CRM</h1>
        </div>
        <Sidebar />
      </aside>

      {/* Mobile Header & Sheet (Hidden on desktop) */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:hidden elevation-1 shrink-0">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-6 w-6 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col" aria-describedby={undefined}>
            <div className="flex items-center px-4 h-16 mb-6 border-b">
              <SheetTitle className="text-xl font-bold text-primary tracking-tight">Material CRM</SheetTitle>
            </div>
            {/* Passiamo handleLinkClick alla Sidebar per chiudere lo Sheet */}
            <Sidebar onLinkClick={handleLinkClick} />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold text-primary tracking-tight">Material CRM</h1>
      </header>

      {/* Contenuto Principale */}
      <main className="flex-1 p-4 md:p-8 md:ml-64 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;