import React from "react";

import { Link, useLocation, Navigate } from "react-router-dom";

import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "../components/ui/Card";

import { Button } from "../components/ui/Button";


export default function Success() {

  const location = useLocation();

  const orderData = location.state?.orderData;


  // If someone tries to visit /success directly without checking out, boot them to home

  if (!orderData) {

    return <Navigate to="/" replace />;

  }


  // Keep your fake hash for the aesthetic, but seed it with the order ID so it's consistent

  const txHash = `0x${Math.abs(Math.sin(orderData.id) * 100000)

    .toString(16)

    .padEnd(40, "0")

    .replace(".", "")}`;


  return (

    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD600] opacity-5 blur-[120px] rounded-full pointer-events-none" />


      <div className="relative z-10 w-full max-w-lg text-center space-y-8">

        <div className="flex justify-center">

          <div className="relative">

            <div className="absolute inset-0 bg-[#FFD600] blur-[30px] opacity-20 rounded-full animate-pulse" />

            <CheckCircle className="w-24 h-24 text-[#FFD600] relative z-10" />

          </div>

        </div>


        <div>

          <h1 className="font-heading text-4xl font-bold text-white tracking-tight mb-2">

            Transaction Verified

          </h1>

          <p className="font-body text-[#94A3B8] text-lg">

            Your hardware has been secured and is preparing for dispatch.

          </p>

        </div>


        <Card className="text-left border-[#FFD600]/20 shadow-[0_0_30px_-10px_rgba(255,214,0,0.1)]">

          <CardContent className="pt-6 space-y-4">

            <div className="flex items-center gap-2 text-[#FFD600] mb-4">

              <ShieldCheck className="w-5 h-5" />

              <span className="font-mono text-sm font-bold uppercase tracking-wider">

                Proof of Purchase

              </span>

            </div>


            <div className="space-y-1">

              <span className="text-xs font-mono text-[#94A3B8] uppercase">

                Network Block (Order ID)

              </span>

              <p className="font-mono text-white text-sm">

                #VLT-{orderData.id.toString().padStart(6, "0")}

              </p>

            </div>


            <div className="space-y-1">

              <span className="text-xs font-mono text-[#94A3B8] uppercase">

                Total Authorized

              </span>

              <p className="font-mono text-white text-sm">

                ₱

                {parseFloat(orderData.total_amount).toLocaleString(undefined, {

                  minimumFractionDigits: 2,

                })}

              </p>

            </div>


            <div className="space-y-1">

              <span className="text-xs font-mono text-[#94A3B8] uppercase">

                Transaction Hash

              </span>

              <p className="font-mono text-[#F7931A] text-xs truncate">

                {txHash}

              </p>

            </div>

          </CardContent>

        </Card>


        <Link to="/" className="inline-block mt-8">

          <Button className="gap-2">

            Return to Storefront <ArrowRight className="w-4 h-4" />

          </Button>

        </Link>

      </div>

    </div>

  );

}

