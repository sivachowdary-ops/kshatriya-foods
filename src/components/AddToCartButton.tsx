"use client";

import { useState } from "react";
import { useCart, CartItem } from "./CartProvider";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/data";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const hasTiers = product.tiered_pricing && product.tiered_pricing.length > 0;
  
  const [selectedTier, setSelectedTier] = useState<string | undefined>(
    hasTiers ? product.tiered_pricing![0].label : undefined
  );
  
  const currentPrice = hasTiers 
    ? product.tiered_pricing!.find(t => t.label === selectedTier)?.price || product.price
    : product.price;
    
  const currentUnit = selectedTier || product.unit_label;

  const handleAddToCart = () => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      unit_label: currentUnit,
      image: product.image,
      selected_tier: selectedTier
    };
    
    addItem(item);
    setQuantity(1); // Reset after adding
  };

  return (
    <div className="mt-8">
      {/* Tiered Pricing Selector */}
      {hasTiers && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground/80 mb-2">Select Size/Weight:</label>
          <div className="flex flex-wrap gap-3">
            {product.tiered_pricing?.map((tier) => (
              <button
                key={tier.label}
                onClick={() => setSelectedTier(tier.label)}
                className={`px-4 py-2 rounded-sm border transition-all ${
                  selectedTier === tier.label
                    ? "border-primary-maroon bg-primary-maroon/10 text-primary-maroon shadow-[0_0_10px_rgba(128,0,0,0.2)]"
                    : "border-primary-maroon-dark/30 text-foreground hover:border-primary-maroon/60"
                }`}
              >
                {tier.label} - ₹{tier.price}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-bg-alternate border border-primary-maroon/30 rounded-sm h-14 w-32">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex-1 flex items-center justify-center text-foreground/70 hover:text-primary-maroon transition-colors h-full"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex-1 text-center font-medium">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="flex-1 flex items-center justify-center text-foreground/70 hover:text-primary-maroon transition-colors h-full"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="flex-1 flex h-14 items-center justify-center gap-2 rounded-sm bg-primary-maroon px-8 font-medium text-matte-black shadow-[0_0_15px_rgba(128,0,0,0.3)] transition-all hover:bg-yellow-400 hover:scale-[1.02]"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
