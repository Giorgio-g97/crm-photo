"use client";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  timestamp: string;
  internalNotes?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface QuoteItem {
  serviceId: string;
  name: string;
  description: string;
  price: number;
}

interface Quote {
  id: string;
  clientId: string;
  clientName: string;
  items: QuoteItem[];
  total: number;
  timestamp: string;
}

const STORAGE_KEYS = {
  CLIENTS: "crm_clients",
  SERVICES: "crm_services",
  QUOTES: "crm_quotes",
};

// --- Clients ---
export const getClients = (): Client[] => {
  if (typeof window === "undefined") return [];
  const clients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  return clients ? JSON.parse(clients) : [];
};

export const saveClients = (clients: Client[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
};

export const addClient = (client: Omit<Client, "id" | "timestamp">): Client => {
  const clients = getClients();
  const newClient: Client = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...client,
  };
  clients.push(newClient);
  saveClients(clients);
  return newClient;
};

export const updateClient = (updatedClient: Client): Client => {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === updatedClient.id);
  if (index > -1) {
    clients[index] = updatedClient;
    saveClients(clients);
    return updatedClient;
  }
  return updatedClient; // Or throw an error if client not found
};

export const getClientById = (id: string): Client | undefined => {
  const clients = getClients();
  return clients.find((client) => client.id === id);
};

// --- Services ---
export const getServices = (): Service[] => {
  if (typeof window === "undefined") return [];
  const services = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return services ? JSON.parse(services) : [];
};

export const saveServices = (services: Service[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const addService = (service: Omit<Service, "id">): Service => {
  const services = getServices();
  const newService: Service = {
    id: crypto.randomUUID(),
    ...service,
  };
  services.push(newService);
  saveServices(services);
  return newService;
};

export const updateService = (updatedService: Service): Service => {
  const services = getServices();
  const index = services.findIndex((s) => s.id === updatedService.id);
  if (index > -1) {
    services[index] = updatedService;
    saveServices(services);
    return updatedService;
  }
  return updatedService;
};

export const deleteService = (id: string) => {
  const services = getServices();
  const filteredServices = services.filter((s) => s.id !== id);
  saveServices(filteredServices);
};

// --- Quotes ---
export const getQuotes = (): Quote[] => {
  if (typeof window === "undefined") return [];
  const quotes = localStorage.getItem(STORAGE_KEYS.QUOTES);
  return quotes ? JSON.parse(quotes) : [];
};

export const saveQuotes = (quotes: Quote[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
};

export const addQuote = (quote: Omit<Quote, "id" | "timestamp">): Quote => {
  const quotes = getQuotes();
  const newQuote: Quote = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...quote,
  };
  quotes.push(newQuote);
  saveQuotes(quotes);
  return newQuote;
};

export const getQuotesByClientId = (clientId: string): Quote[] => {
  const quotes = getQuotes();
  return quotes.filter((quote) => quote.clientId === clientId);
};