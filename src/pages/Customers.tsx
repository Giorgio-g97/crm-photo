"use client";

import React, { useState, useEffect } from "react";
import { getClients, updateClient, Client } from "@/utils/localStorage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { showSuccess, showError } from "@/utils/toast";
import { Pencil, FileText } from "lucide-react";
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
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
              className="bg-card p-6 rounded-2xl elevation-1 flex justify-between items-center group hover:bg-secondary/20 transition-colors"
            >
              <div>
                <h3 className="font-bold text-xl">{client.name}</h3>
                <p className="text-muted-foreground">{client.email} • {client.phone}</p>
                {client.internalNotes && (
                  <p className="text-sm text-primary mt-2 italic font-medium">Nota: {client.internalNotes}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl gap-2 border-primary/20 hover:bg-primary/10"
                  onClick={() => handleCreateQuote(client.id)}
                >
                  <FileText className="h-4 w-4" /> Preventivo
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(client)}
                  className="rounded-full hover:bg-primary/10 text-primary"
                >
                  <Pencil className="h-5 w-5" />
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