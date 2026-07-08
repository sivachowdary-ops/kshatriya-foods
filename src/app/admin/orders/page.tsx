"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, Trash2, Loader2, X, MessageCircle } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error.message);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Failed to update status: " + error.message);
    } else {
      // Optimistic state update to avoid full reload flickers
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm(`Are you sure you want to delete order #${orderId}? This cannot be undone.`)) {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        alert("Failed to delete order: " + error.message);
      } else {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(null);
        }
      }
    }
  };

  const filteredOrders = statusFilter === "All"
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "text-yellow-600 border-yellow-500/30 bg-yellow-50";
      case "Confirmed": return "text-blue-600 border-blue-500/30 bg-blue-50";
      case "Shipped": return "text-purple-600 border-purple-500/30 bg-purple-50";
      case "Delivered": return "text-green-600 border-green-500/30 bg-green-50";
      default: return "text-gray-600 border-gray-500/30 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary-maroon">Manage Orders</h1>
          <p className="text-sm text-text-secondary mt-1">Track and manage customer WhatsApp order requests</p>
        </div>
        
        <div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-bg-secondary border border-primary-maroon/20 rounded px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary-maroon shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary-maroon animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-bg-secondary border border-primary-maroon/10 rounded-xl p-12 text-center shadow-sm">
          <p className="text-lg text-text-secondary">No orders found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block bg-bg-secondary border border-primary-maroon/10 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-bg-alternate/50 border-b border-primary-maroon/10 text-text-primary/70 text-sm">
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Items</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-primary-maroon/5">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-bg-alternate/10 transition-colors">
                      <td className="p-4 font-heading font-bold text-primary-maroon">#{order.id}</td>
                      <td className="p-4 text-text-secondary">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="p-4 text-text-primary">
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-xs text-text-secondary">{order.customer_phone}</p>
                      </td>
                      <td className="p-4 text-text-secondary">{order.order_items?.length || 0} items</td>
                      <td className="p-4 font-semibold text-text-primary">₹{order.total_amount}</td>
                      <td className="p-4">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1 rounded-full border focus:outline-none transition-colors ${getStatusColor(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-text-secondary hover:text-primary-maroon transition-colors inline-flex rounded-full hover:bg-bg-alternate"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-text-secondary hover:text-red-500 transition-colors inline-flex rounded-full hover:bg-bg-alternate"
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View (Hidden on desktop) */}
          <div className="block md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-bg-secondary border border-primary-maroon/10 rounded-xl p-5 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-center pb-3 border-b border-primary-maroon/5">
                  <div>
                    <span className="font-heading font-bold text-primary-maroon text-lg">#{order.id}</span>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border focus:outline-none ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Customer:</span>
                    <span className="font-semibold text-text-primary">{order.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">WhatsApp:</span>
                    <a 
                      href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-maroon hover:underline font-medium flex items-center gap-1"
                    >
                      {order.customer_phone}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Items:</span>
                    <span className="text-text-primary">{order.order_items?.length || 0} items</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-text-secondary">Total:</span>
                    <span className="font-bold text-text-primary text-base">₹{order.total_amount}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-primary-maroon/5">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-primary-maroon/20 text-text-primary font-medium text-xs rounded hover:bg-bg-alternate transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Details
                  </button>
                  <button 
                    onClick={() => handleDeleteOrder(order.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-red-200 text-red-600 font-medium text-xs rounded hover:bg-red-50/50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-bg-secondary border border-primary-maroon/10 rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-primary-maroon/10 mb-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-primary-maroon flex items-center gap-2">
                  Order Details
                  <span className="text-sm font-normal text-text-secondary">#{selectedOrder.id}</span>
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full hover:bg-bg-alternate text-text-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary-maroon mb-1.5">Customer details</h3>
                  <p className="font-bold text-text-primary text-base">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-text-secondary">{selectedOrder.customer_phone}</p>
                  <a 
                    href={`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-full mt-2.5 hover:bg-[#128C7E] transition-colors font-semibold"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary-maroon mb-1">Status</h3>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border focus:outline-none transition-colors ${getStatusColor(selectedOrder.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary-maroon mb-1.5">Shipping Address</h3>
                <p className="text-sm text-text-primary leading-relaxed bg-bg-alternate/55 p-3 rounded-lg border border-primary-maroon/5">
                  {selectedOrder.delivery_address}
                  <br />
                  <span className="font-medium">{selectedOrder.state} - {selectedOrder.pincode}</span>
                </p>
              </div>
            </div>

            <div className="border-t border-primary-maroon/10 pt-5 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary-maroon mb-3">Order Items</h3>
              <div className="divide-y divide-primary-maroon/5">
                {selectedOrder.order_items?.map((item: any, i: number) => (
                  <div key={i} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-text-primary">{item.product_name}</p>
                      {item.tier_label && (
                        <p className="text-xs text-text-secondary">Size: {item.tier_label}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-text-primary">₹{item.price} x {item.quantity}</p>
                      <p className="font-bold text-primary-maroon">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-primary-maroon/10 pt-4 flex justify-between items-center">
              <span className="font-bold text-text-primary text-base">Grand Total</span>
              <span className="font-heading font-extrabold text-2xl text-primary-maroon">₹{selectedOrder.total_amount}</span>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-primary-maroon/10 mt-6">
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 font-medium text-xs transition-colors"
              >
                Delete Order
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-primary-maroon text-white rounded hover:bg-maroon-dark font-medium text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
