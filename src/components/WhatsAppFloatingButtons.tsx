"use client";

import { useCart } from "./CartProvider";
import { ShoppingBag } from "lucide-react";

export default function WhatsAppFloatingButtons() {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* WhatsApp Cart Button */}
      {itemCount > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative bg-bg-secondary border-2 border-primary-maroon text-primary-maroon h-14 w-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(128,0,0,0.3)] hover:scale-110 transition-transform duration-300 group"
          aria-label="View Cart"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary-maroon text-white text-xs font-bold flex items-center justify-center border-2 border-background shadow-md">
            {itemCount}
          </span>
        </button>
      )}

      <a 
        href="https://wa.me/917095403677?text=Hello%20Kshatriya%20Foods%2C%20I%20have%20visited%20your%20website%20and%20I%20would%20like%20to%20make%20an%20inquiry." 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white h-14 w-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className="fill-white stroke-none">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 2.998 1.456 4.708 1.457 5.485 0 9.948-4.468 9.95-9.96.002-2.66-1.026-5.159-2.895-7.03C16.485 1.75 13.985.72 11.998.72 6.51.72 2.046 5.188 2.044 10.68c-.001 1.708.455 3.09 1.4 4.7l-.994 3.63 3.738-.98-.14.225z"/>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
        </svg>
      </a>
    </div>
  );
}
