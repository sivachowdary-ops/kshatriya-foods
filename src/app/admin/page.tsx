"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, ShoppingBag, IndianRupee, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch active products count
        const { count: prodCount, error: prodError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);
        
        if (!prodError) {
          setProductsCount(prodCount || 0);
        }

        // 2. Fetch total orders count
        const { count: orderCount, error: orderCountError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        if (!orderCountError) {
          setOrdersCount(orderCount || 0);
        }

        // 3. Fetch total revenue
        const { data: allOrders, error: revenueError } = await supabase
          .from("orders")
          .select("total_amount");

        if (!revenueError && allOrders) {
          const revenue = allOrders.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0);
          setTotalRevenue(revenue);
        }

        // 4. Fetch real recent orders
        const { data, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
        
        if (!orderError) {
          setRecentOrders(data || []);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20";
      case "Confirmed": return "bg-blue-500/10 text-blue-600 border border-blue-500/20";
      case "Shipped": return "bg-purple-500/10 text-purple-600 border border-purple-500/20";
      case "Delivered": return "bg-green-500/10 text-green-600 border border-green-500/20";
      default: return "bg-gray-500/10 text-gray-600 border border-gray-500/20";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary-maroon">Dashboard Overview</h1>
        <p className="text-sm text-text-secondary mt-1">Welcome back to the Kshatriya Foods management portal</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary-maroon animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Total Orders */}
            <div className="bg-bg-secondary border border-primary-maroon/10 p-6 rounded-xl shadow-sm flex items-center gap-5">
              <div className="h-14 w-14 rounded-full bg-primary-maroon/10 flex items-center justify-center text-primary-maroon shrink-0">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-semibold">Total Orders</p>
                <h3 className="text-3xl font-bold text-text-primary mt-1">{ordersCount}</h3>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-bg-secondary border border-primary-maroon/10 p-6 rounded-xl shadow-sm flex items-center gap-5">
              <div className="h-14 w-14 rounded-full bg-primary-maroon/10 flex items-center justify-center text-primary-maroon shrink-0">
                <IndianRupee className="h-7 w-7" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-semibold">Total Revenue</p>
                <h3 className="text-3xl font-bold text-text-primary mt-1">₹{totalRevenue.toLocaleString("en-IN")}</h3>
              </div>
            </div>

            {/* Active Products */}
            <div className="bg-bg-secondary border border-primary-maroon/10 p-6 rounded-xl shadow-sm flex items-center gap-5">
              <div className="h-14 w-14 rounded-full bg-primary-maroon/10 flex items-center justify-center text-primary-maroon shrink-0">
                <Package className="h-7 w-7" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-semibold">Active Products</p>
                <h3 className="text-3xl font-bold text-text-primary mt-1">{productsCount}</h3>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-bg-secondary border border-primary-maroon/10 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-bold text-primary-maroon">Recent Orders</h2>
              {recentOrders.length > 0 && (
                <Link href="/admin/orders" className="text-xs font-bold text-primary-maroon hover:underline">
                  View All Orders &rarr;
                </Link>
              )}
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-secondary text-sm">No orders yet. They will appear here when customers complete checkout.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-primary-maroon/10 text-text-secondary text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-maroon/5">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-bg-alternate/5 transition-colors">
                          <td className="py-4 font-heading font-bold text-primary-maroon">#{order.id}</td>
                          <td className="py-4 text-text-secondary">
                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short"
                            })}
                          </td>
                          <td className="py-4 text-text-primary font-medium">{order.customer_name}</td>
                          <td className="py-4 text-text-primary font-semibold">₹{order.total_amount}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card list */}
                <div className="block md:hidden space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="bg-bg-alternate/30 border border-primary-maroon/5 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold text-primary-maroon text-sm">#{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">{order.customer_name}</span>
                        <span className="font-bold text-text-primary">₹{order.total_amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
