"use client";

import React, { useState, useEffect } from "react";
import { getClients, updateClient, Client } from "@/utils/localStorage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { showSuccess, showError } from "@/utils/toast";
import { Pencil, PlusCircle } from "lucide-react"; // Added PlusCircle for future "add client"

const Customers = () => {
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

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      try {
        updateClient(editingClient);
        setClients(getClients()); // Refresh client list
        setIsModalOpen(false);
        setEditingClient(null);
        showSuccess("Cliente aggiornato con successo!");
      } catch (error) {
        console.error("Failed to update client:", error);
        showError("Errore durante l'aggiornamento del cliente.");
      }
    }
  };

  return (
    <div className="p-6 bg-card text-card-foreground rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-primary">Customers</h1>
        {/* <Button className="bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Client
        </Button> */}
      </div>
      <p className="text-lg text-muted-foreground mb-8">
        Gestisci qui i tuoi clienti.
      </p>
      <div className="mt-8">
        {clients.length === 0 ? (
          <p className="text-center text-muted-foreground text-xl">Nessun cliente ancora. Condividi il link del form pubblico!</p>
        ) : (
          <ul className="space-y-4">
            {clients.map((client) => (
              <li
                key={client.id}
                className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-xl">{client.name}</h3>
                  <p className="text-muted-foreground">{client.email}</p>
                  <p className="text-muted-foreground">{client.phone}</p>
                  {client.internalNotes && (
                    <p className="text-sm text-gray-500 mt-2 italic">Note interne: {client.internalNotes}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(client)}
                  className="text-primary hover:bg-primary/10"
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && editingClient && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">Modifica Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveClient} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="edit-name"
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="col-span-3 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingClient.email}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  className="col-span-3 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Telefono
                </Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editingClient.phone}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  className="col-span-3 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  Note Cliente
                </Label>
                <Textarea
                  id="edit-notes"
                  value={editingClient.notes}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  className="col-span-3 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-internal-notes" className="text-right">
                  Note Interne
                </Label>
                <Textarea
                  id="edit-internal-notes"
                  value={editingClient.internalNotes || ""}
                  onChange={(e) => setEditingClient({ ...editingClient, internalNotes: e.target.value })}
                  className="col-span-3 rounded-lg"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90">
                  Salva modifiche
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Customers;