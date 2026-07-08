"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Package, LogOut, Settings, Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else if (session) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else if (session) {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  // Close sidebar on path changes (e.g. mobile link clicks)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-primary-maroon">Loading...</div>;
  }

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  if (!isAuthenticated) return null;

  const NavItems = () => (
    <nav className="flex-1 py-6 px-4 space-y-2">
      <Link 
        href="/admin" 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-primary-maroon/10 text-primary-maroon border border-primary-maroon/20' : 'text-text-secondary hover:text-primary-maroon hover:bg-bg-alternate'}`}
      >
        <LayoutDashboard className="h-5 w-5" />
        Dashboard
      </Link>
      <Link 
        href="/admin/orders" 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname.startsWith('/admin/orders') ? 'bg-primary-maroon/10 text-primary-maroon border border-primary-maroon/20' : 'text-text-secondary hover:text-primary-maroon hover:bg-bg-alternate'}`}
      >
        <ShoppingBag className="h-5 w-5" />
        Orders
      </Link>
      <Link 
        href="/admin/products" 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname.startsWith('/admin/products') ? 'bg-primary-maroon/10 text-primary-maroon border border-primary-maroon/20' : 'text-text-secondary hover:text-primary-maroon hover:bg-bg-alternate'}`}
      >
        <Package className="h-5 w-5" />
        Products
      </Link>
      <Link 
        href="/admin/settings" 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname.startsWith('/admin/settings') ? 'bg-primary-maroon/10 text-primary-maroon border border-primary-maroon/20' : 'text-text-secondary hover:text-primary-maroon hover:bg-bg-alternate'}`}
      >
        <Settings className="h-5 w-5" />
        Settings
      </Link>
    </nav>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-text-primary">
      {/* Mobile Top Header */}
      <header className="md:hidden flex h-16 items-center justify-between px-6 bg-bg-secondary border-b border-primary-maroon/10 sticky top-0 z-30">
        <Link href="/admin" className="font-heading text-xl font-bold text-primary-maroon">
          Kshatriya Admin
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 text-text-primary hover:text-primary-maroon transition-colors"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar - Desktop (Hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-bg-secondary border-r border-primary-maroon/10 flex-col shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-primary-maroon/10">
          <Link href="/admin" className="font-heading text-xl font-bold text-primary-maroon">
            Kshatriya Admin
          </Link>
        </div>
        
        <NavItems />
        
        <div className="p-4 border-t border-primary-maroon/10">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer (Slide-out menu) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          ></div>
          
          {/* Menu Drawer */}
          <div className="relative w-64 max-w-xs bg-bg-secondary border-r border-primary-maroon/10 flex flex-col h-full z-50 animate-slideRight">
            <div className="h-16 flex items-center justify-between px-6 border-b border-primary-maroon/10">
              <span className="font-heading text-lg font-bold text-primary-maroon">Kshatriya Admin</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-text-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <NavItems />
            
            <div className="p-4 border-t border-primary-maroon/10">
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow overflow-auto p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
