"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "./CartProvider";

interface ProductProps {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  unit_label: string;
}

export default function ProductCard({ id, name, slug, image, price, unit_label }: ProductProps) {
  const { addItem, setIsCartOpen } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, image, price, unit_label, quantity: 1 });
  };

  return (
    <div className="group relative flex flex-col h-full bg-bg-secondary border border-bg-alternate rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${slug}`} className="block relative aspect-square overflow-hidden bg-background border-b border-bg-alternate">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            quality={60}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center border border-dashed border-bg-alternate m-4 rounded">
            <span className="font-heading text-text-muted text-sm">Image Coming Soon</span>
          </div>
        )}
      </Link>
      
      <div className="p-3 md:p-5 flex flex-col flex-grow text-left bg-bg-secondary">
        <Link href={`/product/${slug}`} className="block flex-grow">
          <h3 className="font-heading text-[15px] leading-tight md:text-lg font-bold text-text-primary group-hover:text-primary-maroon transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        
        <div className="mt-3 flex flex-col xl:flex-row xl:items-center justify-between gap-2 md:gap-3 w-full">
          <div className="flex items-baseline flex-wrap">
            <span className="text-base md:text-lg font-bold text-primary-maroon">₹{price}</span>
            <span className="text-[10px] md:text-xs text-text-muted ml-1 font-medium">/{unit_label}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="h-8 md:h-10 px-2 md:px-4 rounded border border-primary-maroon bg-transparent text-primary-maroon flex items-center justify-center gap-1.5 md:gap-2 hover:bg-primary-maroon hover:text-white transition-all w-full xl:w-auto shrink-0"
          >
            <ShoppingBag className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
