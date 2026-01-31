"use client";

import React, { useState, useEffect } from "react";
import { getClients, updateClient, deleteClient, Client } from "@/utils/localStorage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { showSuccess, showError } from "@/utils/toast";
import { Pencil, FileText, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setClients(getClients());
  }, []);

  const handleEditClick = (client: Client) => {
    setEditingClient({ ...client });
    setIsModalOpen(true);
  };

  const handleCreateQuote = (clientId: string) => {
    navigate(`/quotes/new?clientId=${clientId}`);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      try {
        updateClient(editingClient);
        setClients(getClients());
        setIsModalOpen(false);
        setEditingClient(null);
        showSuccess("Cliente aggiornato con successo!");
      } catch (error) {
        showError("Errore durante l'aggiornamento.");
      }
    }
  };

  const handleDeleteClient = (client: Client) => {
    if (window.confirm(`Sei sicuro di voler eliminare il cliente "${client.name}"? Questa azione è irreversibile.`)) {
      try {
        deleteClient(client.id);
        setClients(getClients());
        showSuccess("Cliente eliminato con successo!");
      } catch (error) {
        showError("Errore durante l'eliminazione del cliente.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-2 md:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Clienti</h1>
          <p className="text-muted-foreground">Gestisci i contatti e visualizza i loro dati.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {clients.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-xl italic border-2 border-dashed rounded-2xl">
            Nessun cliente ancora. Condividi il link del form pubblico!
          </p>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="bg-card p-4 sm:p-6 rounded-2xl elevation-1 flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:bg-secondary/20 transition-all duration-200 border border-transparent hover:border-primary/10 gap-4"
            >
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <h3 className="font-bold text-lg text-foreground">{client.name}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">{client.email}</span>
                  <span className="hidden sm:inline opacity-30">•</span>
                  <span className="flex items-center gap-1">{client.phone}</span>
                </div>
                {client.internalNotes && (
                  <div className="mt-3 p-2 bg-primary/5 rounded-lg border-l-4 border-primary/30">
                    <p className="text-xs text-primary italic font-medium">Nota: {client.internalNotes}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                <Button
                  variant="outline"
                  className="rounded-xl gap-2 border-primary/20 hover:bg-primary/10 text-xs sm:text-sm h-9 flex-1 sm:flex-none font-semibold"
                  onClick={() => handleCreateQuote(client.id)}
                >
                  <FileText className="h-4 w-4" /> Preventivo
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(client)}
                  className="rounded-full h-9 w-9 hover:bg-primary/10 text-primary flex-shrink-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClient(client)}
                  className="rounded-full h-9 w-9 hover:bg-destructive/10 text-destructive flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && editingClient && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">Modifica Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveClient} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingClient.email}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Note Interne</Label>
                <Textarea
                  id="edit-notes"
                  value={editingClient.internalNotes || ""}
                  onChange={(e) => setEditingClient({ ...editingClient, internalNotes: e.target.value })}
                  className="rounded-xl min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full rounded-xl">Salva modifiche</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Customers;