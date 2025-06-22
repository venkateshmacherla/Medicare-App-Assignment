import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import API from "@/services/api";
import { toast } from "sonner";

type LoginForm = {
  username: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await API.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

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
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
