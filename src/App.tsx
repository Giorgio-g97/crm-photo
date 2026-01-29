import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // Import the new Layout component
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard"; // Import Dashboard
import Customers from "./pages/Customers"; // Import Customers
import Deals from "./pages/Deals"; // Import Deals
import PublicForm from "./pages/PublicForm"; // Import PublicForm
import Services from "./pages/Services"; // Import Services

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/public-form" element={<PublicForm />} /> {/* Public Form route, outside Layout */}
          <Route element={<Layout />}> {/* Wrap admin routes with Layout */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* CRM Dashboard route */}
            <Route path="/customers" element={<Customers />} /> {/* CRM Customers route */}
            <Route path="/deals" element={<Deals />} /> {/* CRM Deals route */}
            <Route path="/services" element={<Services />} /> {/* CRM Services route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;