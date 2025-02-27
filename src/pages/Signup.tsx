// src/pages/Signup.jsx
import { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    email: "",
    privateKey: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );
      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (error: unknown) {
      // Explicitly define error as 'unknown'
      if (axios.isAxiosError(error)) {
        console.error("Signup failed:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="User ID"
            value={formData.userId}
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
          />
          <Input
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            placeholder="Private Key"
            value={formData.privateKey}
            onChange={(e) =>
              setFormData({ ...formData, privateKey: e.target.value })
            }
          />
          <Button type="submit" className="w-full mt-4">
            Signup
          </Button>
        </form>
      </div>
    </div>
  );
}
