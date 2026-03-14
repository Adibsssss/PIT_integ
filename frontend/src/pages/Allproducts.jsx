import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  ShoppingCart,
  Smartphone,
  CheckCircle2,
  Truck,
  CreditCard,
  Lock, // Added lock icon
} from "lucide-react";
import { useCart } from "../store/CartContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { useNavigate } from "react-router-dom";

export default function Allproducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false); // Protect actions

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:8000${imagePath}`;
  };

  const checkAuthAndProceed = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setSelectedProduct(null);
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030304] flex items-center justify-center text-[#F7931A] text-xl font-bold animate-pulse">
        Loading devices...
      </div>
    );
  }

  // SUPERCHARGED SEARCH LOGIC
  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.specs.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#030304] text-white font-body selection:bg-[#F7931A]/30 py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            All Devices
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="relative w-full max-w-md group flex items-center">
              <Search className="absolute left-3 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#F7931A] transition-colors z-10" />
              <Input
                type="text"
                placeholder="Search for models, specs, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4 font-mono text-sm text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-[#F7931A]" /> Cash on Delivery
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#FFD600]" /> Official
                Warranty
              </span>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center text-[#94A3B8] font-mono py-12">
            No devices matched your search for "{searchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                interactive
                className="p-8 flex flex-col h-full group"
              >
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-transparent group-hover:border-[#F7931A] rounded-tl-2xl transition-colors duration-300" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-transparent group-hover:border-[#F7931A] rounded-br-2xl transition-colors duration-300" />

                <div className="w-full h-48 bg-gradient-to-br from-black/60 to-white/5 rounded-xl mb-6 flex items-center justify-center border border-white/5 relative overflow-hidden group-hover:border-[#F7931A]/30 transition-colors">
                  {product.image ? (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Smartphone className="w-16 h-16 text-white/20 group-hover:text-[#F7931A]/40 transition-colors duration-500 group-hover:scale-110" />
                  )}
                </div>

                <div className="flex-grow flex flex-col mt-4">
                  <h3 className="font-heading font-semibold text-xl text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="font-mono text-sm text-[#94A3B8] mb-4 flex-grow">
                    {product.specs}
                  </p>
                  <div className="flex items-center justify-between gap-4 mt-auto mb-6">
                    <span className="font-mono text-xl font-medium text-[#FFD600] truncate">
                      {formatPrice(product.price)}
                    </span>
                    <Badge
                      className="shrink-0 whitespace-nowrap"
                      variant={
                        product.status === "In Stock"
                          ? "success"
                          : product.status === "Low Stock"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={() => setSelectedProduct(product)}
                >
                  <ShoppingCart className="w-4 h-4" /> View Details
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 border-b border-white/10 pb-6">
              <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center shadow-lg">
                {selectedProduct.image ? (
                  <img
                    src={getImageUrl(selectedProduct.image)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Smartphone className="w-10 h-10 text-white/20" />
                )}
              </div>
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-1">
                  {selectedProduct.name}
                </h2>
                <p className="font-mono text-sm text-[#94A3B8]">
                  {selectedProduct.specs}
                </p>
              </div>
            </div>
            <p className="font-body text-[#94A3B8] leading-relaxed">
              {selectedProduct.description}
            </p>
            <div className="flex items-center justify-between pt-4">
              <span className="font-mono text-3xl font-bold text-[#FFD600]">
                {formatPrice(selectedProduct.price)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  if (checkAuthAndProceed()) {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }
                }}
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </Button>

              <Button
                className="w-full gap-2"
                onClick={async () => {
                  if (checkAuthAndProceed()) {
                    await addToCart(selectedProduct);
                    setSelectedProduct(null);
                    navigate("/checkout");
                  }
                }}
              >
                <CreditCard className="w-4 h-4" /> Buy Now
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
              You need to be signed in to add items to your secure vault and
              complete transactions.
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
            <Button className="w-full" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}