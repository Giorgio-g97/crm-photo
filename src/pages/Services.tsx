"use client";

import React, { useState, useEffect } from "react";
import { getServices, addService, updateService, deleteService, Service } from "@/utils/localStorage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { showSuccess, showError } from "@/utils/toast";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    setServices(getServices());
  }, []);

  const handleAddClick = () => {
    setEditingService({ id: "", name: "", description: "", price: 0 });
    setIsAddingNew(true);
    setIsModalOpen(true);
  };

  const handleEditClick = (service: Service) => {
    setEditingService({ ...service });
    setIsAddingNew(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo servizio?")) {
      try {
        deleteService(id);
        setServices(getServices());
        showSuccess("Servizio eliminato con successo!");
      } catch (error) {
        console.error("Failed to delete service:", error);
        showError("Errore durante l'eliminazione del servizio.");
      }
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      try {
        if (isAddingNew) {
          addService(editingService);
          showSuccess("Servizio aggiunto con successo!");
        } else {
          updateService(editingService);
          showSuccess("Servizio aggiornato con successo!");
        }
        setServices(getServices());
        setIsModalOpen(false);
        setEditingService(null);
        setIsAddingNew(false);
      } catch (error) {
        console.error("Failed to save service:", error);
        showError("Errore durante il salvataggio del servizio.");
      }
    }
  };

  return (
    <div className="p-6 bg-card text-card-foreground rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-primary">Services</h1>
        <Button
          onClick={handleAddClick}
          className="bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Aggiungi Servizio
        </Button>
      </div>
      <p className="text-lg text-muted-foreground mb-8">
        Gestisci qui i tuoi servizi standard.
      </p>
      <div className="mt-8">
        {services.length === 0 ? (
          <p className="text-center text-muted-foreground text-xl">Nessun servizio ancora. Aggiungine uno!</p>
        ) : (
          <ul className="space-y-4">
            {services.map((service) => (
              <li
                key={service.id}
                className="bg-secondary p-4 rounded-lg shadow-sm text-secondary-foreground flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-xl">{service.name} - €{service.price.toFixed(2)}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(service)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(service.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && editingService && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">
                {isAddingNew ? "Aggiungi Nuovo Servizio" : "Modifica Servizio"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveService} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="service-name"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="col-span-3 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-description" className="text-right">
                  Descrizione
                </Label>
                <Textarea
                  id="service-description"
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="col-span-3 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-price" className="text-right">
                  Prezzo Base
                </Label>
                <Input
                  id="service-price"
                  type="number"
                  step="0.01"
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) || 0 })}
                  className="col-span-3 rounded-lg"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90">
                  {isAddingNew ? "Aggiungi" : "Salva modifiche"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Services;