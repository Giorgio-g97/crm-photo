"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="rounded-full"
      >
        <Menu className="h-6 w-6 text-primary" />
      </Button>
      <h1 className="text-xl font-bold text-primary tracking-tight">Material CRM</h1>
    </header>
  );
};

export default MobileHeader;