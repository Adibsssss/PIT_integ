import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Smartphone,
  Package,
  AlertCircle,
  UploadCloud,
  LayoutDashboard,
  ShoppingBag,
  Activity,
  TrendingUp,
  CheckCircle,
  Truck,
  Clock,
  Receipt, // <-- Added Receipt icon for the orders table
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import api from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview"); // overview | inventory | orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false); // For Inventory
  const [selectedOrder, setSelectedOrder] = useState(null); // For Orders Receipt Modal
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    status: "In Stock",
    specs: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [productRes, orderRes] = await Promise.all([
        api.get("products/"),
        api.get("orders/", config),
      ]);

      setProducts(productRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // KPIs & ANALYTICS CALCULATIONS
  // ==========================================
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

  const activeOrdersCount = orders.filter(
    (o) => o.status === "Pending" || o.status === "Processing",
  ).length;
  const lowStockCount = products.filter(
    (p) => p.status === "Low Stock" || p.status === "Out of Stock",
  ).length;

  const revenueData = orders
    .slice(0, 7)
    .reverse()
    .map((order, i) => ({
      name: `Order ${order.id}`,
      revenue: parseFloat(order.total_amount),
    }));

  // ==========================================
  // ORDER MANAGEMENT LOGIC
  // ==========================================
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.patch(
        `orders/${orderId}/status/`,
        { status: newStatus },
        config,
      );
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(
        "Failed to update status. Did you add the PATCH endpoint in Django?",
      );
    }
  };

  const formatPrice = (priceStr) => {
    return `₱${parseFloat(priceStr || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // ==========================================
  // INVENTORY LOGIC
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPrice = formData.price.toString().replace(/[₱,\s]/g, "");
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", cleanPrice);
    submitData.append("status", formData.status);
    submitData.append("specs", formData.specs);
    submitData.append("description", formData.description);
    if (imageFile) submitData.append("image", imageFile);

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (editingId) {
        await api.put(`products/${editingId}/`, submitData, config);
      } else {
        await api.post("products/", submitData, config);
      }
      fetchDashboardData();
      closeModal();
    } catch (error) {
      alert(`Error saving! ${JSON.stringify(error.response?.data)}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this device from the database?")) {
      try {
        await api.delete(`products/${id}/`);
        fetchDashboardData();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const openModal = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        status: product.status,
        specs: product.specs,
        description: product.description,
      });
      setEditingId(product.id);
    } else {
      setFormData({
        name: "",
        price: "",
        status: "In Stock",
        specs: "",
        description: "",
      });
      setEditingId(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImageFile(null);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#030304]">
        <div className="animate-pulse flex flex-col items-center gap-4 text-[#F7931A]">
          <Activity className="w-12 h-12" />
          <p className="font-mono text-sm tracking-widest uppercase">
            Syncing Command Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#030304] text-white py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER & TABS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
              <LayoutDashboard className="text-[#F7931A]" /> Command Center
            </h1>
            <p className="font-mono text-sm text-[#94A3B8] mt-2">
              Live Konekta MySQL Feed
            </p>
          </div>

          <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-sm font-mono rounded-md transition-all ${activeTab === "overview" ? "bg-[#F7931A] text-white" : "text-[#94A3B8] hover:text-white"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 text-sm font-mono rounded-md transition-all ${activeTab === "orders" ? "bg-[#F7931A] text-white" : "text-[#94A3B8] hover:text-white"}`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 text-sm font-mono rounded-md transition-all ${activeTab === "inventory" ? "bg-[#F7931A] text-white" : "text-[#94A3B8] hover:text-white"}`}
            >
              Inventory
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6 flex-col animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-white/5 to-transparent border-white/10">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-xs text-[#94A3B8] uppercase">
                        Gross Revenue
                      </p>
                      <h3 className="text-3xl font-bold text-[#FFD600] mt-2">
                        ₱
                        {totalRevenue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </h3>
                    </div>
                    <div className="p-3 bg-[#FFD600]/10 rounded-lg">
                      <TrendingUp className="text-[#FFD600]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white/5 to-transparent border-white/10">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-xs text-[#94A3B8] uppercase">
                        Active Orders
                      </p>
                      <h3 className="text-3xl font-bold text-blue-400 mt-2">
                        {activeOrdersCount}
                      </h3>
                    </div>
                    <div className="p-3 bg-blue-400/10 rounded-lg">
                      <ShoppingBag className="text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white/5 to-transparent border-white/10">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-xs text-[#94A3B8] uppercase">
                        Attention Needed
                      </p>
                      <h3 className="text-3xl font-bold text-red-400 mt-2">
                        {lowStockCount} Devices
                      </h3>
                    </div>
                    <div className="p-3 bg-red-400/10 rounded-lg">
                      <AlertCircle className="text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              <Card className="border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm font-mono text-[#94A3B8]">
                    Recent Revenue Flow
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#030304",
                          borderColor: "#F7931A",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#F7931A"
                        strokeWidth={3}
                        dot={{ fill: "#F7931A", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 2. ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in duration-500">
            <Card className="overflow-hidden border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 font-mono text-xs uppercase tracking-wider text-[#94A3B8]">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer Info</th>
                      <th className="p-4">Total Value</th>
                      <th className="p-4 text-right">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-8 text-center text-[#94A3B8]"
                        >
                          No orders logged in the database yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4 font-mono text-white">
                            #VLT-{order.id.toString().padStart(6, "0")}
                          </td>
                          <td className="p-4 font-mono text-sm text-[#94A3B8]">
                            {new Date(order.order_date).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <p className="font-body text-sm text-white">
                              {order.user_email || "N/A"}
                            </p>
                            <p className="font-mono text-xs text-[#94A3B8] max-w-[200px] truncate">
                              {order.shipping_address}
                            </p>
                          </td>
                          <td className="p-4 font-mono text-[#FFD600]">
                            ₱{parseFloat(order.total_amount).toLocaleString()}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusChange(order.id, e.target.value)
                                }
                                className={`bg-[#030304] border rounded px-3 py-1.5 text-xs font-mono font-bold outline-none cursor-pointer
                                  ${
                                    order.status === "Pending"
                                      ? "border-yellow-500/50 text-yellow-500"
                                      : order.status === "Processing"
                                        ? "border-blue-500/50 text-blue-500"
                                        : order.status === "Shipped"
                                          ? "border-[#F7931A]/50 text-[#F7931A]"
                                          : "border-green-500/50 text-green-500"
                                  }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>

                              {/* NEW: View Receipt Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="border-white/10 hover:bg-white/10 px-2"
                                title="View Details"
                              >
                                <Receipt className="w-4 h-4 text-[#94A3B8]" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 3. INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div className="animate-in fade-in duration-500 space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openModal()} className="gap-2 shrink-0">
                <Plus className="w-4 h-4" /> Add New Device
              </Button>
            </div>
            <Card className="overflow-hidden border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 font-mono text-xs uppercase tracking-wider text-[#94A3B8]">
                      <th className="p-4">Device Name</th>
                      <th className="p-4">Specs</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {products.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-8 text-center text-[#94A3B8]"
                        >
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          No devices found.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4 font-heading font-medium text-white flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 shrink-0 overflow-hidden">
                              {product.image ? (
                                <img
                                  src={
                                    product.image.startsWith("http")
                                      ? product.image
                                      : `http://localhost:8000${product.image}`
                                  }
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Smartphone className="w-5 h-5 text-[#F7931A]" />
                              )}
                            </div>
                            {product.name}
                          </td>
                          <td className="p-4 font-mono text-sm text-[#94A3B8]">
                            {product.specs}
                          </td>
                          <td className="p-4 font-mono text-sm text-[#FFD600]">
                            ₱{product.price}
                          </td>
                          <td className="p-4">
                            <Badge
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
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openModal(product)}
                                className="border-white/10 hover:bg-white/10"
                              >
                                <Edit className="w-4 h-4 text-[#94A3B8]" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                                className="border-white/10 hover:bg-red-500/20 hover:border-red-500/50"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* =========================================
          MODALS
      ========================================= */}

      {/* INVENTORY MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="font-heading text-2xl font-bold text-white">
              {editingId ? "Edit Device Details" : "Add New Device"}
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-[#94A3B8] mb-1">
                Device Image
              </label>
              <label className="flex items-center justify-center w-full px-4 py-3 bg-[#030304] border border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#F7931A]/50 transition-colors group">
                <div className="flex items-center gap-2 text-sm text-[#94A3B8] group-hover:text-[#F7931A]">
                  <UploadCloud className="w-5 h-5" />
                  <span>
                    {imageFile ? imageFile.name : "Click to upload an image"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <label className="block font-mono text-xs text-[#94A3B8] mb-1">
                Device Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-[#94A3B8] mb-1">
                  Price (₱)
                </label>
                <Input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-[#94A3B8] mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-[#030304] border border-white/10 rounded-lg px-4 py-2.5 text-white font-body focus:border-[#F7931A] outline-none"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs text-[#94A3B8] mb-1">
                Hardware Specs
              </label>
              <Input
                type="text"
                name="specs"
                value={formData.specs}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-[#94A3B8] mb-1">
                Marketing Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full bg-[#030304] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F7931A] outline-none resize-none"
                required
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/10"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full gap-2">
              {editingId ? "Save Changes" : "Save to Database"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ORDER DETAILS MODAL */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex justify-between items-start">
              <div>
                <h2 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                  <Receipt className="w-6 h-6 text-[#F7931A]" /> Order Details
                </h2>
                <p className="font-mono text-sm text-[#94A3B8] mt-1">
                  #VLT-{selectedOrder.id.toString().padStart(6, "0")}
                </p>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    selectedOrder.status === "Pending" ? "warning" : "success"
                  }
                >
                  {selectedOrder.status}
                </Badge>
                <p className="font-mono text-xs text-[#94A3B8] mt-2 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(selectedOrder.order_date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2">
              <h3 className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-[#FFD600]" /> Customer
                & Shipping
              </h3>
              <p className="font-body text-white text-sm">
                <strong>Email:</strong> {selectedOrder.user_email}
              </p>
              <p className="font-body text-white text-sm">
                <strong>Address:</strong> {selectedOrder.shipping_address}
              </p>
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              <h3 className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider mb-2">
                Items Purchased
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
                  <span className="font-mono text-[#94A3B8]">
                    {formatPrice(item.price_at_purchase)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-mono text-[#94A3B8]">Shipping Fee</span>
                <span className="font-mono text-[#94A3B8]">
                  {formatPrice(150.0)}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-body text-[#94A3B8] uppercase text-xs tracking-wider">
                  Grand Total
                </span>
                <span className="text-3xl font-bold text-[#FFD600]">
                  {formatPrice(selectedOrder.total_amount)}
                </span>
              </div>
            </div>

            <Button className="w-full" onClick={() => setSelectedOrder(null)}>
              Close Details
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
