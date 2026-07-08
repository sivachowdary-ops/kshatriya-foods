import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import CartPanel from "@/components/CartPanel";
import WhatsAppFloatingButtons from "@/components/WhatsAppFloatingButtons";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-grow flex flex-col pt-0">{children}</main>
      <Footer />
      <CartPanel />
      <WhatsAppFloatingButtons />
    </CartProvider>
  );
}
