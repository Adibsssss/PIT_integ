import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- Added useNavigate
import { Shield, Mail, Key, User, ArrowRight } from "lucide-react";
import api from "../services/api"; // <-- Added your API bridge

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export default function Register() {
  const navigate = useNavigate(); // For redirecting after success

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState(""); // To show Django errors
  const [isLoading, setIsLoading] = useState(false);

  const gridBackgroundStyle = {
    backgroundSize: "50px 50px",
    backgroundImage: `
      linear-gradient(to right, rgba(30, 41, 59, 0.5) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(30, 41, 59, 0.5) 1px, transparent 1px)
    `,
    maskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // 1. Frontend Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Send the data to Django
      // Note: Make sure your Django backend expects these exact field names!
      const response = await api.post("users/register/", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // 3. Success! Send them to the login page
      alert("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.response?.data);

      // Try to extract a readable error message from Django
      const data = error.response?.data;
      if (data && typeof data === "object") {
        // Grab the first error message Django sends back (e.g., "email: This email is already in use.")
        const firstKey = Object.keys(data)[0];
        setErrorMsg(`${firstKey}: ${data[firstKey]}`);
      } else {
        setErrorMsg(
          "Registration failed. Please check your information and try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F7931A] opacity-5 blur-[100px] rounded-full pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={gridBackgroundStyle}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Badge
            variant="warning"
            className="bg-white/5 backdrop-blur-sm border-white/10"
          >
            <Shield className="w-3 h-3 mr-1" /> Secure Registration
          </Badge>
        </div>

        <Card>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl tracking-tight">
              Create Account
            </CardTitle>
            <p className="text-sm font-mono text-[#94A3B8] mt-2">
              Join Konekta today
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#F7931A] transition-colors" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#F7931A] transition-colors" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative group">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#F7931A] transition-colors" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative group">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#F7931A] transition-colors" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Display Errors Here */}
              {errorMsg && (
                <p className="text-[#EA580C] text-xs font-mono text-center bg-[#EA580C]/10 py-2 rounded border border-[#EA580C]/20">
                  {errorMsg}
                </p>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-4 pb-8">
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}{" "}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-sm text-[#94A3B8] font-mono text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white hover:text-[#F7931A] transition-colors underline decoration-white/30 hover:decoration-[#F7931A]"
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
