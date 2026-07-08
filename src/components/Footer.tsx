"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-bg-alternate pt-16 pb-8 text-text-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-12">
          
          {/* Brand & Socials Column */}
          <div className="flex flex-col gap-4">
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
                <h4 className="font-heading text-lg font-bold text-text-primary m-0">Kshatriya Food Products</h4>
                <span className="text-[10px] text-primary-maroon font-bold tracking-widest uppercase">Traditional & Authentic</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-text-muted mt-2">
              Serving authentic homemade sweets and traditional food products for over 10 years.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://www.instagram.com/kshatriya__foods?utm_source=qr&igsh=MWpvN2d3c25tYTJxZw==" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-text-primary border border-bg-alternate hover:text-primary-maroon hover:border-primary-maroon transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-text-primary border border-bg-alternate hover:text-primary-maroon hover:border-primary-maroon transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-text-primary border border-bg-alternate hover:text-primary-maroon hover:border-primary-maroon transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-text-primary border border-bg-alternate hover:text-primary-maroon hover:border-primary-maroon transition-colors" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.6 5.9 3.4 5.1 4.6 5 8.1 4.7 15.9 4.7 19.4 5c1.2.1 2 .9 2.1 2.1.3 3.5.3 6.3 0 9.8-.1 1.2-.9 2-2.1 2.1-3.5.3-11.3.3-14.8 0-1.2-.1-2-.9-2.1-2.1-.3-3.5-.3-6.3 0-9.8zm7.5 7.9l6-3.5-6-3.5v7z"/></svg>
              </a>
            </div>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-lg font-bold text-text-primary border-b-2 border-gold pb-2 w-max">
              <Link href="#" className="hover:text-primary-maroon transition-colors">Contact Us &rarr;</Link>
            </h4>
            
            <div className="flex items-start gap-3 mt-2">
              <Phone className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <a href="tel:+917095403677" className="font-semibold text-sm text-text-primary hover:text-primary-maroon transition-colors">+91 7095403677</a>
                <span className="text-xs text-text-muted block mt-1">Mon-Sun: 6AM - 9PM</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3 mt-2">
              <Mail className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
              <a href="mailto:kahatriyafoods@gmail.com" className="text-sm text-text-primary hover:text-primary-maroon transition-colors">kahatriyafoods@gmail.com</a>
            </div>
            
            <div className="flex items-start gap-3 mt-2">
              <MapPin className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
              <span className="text-sm text-text-primary leading-relaxed max-w-xs">
                Pallapu veedhi, Near by State Bank, Atreyapuram village, Atreyapuram mandal, Pin: 533235, Andhra Pradesh
              </span>
            </div>
          </div>

          {/* Our Promise */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-lg font-bold text-text-primary border-b-2 border-gold pb-2 w-max">Our Promise</h4>
            <ul className="flex flex-col gap-3 text-sm text-text-secondary">
              <li className="flex items-center gap-2"><span className="text-gold font-bold">✓</span> No Added Colors</li>
              <li className="flex items-center gap-2"><span className="text-gold font-bold">✓</span> No Palm Oil</li>
              <li className="flex items-center gap-2"><span className="text-gold font-bold">✓</span> No Preservatives</li>
              <li className="flex items-center gap-2"><span className="text-gold font-bold">✓</span> 100% Homemade</li>
              <li className="flex items-center gap-2"><span className="text-gold font-bold">✓</span> Traditional Recipes</li>
              <li className="flex items-center gap-2"><span className="text-gold font-bold">✓</span> Pan India Shipping</li>
            </ul>
          </div>
          
        </div>
        
        {/* Footer Bottom / Copyright */}
        <div className="pt-8 border-t border-bg-alternate flex flex-col items-center text-center gap-3 text-sm text-text-muted">
          <p>© {new Date().getFullYear()} Kshatriya Food Products. All Rights Reserved.</p>
          <p className="text-xs">
            Founded by <strong className="text-text-primary">M.S. Varma</strong> | Digitally Expanded by <strong className="text-text-primary">M.S. Varma</strong>
          </p>
          <p className="text-xs">
            Designed and Developed by <a href="#" className="text-gold font-semibold hover:underline">Siva</a> &amp; <a href="#" className="text-gold font-semibold hover:underline">Astra Ai Solutions</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
