import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import API from "@/services/api";
import { toast } from "sonner";

type SignupForm = {
  username: string;
  password: string;
};

const Signup = () => {
  const { register, handleSubmit } = useForm<SignupForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: SignupForm) => {
    try {
      await API.post("/auth/signup", data);
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        <input
          {...register("username", { required: true })}
          placeholder="Username"
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
