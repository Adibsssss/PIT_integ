import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Smartphone,
  LayoutDashboard,
  LogOut,
  Lock, // <-- Imported the Lock icon for the new Auth modal
} from "lucide-react";
import { Button } from "../ui/Button";
import { useCart } from "../../store/CartContext";
import { useAuth } from "../../store/AuthContext";
import { Modal } from "../ui/Modal";

export function Navbar() {
  const { cartItemCount } = useCart();
  const { user, isAdmin, logout } = useAuth();

  // Modal States
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // <-- NEW: State for Auth Modal

  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* --- ADMIN DASHBOARD NAVBAR --- */}
      {isDashboard ? (
        <nav className="sticky top-0 z-40 w-full bg-[#030304]/80 backdrop-blur-lg border-b border-[#F7931A]/20">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#EA580C]/20 border border-[#EA580C]/50 rounded-lg p-2">
                <LayoutDashboard className="w-6 h-6 text-[#F7931A]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg tracking-tight text-white leading-none">
                  Konekta
                </span>
                <span className="font-mono text-[10px] text-[#F7931A] uppercase tracking-widest mt-1">
                  Command Center
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="hidden sm:block font-mono text-xs text-[#94A3B8]">
                Active Session:{" "}
                <span className="text-white">{user?.username || "Admin"}</span>
              </span>
              <Link
                to="/"
                className="text-sm font-body font-medium text-[#94A3B8] hover:text-white transition-colors"
              >
                View Storefront
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-white/10 hover:bg-white/5 text-[#94A3B8] hover:text-white"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </div>
        </nav>
      ) : (
        /* --- PUBLIC STOREFRONT NAVBAR --- */
        <nav className="sticky top-0 z-40 w-full bg-[#030304]/80 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-[#EA580C]/20 border border-[#EA580C]/50 rounded-lg p-2 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                <Smartphone className="w-6 h-6 text-[#F7931A]" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-white">
                Konekta
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 font-mono text-sm text-[#94A3B8]">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link
                to="/products"
                className="hover:text-white transition-colors"
              >
                Products
              </Link>
              <Link
                to="/track-order"
                className="hover:text-white transition-colors"
              >
                Track Order
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {isAdmin ? (
                <Link
                  to="/dashboard"
                  className="hidden sm:flex text-sm font-body font-medium text-[#F7931A] hover:text-[#FFD600] transition-colors"
                >
                  Admin Panel
                </Link>
              ) : user ? (
                <div className="hidden sm:flex items-center gap-4 border border-white/10 rounded-full px-4 py-1.5 bg-white/5">
                  <span className="text-sm font-body font-medium text-[#94A3B8]">
                    {user.name || user.username}
                  </span>
                  <div className="w-[1px] h-4 bg-white/10"></div>
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="text-[#94A3B8] hover:text-[#EA580C] transition-colors flex items-center"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex text-sm font-body font-medium text-white/70 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* UPDATED CART LINK: Intercepts click if user is not logged in */}
              <Link
                to={user ? "/cart" : "#"}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault(); // Stop them from navigating
                    setShowAuthModal(true); // Show the login prompt instead
                  }
                }}
                className="relative group flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 group-hover:text-[#F7931A] transition-colors" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-[10px] font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      )}

      {/* =========================================
          MODALS (Placed safely outside the layout)
      ========================================= */}

      {/* --- SHARED LOGOUT MODAL --- */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <div className="text-center space-y-6 py-4">
          <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold text-white">
              End Session?
            </h2>
            <p className="font-body text-[#94A3B8]">
              Are you sure you want to sign out? You'll need to log back in to
              access your account or the dashboard.
            </p>
          </div>
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="w-full border-white/10 hover:bg-white/5"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={handleLogoutConfirm}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- NEW: AUTHENTICATION REQUIRED MODAL --- */}
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <div className="text-center space-y-6 py-4">
          <div className="mx-auto w-16 h-16 bg-[#F7931A]/10 border border-[#F7931A]/20 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#F7931A]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold text-white">
              Authentication Required
            </h2>
            <p className="font-body text-[#94A3B8]">
              You need to be signed in to view your secure cart and complete
              transactions.
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              className="w-full border-white/10 hover:bg-white/5"
              onClick={() => setShowAuthModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setShowAuthModal(false);
                navigate("/login");
              }}
            >
              Sign In
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
