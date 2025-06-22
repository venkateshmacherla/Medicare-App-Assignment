import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MedicationDashboard from "./pages/MedicationDashboard";

// NEW IMPORTS
import PatientDashboard from "./components/PatientDashboard";
import CaretakerDashboard from "./components/CaretakerDashboard";
import DashboardSwitcher from "./pages/DashboardSwitcher"; // optional route to select role

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<MedicationDashboard />} />

            <Route path="/home" element={<DashboardSwitcher />} />

            {/* Role-based dashboards */}
            <Route path="/select-dashboard" element={<DashboardSwitcher />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/caretaker-dashboard" element={<CaretakerDashboard />} />

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
