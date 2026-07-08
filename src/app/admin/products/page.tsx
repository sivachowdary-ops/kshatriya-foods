"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Edit, Image as ImageIcon, X, Save, Loader2 } from "lucide-react";
import Image from "next/image";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [tiers, setTiers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*, product_tiers(*)")
      .order("name");
    
    if (error) {
      console.error("Error fetching products:", error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const startEdit = (product: any) => {
    setEditingProduct(product);
    setBasePrice(product.price);
    setTiers(product.product_tiers || []);
  };

  const handleTierPriceChange = (index: number, newPrice: string) => {
    const parsed = parseFloat(newPrice) || 0;
    const updated = [...tiers];
    updated[index] = { ...updated[index], price: parsed };
    setTiers(updated);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Update product base price
      const { error: prodError } = await supabase
        .from("products")
        .update({ price: basePrice })
        .eq("id", editingProduct.id);

      if (prodError) throw prodError;

      // 2. Update tiers if any
      for (const tier of tiers) {
        const { error: tierError } = await supabase
          .from("product_tiers")
          .update({ price: tier.price })
          .eq("id", tier.id);
        
        if (tierError) throw tierError;
      }

      setEditingProduct(null);
      await fetchProducts();
    } catch (err: any) {
      alert("Failed to update product details: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary-maroon">Manage Products</h1>
          <p className="text-sm text-text-secondary mt-1">Edit pricing for your products</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary-maroon animate-spin" />
        </div>
      ) : (
        <div className="bg-bg-secondary border border-primary-maroon/10 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-alternate/50 border-b border-primary-maroon/10 text-text-primary/70 text-sm">
                  <th className="p-4 font-medium w-16">Image</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price (Base)</th>
                  <th className="p-4 font-medium">Pricing Tiers</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-primary-maroon/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-bg-alternate/20 transition-colors">
                    <td className="p-4">
                      <div className="h-10 w-10 rounded bg-background border border-primary-maroon/20 overflow-hidden relative flex items-center justify-center">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-primary-maroon/50" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-text-primary">{product.name}</td>
                    <td className="p-4 text-text-secondary capitalize">{product.category.replace(/-/g, ' ')}</td>
                    <td className="p-4 text-text-primary font-semibold">
                      ₹{product.price} <span className="text-xs font-normal text-text-secondary">/{product.unit_label}</span>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {product.product_tiers && product.product_tiers.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {product.product_tiers.map((t: any) => (
                            <span key={t.id} className="bg-bg-alternate text-xs px-2 py-0.5 rounded border border-primary-maroon/10">
                              {t.label}: <strong>₹{t.price}</strong>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted">None</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${product.is_active ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => startEdit(product)}
                        className="p-2 text-text-secondary hover:text-primary-maroon transition-colors inline-flex rounded-full hover:bg-bg-alternate"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-bg-secondary border border-primary-maroon/10 rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-bold text-primary-maroon">Edit Pricing</h2>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full hover:bg-bg-alternate text-text-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-4 p-3 bg-bg-alternate/50 rounded-lg border border-primary-maroon/5 mb-6">
              <div className="h-12 w-12 rounded bg-background border border-primary-maroon/10 overflow-hidden relative flex-shrink-0">
                {editingProduct.image ? (
                  <Image src={editingProduct.image} alt={editingProduct.name} fill className="object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-primary-maroon/50 m-3" />
                )}
              </div>
              <div>
                <h3 className="font-heading font-bold text-text-primary text-sm">{editingProduct.name}</h3>
                <p className="text-xs text-text-secondary capitalize">{editingProduct.category.replace(/-/g, ' ')}</p>
              </div>
            </div>

            <form onSubmit={saveProduct} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">
                  Base Price (per {editingProduct.unit_label})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-medium">₹</span>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-background border border-primary-maroon/20 rounded px-8 py-2.5 text-text-primary focus:outline-none focus:border-primary-maroon"
                    required
                  />
                </div>
              </div>

              {tiers.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-primary-maroon/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-maroon">Pricing Tiers</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {tiers.map((tier, index) => (
                      <div key={tier.id} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-text-secondary font-medium">{tier.label}</span>
                        <div className="relative w-40">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-medium">₹</span>
                          <input
                            type="number"
                            value={tier.price}
                            onChange={(e) => handleTierPriceChange(index, e.target.value)}
                            className="w-full bg-background border border-primary-maroon/20 rounded px-8 py-1.5 text-text-primary focus:outline-none focus:border-primary-maroon text-right"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-primary-maroon/10">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-primary-maroon/20 text-text-primary rounded hover:bg-bg-alternate font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-primary-maroon text-white rounded hover:bg-maroon-dark font-medium text-sm disabled:opacity-75"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
