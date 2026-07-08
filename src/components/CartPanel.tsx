"use client";

import { useCart } from "./CartProvider";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPanel() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, cartTotal } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          ></motion.div>

          {/* Cart Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-bg-secondary border-l border-primary-maroon/20 h-full flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-primary-maroon/10">
              <h2 className="font-heading text-2xl font-medium text-primary-maroon flex items-center gap-2">
                <ShoppingBag className="h-6 w-6" />
                Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-text-secondary hover:text-primary-maroon transition-colors rounded-full hover:bg-bg-alternate"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-primary-maroon/20 mb-4" />
                  <p className="text-xl text-text-primary mb-2 font-heading">Your cart is empty</p>
                  <p className="text-sm text-text-secondary mb-8">Discover our premium collections.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="h-12 px-8 rounded-full border border-primary-maroon text-primary-maroon hover:bg-primary-maroon hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.selected_tier || 'default'}`} className="flex gap-4 p-4 rounded-xl bg-bg-alternate border border-primary-maroon/5 relative group hover:border-primary-maroon/30 transition-colors">
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-background flex-shrink-0 relative border border-primary-maroon/10">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading text-lg text-text-primary line-clamp-1 pr-6">{item.name}</h3>
                        <p className="text-sm text-text-secondary">
                          {item.selected_tier ? item.selected_tier : item.unit_label}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-semibold text-primary-maroon">₹{item.price}</p>
                        
                        <div className="flex items-center gap-3 bg-background rounded-full border border-primary-maroon/20 px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selected_tier)}
                            className="text-text-secondary hover:text-primary-maroon transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selected_tier)}
                            className="text-text-secondary hover:text-primary-maroon transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id, item.selected_tier)}
                      className="absolute top-4 right-4 text-text-secondary/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-background rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-primary-maroon/10 bg-bg-alternate">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg text-text-secondary">Subtotal</span>
                  <span className="font-heading text-3xl font-semibold text-primary-maroon">₹{cartTotal}</span>
                </div>
                
                <Link 
                  href="/checkout" 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex h-14 items-center justify-center rounded-full bg-primary-maroon px-10 tracking-widest uppercase text-sm font-bold text-white shadow-[0_0_15px_rgba(128,0,0,0.3)] transition-all hover:bg-maroon-dark hover:scale-[1.02]"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
