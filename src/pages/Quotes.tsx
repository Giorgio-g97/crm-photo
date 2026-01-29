"use client";

import React, { useState, useEffect } from "react";
import { getQuotes, Quote } from "@/utils/localStorage";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Quotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setQuotes(getQuotes());
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preventivi</h1>
          <p className="text-muted-foreground">Gestisci e crea nuovi preventivi per i tuoi clienti.</p>
        </div>
        <Button onClick={() => navigate("/quotes/new")} className="rounded-2xl gap-2">
          <Plus className="h-5 w-5" /> Nuovo Preventivo
        </Button>
      </div>

      <div className="grid gap-4">
        {quotes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-xl font-medium">Nessun preventivo trovato</p>
              <p className="text-muted-foreground">Inizia creando il tuo primo preventivo per un cliente.</p>
            </CardContent>
          </Card>
        ) : (
          quotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow duration-200 rounded-2xl overflow-hidden border-none elevation-1">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <FileText className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{quote.clientName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(quote.timestamp).toLocaleDateString('it-IT')} • {quote.items.length} voci
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Totale</p>
                    <p className="text-xl font-bold text-primary">€ {quote.total.toFixed(2)}</p>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Quotes;