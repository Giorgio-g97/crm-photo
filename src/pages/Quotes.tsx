"use client";

import React, { useState, useEffect } from "react";
import { getQuotes, Quote, getClientById, deleteQuote } from "@/utils/localStorage";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, Copy, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { generateQuotePDF } from "@/utils/pdfGenerator";

const Quotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuoteToDuplicate, setSelectedQuoteToDuplicate] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setQuotes(getQuotes());
  }, []);

  const handleCreateNew = () => {
    setIsCreateModalOpen(false);
    navigate("/quotes/new");
  };

  const handleDuplicate = () => {
    if (selectedQuoteToDuplicate) {
      setIsCreateModalOpen(false);
      navigate(`/quotes/new?duplicateId=${selectedQuoteToDuplicate}`);
    } else {
      showError("Seleziona un preventivo da duplicare");
    }
  };

  const handleDownloadPDF = (quote: Quote) => {
    try {
      const client = getClientById(quote.clientId);
      if (client) {
        generateQuotePDF(quote, client.name, client.email, client.phone);
        showSuccess("PDF generato con successo!");
      } else {
        showError("Cliente non trovato");
      }
    } catch (error) {
      console.error("Errore generazione PDF:", error);
      showError("Errore durante la generazione del PDF");
    }
  };
  
  const handleDeleteQuote = (id: string, clientName: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare il preventivo per ${clientName}?`)) {
      try {
        deleteQuote(id);
        setQuotes(getQuotes());
        showSuccess("Preventivo eliminato con successo!");
      } catch (error) {
        console.error("Errore eliminazione preventivo:", error);
        showError("Errore durante l'eliminazione del preventivo.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preventivi</h1>
          <p className="text-muted-foreground">Gestisci e crea nuovi preventivi per i tuoi clienti.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-2xl gap-2">
          <Plus className="h-5 w-5" /> Nuovo Preventivo
        </Button>
      </div>

      {/* Modale di creazione preventivo */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Crea Nuovo Preventivo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              Come vuoi creare il nuovo preventivo?
            </p>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label>Oppure duplica un preventivo esistente</Label>
                <Select onValueChange={setSelectedQuoteToDuplicate} value={selectedQuoteToDuplicate}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleziona un preventivo da duplicare..." />
                  </SelectTrigger>
                  <SelectContent>
                    {quotes.length > 0 ? (
                      quotes.map(quote => (
                        <SelectItem key={quote.id} value={quote.id}>
                          {quote.clientName} - €{quote.total.toFixed(2)}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground text-center">Nessun preventivo disponibile</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCreateNew} className="rounded-xl">
              Crea Vuoto
            </Button>
            <Button onClick={handleDuplicate} className="rounded-xl">
              Duplica Selezionato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          quotes.map((quote) => {
            const client = getClientById(quote.clientId);
            return (
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
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-4">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Totale</p>
                      <p className="text-xl font-bold text-primary">€ {quote.total.toFixed(2)}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full" 
                      title="Scarica PDF"
                      onClick={() => handleDownloadPDF(quote)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full" 
                      title="Duplica preventivo"
                      onClick={() => navigate(`/quotes/new?duplicateId=${quote.id}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full text-destructive hover:bg-destructive/10" 
                      title="Elimina preventivo"
                      onClick={() => handleDeleteQuote(quote.id, quote.clientName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Quotes;