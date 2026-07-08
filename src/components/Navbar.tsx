"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary-maroon text-gold border-b border-gold overflow-hidden py-2 flex">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 pr-12 text-[13px] font-bold tracking-wider uppercase">
              <span>✦ No Palm Oil</span>
              <span>✦ No Preservatives</span>
              <span>✦ 100% Pure & Traditional</span>
              <span>✦ Pan India Shipping</span>
              <span>✦ No Added Colors</span>
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full bg-bg-secondary border-b border-bg-alternate py-3 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-primary-maroon">
              <Image 
                src="/images/kshatriya_logo.jpeg" 
                alt="Kshatriya Foods Logo" 
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-primary-maroon leading-tight">
                Kshatriya
              </h1>
              <span className="text-[10px] text-text-muted tracking-widest uppercase">Food Products</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {["Home", "Categories", "How to Order", "FAQs"].map((item) => (
              <Link 
                key={item} 
                href={item === "Home" ? "/" : item === "Categories" ? "/products" : `/#${item.toLowerCase().replace(/ /g, '-')}`} 
                className="text-sm font-medium text-text-secondary hover:text-primary-maroon transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-text-secondary hover:text-primary-maroon transition-colors flex items-center gap-2"
              aria-label="Open Cart"
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="hidden md:inline text-sm font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 md:right-8 h-5 w-5 rounded-full bg-primary-maroon text-[11px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-primary-maroon transition-colors"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-24 px-6 md:hidden">
          <nav className="flex flex-col gap-6">
            {["Home", "Categories", "How to Order", "FAQs"].map((item) => (
              <Link 
                key={item} 
                href={item === "Home" ? "/" : item === "Categories" ? "/products" : `/#${item.toLowerCase().replace(/ /g, '-')}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="font-heading font-medium text-2xl text-text-primary hover:text-primary-maroon transition-colors border-b border-bg-alternate pb-4"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
