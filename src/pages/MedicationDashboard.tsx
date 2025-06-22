import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; //Import useNavigate
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  taken_dates: string;
}

export default function MedicationDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate(); //Initialize navigate
  const [medications, setMedications] = useState<Medication[]>([]);
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "" });

  const fetchMedications = async () => {
    const res = await API.get("/medications");
    setMedications(res.data);
  };

  const addMedication = async () => {
    if (!form.name || !form.dosage || !form.frequency) return;
    await API.post("/medications", form);
    setForm({ name: "", dosage: "", frequency: "" });
    fetchMedications();
  };

  // Function to mark medication as taken (Updated)
const markTaken = async (id: number) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    await API.put(`/medications/${id}/taken`, { date: todayStr });
    fetchMedications();
  } catch (error) {
    console.error("Failed to mark medication as taken:", error);
    // Optionally show a user-friendly error message here
  }
};

  const getAdherence = (dates: string) => {
    const taken = JSON.parse(dates || "[]");
    const daysTracked = 30;
    return `${Math.round((taken.length / daysTracked) * 100)}%`;
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Medication Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/home")}>Home</Button> {/*Home Button */}
          <Button variant="destructive" onClick={logout}>Logout</Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Dosage" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
        <Input placeholder="Frequency" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
        <Button onClick={addMedication}>Add</Button>
      </div>

      <ul className="space-y-4">
        {medications.map((med) => (
          <li key={med.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{med.name}</div>
              <div className="text-sm text-gray-600">{med.dosage} | {med.frequency}</div>
              <div className="text-sm mt-1">Adherence: {getAdherence(med.taken_dates)}</div>
            </div>
            <Button onClick={() => markTaken(med.id)}>Mark Taken</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
