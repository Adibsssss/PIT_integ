import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "../store/CartContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Helper to fix Django image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:8000${imagePath}`;
  };

  // Convert Django's decimal string to a usable JavaScript number
  const parsePrice = (priceStr) => parseFloat(priceStr || 0);

  const subtotal = cartItems.reduce(
    (total, item) => total + parsePrice(item.product_price) * item.quantity,
    0,
  );
  const networkFee = subtotal > 0 ? 150.0 : 0; // Updated to 150 PHP for realism
  const total = subtotal + networkFee;

  // The Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-[#94A3B8]" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-white mb-4">
          Your Cart is Empty
        </h2>
        <p className="font-mono text-[#94A3B8] mb-8">
          No devices have been added to your secure cart yet.
        </p>
        <Link to="/">
          <Button className="gap-2">
            Return to Storefront <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  // The Populated Cart State
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-[#F7931A]" />
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight">
          Secure Cart
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items Ledger */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6"
            >
              {/* Product Image fetched from Django */}
              <div className="w-24 h-24 shrink-0 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                {item.product_image ? (
                  <img
                    src={getImageUrl(item.product_image)}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Smartphone className="w-8 h-8 text-[#F7931A]/50" />
                )}
              </div>

              {/* Item Details */}
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-heading font-semibold text-lg text-white">
                  {item.product_name}
                </h3>
                <div className="font-mono text-xl font-medium text-[#FFD600] mt-2">
                  ₱
                  {parsePrice(item.product_price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* Controls: Quantity & Remove */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex items-center bg-black/50 border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      updateQuantity(item.product, item.quantity, -1)
                    }
                    className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono text-white text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product, item.quantity, 1)
                    }
                    className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm font-mono text-[#EA580C] hover:text-[#F7931A] transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-28">
            <CardHeader className="border-b border-white/10 pb-6">
              <CardTitle className="text-2xl">Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 font-mono text-sm">
              <div className="flex justify-between text-[#94A3B8]">
                <span>Subtotal</span>
                <span className="text-white">
                  ₱
                  {subtotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Shipping Fee</span>
                <span className="text-white">
                  ₱
                  {networkFee.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="border-t border-white/10 my-4 pt-4 flex justify-between items-end">
                <span className="text-[#94A3B8] font-body text-base">
                  Total Estimated
                </span>
                <span className="text-3xl font-bold text-[#FFD600]">
                  ₱
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="pt-6">
                <Button
                  className="w-full gap-2"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Button>
                <div className="mt-4 flex justify-center">
                  <Badge
                    variant="success"
                    className="bg-transparent border-none"
                  >
                    <ShieldCheck className="w-3 h-3 mr-1" /> Secure Transaction
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}