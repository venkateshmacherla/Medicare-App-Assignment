import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Check, Calendar as CalendarIcon, User } from "lucide-react";
import MedicationTracker from "./MedicationTracker";
import CaretakerDashboard from "./CaretakerDashboard";
import { format, isToday, isBefore, startOfDay, getDaysInMonth } from "date-fns";
import API from "../services/api";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001"; // Change if your backend runs elsewhere

const PatientDashboard = ({ onSwitchRole }: { onSwitchRole?: (role: string) => void }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [takenDates, setTakenDates] = useState<Set<string>>(new Set());
  const [medications, setMedications] = useState<any[]>([]);
  const [role, setRole] = useState<"patient" | "caretaker">("patient");
  const [socket, setSocket] = useState<Socket | null>(null);

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const isTodaySelected = isToday(selectedDate);
  const isSelectedDateTaken = takenDates.has(selectedDateStr);

  // --- Setup socket connection and listeners ---
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Listen for medication updates from server
    newSocket.on("medication-updated", () => {
      fetchTakenDates();
    });

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const fetchTakenDates = async () => {
    try {
      const res = await API.get("/medications");
      const dates = new Set<string>();
      res.data.forEach((med: any) => {
        const taken = JSON.parse(med.taken_dates || "[]");
        taken.forEach((d: string) => dates.add(d));
      });
      setTakenDates(dates);
      setMedications(res.data);
    } catch (err) {
      console.error("Failed to fetch medications", err);
    }
  };

  const handleMarkTaken = async (date: string) => {
    try {
      const res = await API.get("/medications");
      for (const med of res.data) {
        await API.put(`/medications/${med.id}/taken`, { date });
      }
      await fetchTakenDates();
      // --- Emit update event to server ---
      socket?.emit("medication-updated");
    } catch (err) {
      console.error("Error marking medication as taken", err);
    }
  };

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = getDaysInMonth(today);

  const takenThisMonth = Array.from(takenDates).filter(dateStr => {
    const d = new Date(dateStr);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthlyRate = Math.round((takenThisMonth.length / daysInMonth) * 100);

  const getStreakCount = () => {
    let streak = 0;
    let currentDate = new Date(today);
    while (takenDates.has(format(currentDate, 'yyyy-MM-dd')) && streak < 30) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  };

  useEffect(() => {
    fetchTakenDates();
  }, []);

  const handleSwitchRole = () => {
    const newRole = role === "patient" ? "caretaker" : "patient";
    setRole(newRole);
    if (onSwitchRole) onSwitchRole(newRole);
  };

  if (role === "caretaker") {
    return (
      <CaretakerDashboard
        onSwitchRole={handleSwitchRole}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
            </h2>
            <p className="text-white/90 text-lg">Ready to stay on track with your medication?</p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" className="text-black" onClick={handleSwitchRole}>
              Switch to Caretaker
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{getStreakCount()}</div>
            <div className="text-white/80">Day Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{takenDates.has(todayStr) ? "✓" : "○"}</div>
            <div className="text-white/80">Today's Status</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{monthlyRate}%</div>
            <div className="text-white/80">Monthly Rate</div>
          </div>  
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                {isTodaySelected ? "Today's Medication" : `Medication for ${format(selectedDate, 'MMMM d, yyyy')}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MedicationTracker 
                date={selectedDateStr}
                isTaken={isSelectedDateTaken}
                onMarkTaken={handleMarkTaken}
                isToday={isTodaySelected}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Medication Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                modifiersClassNames={{
                  selected: "bg-blue-600 text-white hover:bg-blue-700",
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isTaken = takenDates.has(dateStr);
                    const isPast = isBefore(date, startOfDay(today));
                    const isCurrentDay = isToday(date);
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        {isTaken && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {!isTaken && isPast && !isCurrentDay && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"></div>
                        )}
                      </div>
                    );
                  }
                }}
              />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Medication taken</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Missed medication</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;