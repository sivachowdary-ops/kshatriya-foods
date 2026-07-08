"use client";

import { useCart } from "@/components/CartProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    state: "",
    pincode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (items.length === 0 && !orderConfirmed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex-grow flex flex-col items-center justify-center">
        <h1 className="font-heading text-3xl text-primary-maroon mb-6">Your Cart is Empty</h1>
        <p className="text-text-primary/70 mb-8">Please add some items to your cart before proceeding to checkout.</p>
        <Link href="/products" className="px-8 py-3 bg-primary-maroon text-matte-black font-medium rounded-sm">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate Order ID
    const newOrderId = `KF-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);

    try {
      // 1. Insert into orders table
      const { error: orderError } = await supabase.from("orders").insert([
        {
          id: newOrderId,
          customer_name: formData.name,
          customer_phone: formData.phone,
          delivery_address: formData.address,
          state: formData.state,
          pincode: formData.pincode,
          total_amount: cartTotal,
          status: "Pending"
        }
      ]);

      if (orderError) throw orderError;

      // 2. Insert into order_items table
      const orderItems = items.map(item => ({
        order_id: newOrderId,
        product_name: item.name,
        tier_label: item.selected_tier || null,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // Format WhatsApp Message
      let message = `Hello Kshatriya Foods! I'd like to place an order:\n\n`;
      message += `*Order ID:* #${newOrderId}\n\n`;
      message += `*Items:*\n`;
      
      items.forEach(item => {
        const variant = item.selected_tier ? ` (${item.selected_tier})` : "";
        message += `- ${item.name}${variant} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
      });
      
      message += `\n*Total:* ₹${cartTotal}\n\n`;
      message += `*Customer Details:*\n`;
      message += `Name: ${formData.name}\n`;
      message += `Phone: ${formData.phone}\n`;
      message += `Address: ${formData.address}, ${formData.state} - ${formData.pincode}\n`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917095403677?text=${encodedMessage}`;

      setIsSubmitting(false);
      setOrderConfirmed(true);
      clearCart();
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank");
    } catch (err: any) {
      alert("Failed to submit order: " + err.message);
      setIsSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex-grow flex flex-col items-center justify-center max-w-2xl">
        <CheckCircle2 className="h-20 w-20 text-primary-maroon mb-6" />
        <h1 className="font-heading text-4xl text-primary-maroon mb-4">Order Initiated!</h1>
        <p className="text-xl text-text-primary/90 mb-4">Your Order ID is <span className="font-bold text-primary-maroon">#{orderId}</span></p>
        <p className="text-text-primary/70 mb-10 leading-relaxed">
          We have opened WhatsApp for you to send your order details directly to us. 
          If WhatsApp didn't open automatically, please click the button below.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => {
              let message = `Hello Kshatriya Foods! I'd like to place an order:\n*Order ID:* #${orderId}\n... (Please check your previous WhatsApp tab)`;
              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/917095403677?text=${encodedMessage}`, "_blank");
            }}
            className="px-8 py-4 bg-[#25D366] text-white font-medium rounded-sm shadow-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
          >
            Open WhatsApp Again
          </button>
          <Link href="/" className="px-8 py-4 border border-primary-maroon text-primary-maroon font-medium rounded-sm hover:bg-primary-maroon/10 transition-colors flex items-center justify-center">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-grow max-w-6xl">
      <Link href="/products" className="inline-flex items-center text-primary-maroon hover:text-primary-maroon-dark mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Continue Shopping
      </Link>

      <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-7">
          <div className="bg-bg-secondary rounded-xl border border-primary-maroon-antique/20 p-6 md:p-8">
            <h2 className="font-heading text-2xl text-primary-maroon mb-6 border-b border-primary-maroon/10 pb-4">Delivery Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary/80">Full Name *</label>
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-background border border-primary-maroon-antique/30 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-primary-maroon transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary/80">WhatsApp Number *</label>
                  <input 
                    required
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-background border border-primary-maroon-antique/30 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-primary-maroon transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary/80">Complete Delivery Address *</label>
                <textarea 
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-background border border-primary-maroon-antique/30 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-primary-maroon transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary/80">State *</label>
                  <input 
                    required
                    type="text" 
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-background border border-primary-maroon-antique/30 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-primary-maroon transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary/80">Pincode *</label>
                  <input 
                    required
                    type="text" 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full bg-background border border-primary-maroon-antique/30 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-primary-maroon transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 mt-8 flex items-center justify-center rounded-sm bg-primary-maroon px-8 font-medium text-matte-black shadow-[0_0_15px_rgba(128,0,0,0.3)] transition-all hover:bg-yellow-400 disabled:opacity-70"
              >
                {isSubmitting ? "Processing..." : "Place Order via WhatsApp"}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-background border border-primary-maroon-antique/30 rounded-xl p-6 md:p-8 sticky top-28">
            <h2 className="font-heading text-2xl text-primary-maroon mb-6 border-b border-primary-maroon/10 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={`${item.id}-${item.selected_tier || 'default'}`} className="flex gap-4 items-center">
                  <div className="h-16 w-16 rounded bg-background flex-shrink-0 relative border border-primary-maroon/20">
                    <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-text-primary/60">{item.selected_tier || item.unit_label} x {item.quantity}</p>
                  </div>
                  <div className="font-semibold text-primary-maroon">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-primary-maroon/10 pt-4 space-y-3">
              <div className="flex justify-between text-text-primary/80">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-text-primary/80">
                <span>Shipping</span>
                <span className="text-green-400">Calculated on WhatsApp</span>
              </div>
              <div className="flex justify-between text-xl font-heading font-bold text-primary-maroon pt-2 border-t border-primary-maroon/10">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
