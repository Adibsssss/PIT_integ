import React, { useState } from "react";
import { ShieldCheck, Mail, Key, ArrowRight } from "lucide-react";

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
import { useAuth } from "../store/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { login, isAdmin } = useAuth(); // Add isAdmin here
  const navigate = useNavigate();

  const gridBackgroundStyle = {
    backgroundSize: "50px 50px",
    backgroundImage: `
      linear-gradient(to right, rgba(30, 41, 59, 0.5) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(30, 41, 59, 0.5) 1px, transparent 1px)
    `,
    maskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const result = await login(email, password);

    if (result.success) {
      // The login was successful, now we check the state that was just updated
      // If the user is an admin, send to dashboard, otherwise send to home
      if (result.isAdmin || isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setErrorMsg(result.error);
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
            variant="success"
            className="bg-white/5 backdrop-blur-sm border-white/10"
          >
            <ShieldCheck className="w-3 h-3 mr-1" /> Secure Login
          </Badge>
        </div>

        <Card>
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-[#EA580C]/20 border border-[#EA580C]/50 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(234,88,12,0.2)]">
              <Key className="w-6 h-6 text-[#F7931A]" />
            </div>
            <CardTitle className="text-3xl tracking-tight">
              Welcome Back
            </CardTitle>
            <p className="text-sm font-mono text-[#94A3B8] mt-2">
              Sign in to your Konekta account
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#F7931A] transition-colors" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative group">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#F7931A] transition-colors" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Show error message if login fails */}
              {errorMsg && (
                <p className="text-[#EA580C] text-xs font-mono text-center">
                  {errorMsg}
                </p>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-4 pb-8">
              <Button type="submit" className="w-full gap-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-sm text-[#94A3B8] font-mono text-center">
                New to Konekta?{" "}
                <Link
                  to="/register"
                  className="text-white hover:text-[#F7931A] transition-colors underline decoration-white/30 hover:decoration-[#F7931A]"
                >
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
