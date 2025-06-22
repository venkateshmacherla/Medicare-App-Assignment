// src/pages/DashboardSwitcher.tsx
import { useState } from "react";
import PatientDashboard from "@/components/PatientDashboard";
import CaretakerDashboard from "@/components/CaretakerDashboard";
import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";

type UserType = "patient" | "caretaker" | null;

const DashboardSwitcher = () => {
  const [userType, setUserType] = useState<UserType>(null);

  if (!userType) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Select Your Role</h1>
        <div className="flex gap-4">
          <Button onClick={() => setUserType("patient")} className="flex items-center gap-2">
            <User className="w-4 h-4" /> Patient
          </Button>
          <Button onClick={() => setUserType("caretaker")} className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Caretaker
          </Button>
        </div>
      </div>
    );
  }

  return userType === "patient" ? <PatientDashboard /> : <CaretakerDashboard />;
};

export default DashboardSwitcher;
