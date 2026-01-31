"use client";

// Fallback for crypto.randomUUID if not available (e.g. non-secure context)
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  timestamp: string;
  internalNotes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface QuoteItem {
  serviceId: string;
  name: string;
  description: string;
  price: number; // Price per unit
  quantity: number; // New field
}

export interface Quote {
  id: string;
  clientId: string;
  clientName: string;
  items: QuoteItem[];
  total: number;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  status: "planning" | "in-progress" | "completed";
  budget: number;
  clientId?: string;
  description?: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  CLIENTS: "crm_clients",
  SERVICES: "crm_services",
  QUOTES: "crm_quotes",
  PROJECTS: "crm_projects",
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
    ...client,
    id: generateId(),
    timestamp: new Date().toISOString(),
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
  return updatedClient;
};

export const getClientById = (id: string): Client | undefined => {
  const clients = getClients();
  return clients.find((client) => client.id === id);
};

export const deleteClient = (id: string) => {
  const clients = getClients();
  const filteredClients = clients.filter((c) => c.id !== id);
  saveClients(filteredClients);
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
    ...service,
    id: generateId(),
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

export const getQuoteById = (id: string): Quote | undefined => {
  const quotes = getQuotes();
  return quotes.find((quote) => quote.id === id);
};

export const addQuote = (quote: Omit<Quote, "id" | "timestamp">): Quote => {
  const quotes = getQuotes();
  const newQuote: Quote = {
    ...quote,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  quotes.push(newQuote);
  saveQuotes(quotes);
  return newQuote;
};

export const updateQuote = (updatedQuote: Quote): Quote => {
  const quotes = getQuotes();
  const index = quotes.findIndex((q) => q.id === updatedQuote.id);
  if (index > -1) {
    // Preserve original timestamp if not provided, but since we are updating, let's update it.
    quotes[index] = { ...updatedQuote, timestamp: new Date().toISOString() };
    saveQuotes(quotes);
    return quotes[index];
  }
  throw new Error("Quote not found for update.");
};

export const getQuotesByClientId = (clientId: string): Quote[] => {
  const quotes = getQuotes();
  return quotes.filter((quote) => quote.clientId === clientId);
};

export const deleteQuote = (id: string) => {
  const quotes = getQuotes();
  const filteredQuotes = quotes.filter((q) => q.id !== id);
  saveQuotes(filteredQuotes);
};

// --- Projects ---
export const getProjects = (): Project[] => {
  if (typeof window === "undefined") return [];
  const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return projects ? JSON.parse(projects) : [];
};

export const saveProjects = (projects: Project[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const addProject = (project: Omit<Project, "id" | "timestamp">): Project => {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
};

export const updateProject = (updatedProject: Project): Project => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === updatedProject.id);
  if (index > -1) {
    projects[index] = { ...updatedProject, timestamp: new Date().toISOString() };
    saveProjects(projects);
    return projects[index];
  }
  throw new Error("Project not found for update.");
};

export const deleteProject = (id: string) => {
  const projects = getProjects();
  const filteredProjects = projects.filter((p) => p.id !== id);
  saveProjects(filteredProjects);
};

// --- Global Repair Logic ---
export const repairData = () => {
  if (typeof window === "undefined") return;

  const repairCollection = <T extends { id: string }>(key: string, name: string) => {
    const data = localStorage.getItem(key);
    if (!data) return;
    try {
      const items: T[] = JSON.parse(data);
      let changed = false;
      const repaired = items.map(item => {
        if (!item.id || item.id.trim() === "") {
          changed = true;
          return { ...item, id: generateId() };
        }
        return item;
      });
      if (changed) {
        localStorage.setItem(key, JSON.stringify(repaired));
        console.log(`[CRM] Repaired IDs in ${name}`);
      }
    } catch (e) {
      console.error(`[CRM] Failed to repair ${name}:`, e);
    }
  };

  repairCollection("crm_clients", "Clients");
  repairCollection("crm_services", "Services");
  repairCollection("crm_quotes", "Quotes");
  repairCollection("crm_projects", "Projects");
};