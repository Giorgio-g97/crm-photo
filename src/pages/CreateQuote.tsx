"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getClients, getServices, addQuote, updateQuote, getQuoteById, Client, Service, QuoteItem, Quote } from "@/utils/localStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, Trash2, Edit } from "lucide-react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

// IVA rate (22% standard in Italy)
const IVA_RATE = 0.22;

interface CreateQuoteProps {
  isEditing?: boolean;
}

const CreateQuote: React.FC<CreateQuoteProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { quoteId } = useParams<{ quoteId: string }>();

  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [newItem, setNewItem] = useState({ serviceId: "", name: "", description: "", price: 0, quantity: 1 });
  const [existingQuote, setExistingQuote] = useState<Quote | null>(null);

  useEffect(() => {
    try {
      const allClients = getClients() || [];
      const allServices = getServices() || [];
      setClients(allClients);
      setServices(allServices);

      const clientIdParam = searchParams.get("clientId");
      const duplicateIdParam = searchParams.get("duplicateId");

      if (clientIdParam) {
        setSelectedClientId(clientIdParam);
      }

      if (isEditing && quoteId) {
        const quoteToEdit = getQuoteById(quoteId);
        if (quoteToEdit) {
          setExistingQuote(quoteToEdit);
          setSelectedClientId(quoteToEdit.clientId);
          setItems(quoteToEdit.items);
        } else {
          showError("Preventivo non trovato.");
          navigate("/quotes");
        }
      } else if (duplicateIdParam) {
        const quoteToDuplicate = getQuoteById(duplicateIdParam);
        if (quoteToDuplicate) {
          setSelectedClientId(quoteToDuplicate.clientId);
          setItems(quoteToDuplicate.items);
          showSuccess("Modalità duplicazione attivata");
        } else {
          showError("Preventivo originale non trovato.");
        }
      }
    } catch (error) {
      console.error("Error in CreateQuote useEffect:", error);
      showError("Si è verificato un errore durante il caricamento dei dati.");
    }
  }, [searchParams, isEditing, quoteId, navigate]);

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setNewItem({
        serviceId: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        quantity: 1,
      });
    } else {
      setNewItem({ serviceId: "", name: "", description: "", price: 0, quantity: 1 });
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || newItem.price <= 0 || newItem.quantity <= 0) {
      showError("Compila nome, prezzo e quantità validi.");
      return;
    }

    const itemToAdd: QuoteItem = {
      serviceId: newItem.serviceId || crypto.randomUUID(),
      name: newItem.name,
      description: newItem.description,
      price: newItem.price,
      quantity: newItem.quantity,
    };

    setItems([...items, itemToAdd]);
    setNewItem({ serviceId: "", name: "", description: "", price: 0, quantity: 1 });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  const ivaAmount = subtotal * IVA_RATE;
  const total = subtotal + ivaAmount;

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
    if (!client) {
      showError("Cliente non valido");
      return;
    }

    const quoteData = {
      clientId: selectedClientId,
      clientName: client.name,
      items: items,
      total: total,
    };

    try {
      if (isEditing && existingQuote) {
        updateQuote({ ...existingQuote, ...quoteData, id: existingQuote.id });
        showSuccess("Preventivo aggiornato con successo!");
      } else {
        addQuote(quoteData);
        showSuccess("Preventivo creato con successo!");
      }
      navigate("/quotes");
    } catch (e) {
      console.error("Errore salvataggio:", e);
      showError("Errore durante il salvataggio del preventivo");
    }
  };

  const pageTitle = isEditing ? "Modifica Preventivo" : "Crea Preventivo";
  const saveButtonText = isEditing ? "Salva Modifiche" : "Salva Preventivo";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/quotes")} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        {isEditing && existingQuote && (
          <span className="text-sm text-muted-foreground">ID: {existingQuote.id.substring(0, 8).toUpperCase()}</span>
        )}
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
                <Select
                  value={selectedClientId}
                  onValueChange={setSelectedClientId}
                  disabled={isEditing}
                >
                  <SelectTrigger id="client-select" className="rounded-xl">
                    <SelectValue placeholder="Scegli un cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Aggiunto un SelectItem predefinito per gestire lo stato iniziale e i clienti vuoti */}
                    <SelectItem value="" disabled={clients.length > 0}>
                      {clients.length === 0 ? "Nessun cliente disponibile" : "Seleziona un cliente..."}
                    </SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none elevation-1">
            <CardHeader>
              <CardTitle>Aggiungi Servizi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="service-select">Servizio Esistente</Label>
                    <Select
                      value={newItem.serviceId}
                      onValueChange={handleServiceSelect}
                    >
                      <SelectTrigger id="service-select" className="rounded-xl">
                        <SelectValue placeholder="Scegli un servizio..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Scegli un servizio...</SelectItem>
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} (€{service.price.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="item-quantity">Quantità</Label>
                    <Input
                      id="item-quantity"
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                      placeholder="1"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="item-name">Nome Servizio</Label>
                    <Input
                      id="item-name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="Nome del servizio"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-price">Prezzo Unitario</Label>
                    <Input
                      id="custom-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.price || ""}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="item-description">Descrizione</Label>
                  <Textarea
                    id="item-description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Descrizione del servizio"
                    rows={2}
                    className="rounded-xl"
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
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.quantity} x €{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold">€ {(item.price * item.quantity).toFixed(2)}</p>
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
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <span>Imponibile</span>
                <span className="text-xl">€ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end border-t border-primary-foreground/20 pt-2">
                <span>IVA ({IVA_RATE * 100}%)</span>
                <span className="text-xl">€ {ivaAmount.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-primary-foreground/20">
                <div className="flex justify-between items-end font-bold text-3xl">
                  <span>Totale</span>
                  <span>€ {total.toFixed(2)}</span>
                </div>
              </div>
              <Button 
                onClick={handleSave} 
                className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl py-6 text-lg font-bold"
              >
                {isEditing ? <Edit className="mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />} {saveButtonText}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateQuote;