import React, { useState, useEffect } from "react";

import {

  Package,

  Search,

  MapPin,

  Clock,

  CreditCard,

  Receipt,

} from "lucide-react";

import api from "../services/api";

import {

  Card,

  CardHeader,

  CardTitle,

  CardContent,

} from "../components/ui/Card";

import { Input } from "../components/ui/Input";

import { Button } from "../components/ui/Button";

import { Badge } from "../components/ui/Badge";

import { Modal } from "../components/ui/Modal"; // <-- IMPORTED THE MODAL

import { Link } from "react-router-dom";



export default function TrackOrder() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");



  // NEW: State to track which order receipt is currently open

  const [selectedOrder, setSelectedOrder] = useState(null);



  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const token = localStorage.getItem("access_token");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await api.get("orders/", config);

        setOrders(response.data);

      } catch (error) {

        console.error("Failed to fetch order history:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);



  const formatPrice = (priceStr) => {

    return `₱${parseFloat(priceStr || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  };



  const getStatusBadge = (status) => {

    switch (status.toLowerCase()) {

      case "pending":

        return <Badge variant="warning">Awaiting Processing</Badge>;

      case "processing":

        return (

          <Badge

            variant="success"

            className="bg-blue-500/10 text-blue-500 border-blue-500/20"

          >

            Being Packed

          </Badge>

        );

      case "shipped":

        return (

          <Badge

            variant="success"

            className="bg-[#F7931A]/10 text-[#F7931A] border-[#F7931A]/20"

          >

            In Transit

          </Badge>

        );

      case "delivered":

        return <Badge variant="success">Secured & Delivered</Badge>;

      default:

        return <Badge variant="outline">{status}</Badge>;

    }

  };



  if (loading) {

    return (

      <div className="min-h-screen bg-[#030304] flex items-center justify-center text-[#F7931A] text-xl font-bold animate-pulse">

        Retrieving shipment data...

      </div>

    );

  }



  const filteredOrders = orders.filter((order) => {

    const formattedId = `VLT-${order.id.toString().padStart(6, "0")}`;

    return formattedId.toLowerCase().includes(searchQuery.toLowerCase());

  });



  return (

    <div className="max-w-4xl mx-auto px-6 py-24 min-h-[calc(100vh-80px)]">

      <div className="flex items-center gap-3 mb-8">

        <Package className="w-8 h-8 text-[#F7931A]" />

        <div>

          <h1 className="font-heading text-3xl font-bold text-white tracking-tight">

            Track Your Order

          </h1>

          <p className="font-mono text-sm text-[#94A3B8]">

            Locate your Konekta packages

          </p>

        </div>

      </div>



      <Card>

        <CardHeader className="border-b border-white/10 pb-4">

          <CardTitle className="text-xl">Active & Past Shipments</CardTitle>

        </CardHeader>

        <CardContent className="pt-6 space-y-6">

          <div className="flex gap-4">

            <Input

              placeholder="Enter your Order ID (e.g., #VLT-000123)"

              className="flex-grow"

              value={searchQuery}

              onChange={(e) => setSearchQuery(e.target.value)}

            />

            <Button className="gap-2 shrink-0">

              <Search className="w-4 h-4" /> Find Package

            </Button>

          </div>



          {filteredOrders.length === 0 ? (

            <div className="text-center py-12">

              <p className="font-mono text-[#94A3B8] mb-4">

                No packages found in the ledger.

              </p>

              <Link to="/products">

                <Button

                  variant="outline"

                  className="border-white/20 hover:bg-white/5"

                >

                  Browse Devices

                </Button>

              </Link>

            </div>

          ) : (

            <div className="space-y-4">

              {filteredOrders.map((order) => (

                <div

                  key={order.id}

                  onClick={() => setSelectedOrder(order)} // <-- Opens the modal

                  className="p-6 border border-white/10 bg-white/5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#F7931A]/50 hover:bg-white/10 transition-all cursor-pointer group"

                >

                  <div className="flex items-center gap-4 w-full md:w-auto">

                    <div className="w-12 h-12 bg-[#FFD600]/20 rounded-full flex shrink-0 items-center justify-center border border-[#FFD600]/30 group-hover:scale-110 transition-transform">

                      <MapPin className="w-5 h-5 text-[#FFD600]" />

                    </div>

                    <div>

                      <div className="flex items-center gap-3 mb-1">

                        <p className="font-mono text-xs text-[#94A3B8]">

                          Order #VLT-{order.id.toString().padStart(6, "0")}

                        </p>

                        <p className="font-mono text-[10px] text-[#94A3B8] bg-black/50 px-2 py-0.5 rounded">

                          {new Date(order.order_date).toLocaleDateString()}

                        </p>

                      </div>

                      <p className="font-heading font-semibold text-white truncate max-w-[200px] sm:max-w-xs group-hover:text-[#F7931A] transition-colors">

                        {order.items?.length} item

                        {order.items?.length !== 1 ? "s" : ""} inside

                      </p>

                      <p className="font-mono text-[#F7931A] text-sm mt-1">

                        Total: {formatPrice(order.total_amount)}

                      </p>

                    </div>

                  </div>

                  <div className="shrink-0 w-full md:w-auto text-right md:text-left flex flex-col items-end md:items-center gap-2">

                    {getStatusBadge(order.status)}

                    <span className="text-[10px] font-mono text-[#94A3B8] flex items-center gap-1 group-hover:text-white transition-colors">

                      <Receipt className="w-3 h-3" /> Click for details

                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </CardContent>

      </Card>



      {/* --- THE RECEIPT MODAL --- */}

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)}>

        {selectedOrder && (

          <div className="space-y-6">

            {/* Modal Header */}

            <div className="flex justify-between items-start border-b border-white/10 pb-4">

              <div>

                <h2 className="font-heading text-2xl font-bold text-white flex items-center gap-2">

                  <Receipt className="w-6 h-6 text-[#F7931A]" /> Digital Receipt

                </h2>

                <p className="font-mono text-sm text-[#94A3B8] mt-1">

                  #VLT-{selectedOrder.id.toString().padStart(6, "0")}

                </p>

              </div>

              <div className="text-right">

                {getStatusBadge(selectedOrder.status)}

                <p className="font-mono text-xs text-[#94A3B8] mt-2 flex items-center justify-end gap-1">

                  <Clock className="w-3 h-3" />

                  {new Date(selectedOrder.order_date).toLocaleTimeString([], {

                    hour: "2-digit",

                    minute: "2-digit",

                  })}

                </p>

              </div>

            </div>



            {/* Shipping Info */}

            <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">

              <h3 className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">

                <MapPin className="w-4 h-4 text-[#FFD600]" /> Destination Node

              </h3>

              <p className="font-body text-white text-sm">

                {selectedOrder.shipping_address}

              </p>

            </div>



            {/* Line Items (The Body of the ERD) */}

            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">

              <h3 className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider mb-2">

                Hardware Authorized

              </h3>

              {selectedOrder.items?.map((item) => (

                <div

                  key={item.id}

                  className="flex justify-between items-center text-sm font-body border-b border-white/5 pb-2"

                >

                  <div className="flex gap-3">

                    <span className="font-mono text-[#94A3B8]">

                      {item.quantity}x

                    </span>

                    <span className="text-white">{item.product_name}</span>

                  </div>

                  {/* Shows the locked-in price from when they bought it! */}

                  <span className="font-mono text-[#94A3B8]">

                    {formatPrice(item.price_at_purchase)}

                  </span>

                </div>

              ))}

            </div>



            {/* Grand Total */}

            <div className="border-t border-white/10 pt-4 flex flex-col gap-2">

              <div className="flex justify-between items-center text-sm">

                <span className="font-mono text-[#94A3B8]">

                  Network Fee (Shipping)

                </span>

                <span className="font-mono text-[#94A3B8]">

                  {formatPrice(150.0)}

                </span>

              </div>

              <div className="flex justify-between items-end">

                <span className="font-body text-[#94A3B8] uppercase text-xs tracking-wider">

                  Final Total

                </span>

                <span className="text-3xl font-bold text-[#FFD600] flex items-center gap-2">

                  <CreditCard className="w-6 h-6 text-[#FFD600]/50" />

                  {formatPrice(selectedOrder.total_amount)}

                </span>

              </div>

            </div>



            <Button className="w-full" onClick={() => setSelectedOrder(null)}>

              Close Ledger

            </Button>

          </div>

        )}

      </Modal>

    </div>

  );

}