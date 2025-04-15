
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navigation from "./components/Navigation";
import ScannerPage from "./pages/ScannerPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import CartPage from "./pages/CartPage";
import FridgePage from "./pages/FridgePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <Router>
          <div className="min-h-screen pb-16">
            <Routes>
              <Route path="/" element={<Navigate to="/scanner" replace />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/suggestions" element={<SuggestionsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/fridge" element={<FridgePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Navigation />
          </div>
        </Router>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
