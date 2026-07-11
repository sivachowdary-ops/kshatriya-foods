import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Star, ShieldCheck, Truck, Clock, Leaf, Medal, Quote, CheckCircle2 } from "lucide-react";
import { getProducts } from "@/lib/data";

const CATEGORIES = [
  { name: "Putharekulu", image: "/images/dryfruit.jpeg", href: "/products?category=putharekulu" },
  { name: "Mamidi Tandara", image: "/images/sugar_mamidi_tandara.jpeg", href: "/products?category=mamidi-tandara" },
  { name: "Tati Specials", image: "/images/Tati_chapa.jpeg", href: "/products?category=tati-specials" },
  { name: "Traditional Sweets", image: "/images/kova.jpeg", href: "/products?category=traditional-sweets" },
  { name: "Traditional Snacks", image: "/images/karam_gavvalu.jpeg", href: "/products?category=traditional-snacks" }
];

export const revalidate = 60; // Revalidate page every 60 seconds

export default async function Home() {
  const products = await getProducts();
  const bestSellerSlugs = [
    "kaju-dry-fruit-putharekulu",
    "special-dry-fruit-putharekulu",
    "kova-dry-fruit-putharekulu",
    "dry-fruit-putharekulu",
    "sugar-putharekulu",
    "chocolate-dry-fruit-putharekulu",
    "dates-putharekulu",
    "samosa-putharekulu",
    "sugar-mamidi-tandara",
    "bellam-mamidi-tandara"
  ];
  const featuredProducts = products.filter(p => bestSellerSlugs.includes(p.slug));

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">

      {/* Standard Hero Section */}
      <section className="relative w-full min-h-[450px] md:h-[500px] flex items-center justify-center overflow-hidden border-b border-primary-maroon/20 py-12 md:py-0">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/Kaju_dry_fruit.jpeg" 
            alt="Traditional Indian Sweets" 
            fill 
            className="object-cover"
            priority
            sizes="100vw"
            quality={60}
          />
          {/* Darker overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        </div>
        
        <div className="container relative z-10 px-4 md:px-8 text-left max-w-6xl w-full mx-auto flex flex-col items-start justify-center">
          <div className="max-w-2xl">
            <span className="inline-block bg-gold text-primary-maroon border border-gold px-3 py-1 md:px-4 md:py-1 rounded text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 md:mb-6 shadow-sm">
              Traditional & Authentic
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight shadow-sm">
              KSHATRIYA FOOD PRODUCTS
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-bg-alternate mb-8 leading-relaxed max-w-xl font-medium drop-shadow-md">
              Authentic Traditional Snacks Delivered Across India. Freshly prepared using heritage recipes and premium ingredients.
            </p>
            
            <div className="flex flex-row flex-wrap gap-3 md:gap-4 justify-start items-center">
              <Link href="/products" className="inline-flex h-10 md:h-12 items-center justify-center rounded bg-gold px-5 md:px-8 text-sm md:text-base font-bold text-primary-maroon transition-all hover:bg-gold-antique shadow-md whitespace-nowrap">
                Shop Now
              </Link>
              <Link href="#categories-section" className="inline-flex h-10 md:h-12 items-center justify-center rounded border-2 border-white/80 bg-black/20 backdrop-blur-sm px-5 md:px-8 text-sm md:text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white shadow-md whitespace-nowrap">
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section id="categories-section" className="py-16 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-10 px-4">
            <h3 className="font-heading text-3xl font-bold text-text-primary mb-2">Explore Categories</h3>
            <span className="text-sm font-medium text-primary-maroon uppercase tracking-wider">Our Specialities</span>
          </div>
          
          {/* Constrained scroll wrapper so it doesn't break the layout */}
          <div className="w-full max-w-7xl mx-auto overflow-x-auto hide-scrollbar pb-6 px-4">
            <div className="flex gap-6 w-max">
              {CATEGORIES.map((cat, i) => (
                <Link key={i} href={cat.href} className="flex flex-col items-center gap-3 group w-32 md:w-40 shrink-0">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-bg-alternate group-hover:border-primary-maroon transition-colors">
                    <Image 
                      src={cat.image} 
                      alt={cat.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 128px, 160px"
                      quality={60}
                    />
                  </div>
                  <span className="font-heading font-semibold text-sm text-center text-text-secondary group-hover:text-primary-maroon transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-bg-secondary border-y border-bg-alternate">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h3 className="font-heading text-3xl font-bold text-text-primary mb-2">Best Sellers</h3>
            <span className="text-sm font-medium text-primary-maroon uppercase tracking-wider">Our Most Loved Delicacies</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/products" className="inline-flex h-12 items-center justify-center rounded border border-primary-maroon bg-transparent px-10 font-semibold text-text-primary transition-all hover:bg-primary-maroon hover:text-white">
              View All Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto bg-bg-secondary rounded-2xl border border-bg-alternate p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center shadow-lg">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shrink-0 border-4 border-primary-maroon/20">
              <Image src="/images/Founder.jpeg" alt="Kshatriya Foods Founder" fill className="object-cover object-top" sizes="256px" quality={60} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-heading text-2xl font-bold text-text-primary mb-1">Our Founder</h3>
              <span className="text-sm font-semibold text-primary-maroon uppercase tracking-wide">Proprietor</span>
              <div className="h-1 w-12 bg-primary-maroon my-4 mx-auto md:mx-0"></div>
              <p className="text-lg italic text-text-primary mb-4 font-heading">
                "Serving authentic traditional snacks with quality, tradition, and trust for over a decade."
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                At Kshatriya Food Products, we believe that food is a bridge to our culture and memories. Each snack we prepare represents the authentic taste of our heritage, handpicked local ingredients, and hygiene standards that you can trust like your own home kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-bg-secondary border-y border-bg-alternate">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h3 className="font-heading text-3xl font-bold text-text-primary mb-2">Why Choose Kshatriya?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Medal, title: "Traditional Recipes", desc: "Handed down through generations, preserving the genuine flavor of home." },
              { icon: Clock, title: "Fresh Preparation", desc: "We prepare snacks in small batches upon receiving orders for maximum freshness." },
              { icon: ShieldCheck, title: "Hygienic Packaging", desc: "Prepared in sanitised kitchens and sealed securely to prevent leakage and moisture." },
              { icon: Truck, title: "Nationwide Delivery", desc: "Partnership with top courier services for reliable shipping to any corner of India." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl bg-background border border-bg-alternate">
                <div className="h-12 w-12 rounded bg-primary-maroon/10 flex items-center justify-center shrink-0 text-primary-maroon">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-text-primary mb-2">{feature.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Ordering Works */}
      <section id="how-to-order-section" className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h3 className="font-heading text-3xl font-bold text-text-primary mb-2">How to Order</h3>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-6 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Choose Snacks", desc: "Browse our rich selection of sweets and savories." },
              { step: "2", title: "Select Weight", desc: "Choose pack sizes and add to cart." },
              { step: "3", title: "Enter Address", desc: "Fill in your delivery details and state." },
              { step: "4", title: "Redirect", desc: "Confirm your order via WhatsApp." },
              { step: "5", title: "Receive Delivery", desc: "Fresh batch shipped to your door!" }
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                {/* Connector line for desktop */}
                {i < 4 && <div className="hidden md:block absolute top-6 left-[60%] w-[100%] h-0.5 bg-bg-alternate -z-10"></div>}
                
                <div className="h-12 w-12 rounded-full bg-bg-secondary border-2 border-primary-maroon flex items-center justify-center text-xl font-bold text-primary-maroon mb-4 z-10">
                  {item.step}
                </div>
                <h4 className="font-heading text-base font-bold text-text-primary mb-2">{item.title}</h4>
                <p className="text-xs text-text-secondary px-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-16 bg-bg-secondary border-t border-bg-alternate">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <h3 className="font-heading text-3xl font-bold text-text-primary mb-2">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {[
              { q: "What is the minimum order quantity?", a: "The minimum order weight is 2 kg for delivery." },
              { q: "Do you ship pan India?", a: "Yes, we deliver to all states across India with weight-based shipping charges." },
              { q: "Are your products preservative-free?", a: "Yes, all our products are made fresh without any artificial colors, preservatives, or palm oil." },
              { q: "How do I place a bulk order?", a: "For bulk orders and wedding events, please contact us directly via WhatsApp or phone." },
              { q: "What payment methods do you accept?", a: "We accept online payments, UPI, bank transfers, and cash on delivery (COD) for select locations." },
              { q: "How long does delivery take?", a: "Delivery typically takes 3-7 business days depending on your location. Priority zones receive faster delivery." }
            ].map((faq, i) => (
              <div key={i} className="border border-bg-alternate rounded-lg bg-background overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between font-heading font-semibold p-4 cursor-pointer text-text-primary hover:text-primary-maroon transition-colors list-none">
                    {faq.q}
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="p-4 pt-0 text-sm text-text-secondary">
                    {faq.a}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner Section */}
      <section className="py-12 bg-primary-maroon">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div className="flex flex-col items-center gap-3">
              <Leaf className="h-8 w-8" />
              <div>
                <h4 className="font-bold text-sm mb-1">Freshly Prepared</h4>
                <p className="text-xs text-white/80 hidden md:block">Made in small batches upon order.</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ShieldCheck className="h-8 w-8" />
              <div>
                <h4 className="font-bold text-sm mb-1">Hygienically Packed</h4>
                <p className="text-xs text-white/80 hidden md:block">Strict sanitization standards.</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Star className="h-8 w-8" />
              <div>
                <h4 className="font-bold text-sm mb-1">Premium Ingredients</h4>
                <p className="text-xs text-white/80 hidden md:block">Woodpressed oils & select spices.</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Truck className="h-8 w-8" />
              <div>
                <h4 className="font-bold text-sm mb-1">Delivered Across India</h4>
                <p className="text-xs text-white/80 hidden md:block">Reliable courier tracking.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
