import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/axios";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      login(response.data.accessToken, response.data.user);

      toast.success("Login successful");

      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password");
    }
  }

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      "
    >
      <Card
        className="
        w-full
        max-w-md
        "
      >
        <div
          className="
          text-center
          mb-6
          "
        >
          <h1
            className="
            text-3xl
            font-bold
            text-slate-900
            "
          >
            Nihon Inventory
          </h1>

          <p
            className="
            text-gray-500
            mt-2
            "
          >
            Vehicle Parts Management System
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="
          space-y-4
          "
        >
          <div>
            <label
              className="
              text-sm
              font-medium
              "
            >
              Email
            </label>

            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              className="
              text-sm
              font-medium
              "
            >
              Password
            </label>

            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="
            w-full
            "
          >
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}
