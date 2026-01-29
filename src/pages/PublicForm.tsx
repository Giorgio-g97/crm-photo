"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addClient } from "@/utils/localStorage";
import { showSuccess, showError } from "@/utils/toast";

const PublicForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      showError("Per favore, compila tutti i campi obbligatori.");
      return;
    }

    try {
      addClient({ name, email, phone, notes });
      showSuccess("I tuoi dati sono stati inviati con successo!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to save client data:", error);
      showError("Si è verificato un errore durante l'invio dei dati.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
          <h1 className="text-4xl font-extrabold text-primary mb-4">Grazie!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Abbiamo ricevuto i tuoi dati. Ti contatteremo a breve.
          </p>
          <svg
            className="mx-auto h-24 w-24 text-green-500 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-primary mb-6 text-center">Dati Cliente</h1>
        <p className="text-lg text-muted-foreground mb-8 text-center">
          Compila il form per fornirci le tue informazioni.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-lg font-medium text-gray-700">Nome e Cognome</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Il tuo nome completo"
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-lg font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="la.tua@email.com"
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-lg font-medium text-gray-700">Telefono</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Il tuo numero di telefono"
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>
          <div>
            <Label htmlFor="notes" className="text-lg font-medium text-gray-700">Note / Richieste</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Hai richieste particolari o dettagli da aggiungere?"
              rows={4}
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Invia Dati
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PublicForm;