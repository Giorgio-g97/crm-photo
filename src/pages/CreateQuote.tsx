"use client";

import React, { useState, useEffect } from "react";
import { getClients, getServices, addQuote, Client, Service } from "@/utils/localStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

interface QuoteItem {
  serviceId: string;
  name: string;
  description: string;
  price: number;
}

const CreateQuote = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [newItem, setNewItem] = useState({ serviceId: "", name: "", description: "", price: 0 });

  useEffect(() => {
    const allClients = getClients() || [];
    const allServices = getServices() || [];
    setClients(allClients);
    setServices(allServices);

    const clientIdParam = searchParams.get("clientId");
    const duplicateIdParam = searchParams.get("duplicateId");

    if (clientIdParam) {
      setSelectedClientId(clientIdParam);
    }

    if (duplicateIdParam) {
      // Qui potresti caricare i dati del preventivo da duplicare
      // Per ora, mostriamo un messaggio
      showSuccess("Modalità duplicazione attivata");
    }
  }, [searchParams]);

  const handleAddItem = () => {
    if (!newItem.name || newItem.price <= 0) {
      showError("Compila nome e prezzo del servizio");
      return;
    }

    const itemToAdd: QuoteItem = {
      serviceId: newItem.serviceId || crypto.randomUUID(),
      name: newItem.name,
      description: newItem.description,
      price: newItem.price
    };

    setItems([...items, itemToAdd]);
    setNewItem({ serviceId: "", name: "", description: "", price: 0 });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSave = () => {
    if (!selectedClientId) {
      showError("Seleziona un cliente");
      return;
    }
    if (items.length === 0) {
      showError("Aggiungi almeno un servizio");
      return;
    }

    const client = clients.find(c => c.id === selectedClientId);
    const total = items.reduce((sum, item) => sum + item.price, 0);

    try {
      addQuote({
        clientId: selectedClientId,
        clientName: client?.name || "Sconosciuto",
        items: items,
        total: total
      });
      showSuccess("Preventivo creato con successo!");
      navigate("/quotes");
    } catch (e) {
      console.error("Errore salvataggio:", e);
      showError("Errore durante il salvataggio del preventivo");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
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
                <Label htmlFor="client-select">Seleziona Cliente</Label>
                <select
                  id="client-select"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="">Scegli un cliente...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none elevation-1">
            <CardHeader>
              <CardTitle>Aggiungi Servizi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service-select">Servizio Esistente</Label>
                    <select
                      id="service-select"
                      value={newItem.serviceId}
                      onChange={(e) => {
                        const service = services.find(s => s.id === e.target.value);
                        if (service) {
                          setNewItem({
                            serviceId: service.id,
                            name: service.name,
                            description: service.description,
                            price: service.price
                          });
                        }
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                      <option value="">Scegli un servizio...</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>{service.name} (€{service.price})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="custom-price">Prezzo Personalizzato</Label>
                    <Input
                      id="custom-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.price || ""}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="item-name">Nome Servizio</Label>
                  <Input
                    id="item-name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="Nome del servizio"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <Label htmlFor="item-description">Descrizione</Label>
                  <textarea
                    id="item-description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Descrizione del servizio"
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                <Button onClick={handleAddItem} className="w-full rounded-xl gap-2">
                  <Plus className="h-5 w-5" /> Aggiungi al Preventivo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none elevation-1">
            <CardHeader>
              <CardTitle>Servizi nel Preventivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 italic">Nessun servizio aggiunto ancora.</p>
                ) : (
                  items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold">€ {item.price.toFixed(2)}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveItem(index)} 
                          className="text-destructive hover:bg-destructive/10 rounded-full"
                        >
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
                <span className="text-xl">€ {items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-primary-foreground/20">
                <div className="flex justify-between items-end font-bold text-3xl">
                  <span>Totale</span>
                  <span>€ {items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </div>
              </div>
              <Button 
                onClick={handleSave} 
                className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl py-6 text-lg font-bold"
              >
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