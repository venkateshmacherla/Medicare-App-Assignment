import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Meds Buddy</h1>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/login")}>Login</Button>
        <Button onClick={() => navigate("/signup")}>Signup</Button>
      </div>
    </div>
  );
};

export default Index;
