"use client";

import React, { useState, useEffect } from "react";
import { getClients, getServices, addQuote, Client, Service } from "@/utils/localStorage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

const CreateQuote = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedItems, setSelectedItems] = useState<{serviceId: string, name: string, description: string, price: number}[]>([]);

  useEffect(() => {
    setClients(getClients());
    setAvailableServices(getServices());
  }, []);

  const handleAddItem = (serviceId: string) => {
    const service = availableServices.find(s => s.id === serviceId);
    if (service) {
      setSelectedItems([...selectedItems, {
        serviceId: service.id,
        name: service.name,
        description: service.description,
        price: service.price
      }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleSave = () => {
    if (!selectedClientId) {
      showError("Seleziona un cliente");
      return;
    }
    if (selectedItems.length === 0) {
      showError("Aggiungi almeno un servizio");
      return;
    }

    const client = clients.find(c => c.id === selectedClientId);
    
    try {
      addQuote({
        clientId: selectedClientId,
        clientName: client?.name || "Sconosciuto",
        items: selectedItems,
        total: total
      });
      showSuccess("Preventivo creato con successo!");
      navigate("/quotes");
    } catch (e) {
      showError("Errore nel salvataggio del preventivo");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/quotes")} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Crea Preventivo</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-2xl border-none elevation-1">
            <CardHeader>
              <CardTitle>Dettagli Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Seleziona Cliente</Label>
                <Select onValueChange={setSelectedClientId} value={selectedClientId}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Scegli un cliente esistente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none elevation-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Servizi nel Preventivo</CardTitle>
              <div className="w-64">
                <Select onValueChange={handleAddItem}>
                  <SelectTrigger className="rounded-xl bg-secondary border-none">
                    <Plus className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Aggiungi servizio..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.map(service => (
                      <SelectItem key={service.id} value={service.id}>{service.name} (€{service.price})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 italic">Nessun servizio aggiunto ancora.</p>
                ) : (
                  selectedItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold">€ {item.price.toFixed(2)}</p>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-destructive hover:bg-destructive/10 rounded-full">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-none bg-primary text-primary-foreground shadow-xl">
            <CardHeader>
              <CardTitle>Riepilogo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-end">
                <span>Imponibile</span>
                <span className="text-xl">€ {total.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-primary-foreground/20">
                <div className="flex justify-between items-end font-bold text-3xl">
                  <span>Totale</span>
                  <span>€ {total.toFixed(2)}</span>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl py-6 text-lg font-bold">
                <Save className="mr-2 h-5 w-5" /> Salva Preventivo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateQuote;