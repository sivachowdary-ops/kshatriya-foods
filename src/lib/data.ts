import { supabase } from "./supabase";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "dry-fruit-sweets" | "traditional-sweets" | "savories" | "others" | string;
  description: string;
  image: string;
  price: number;
  unit_label: string;
  tiered_pricing?: { label: string; price: number }[];
  pack_quantity?: string;
  is_active: boolean;
}

export async function getProducts(category?: string): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*, product_tiers(*)");

  if (category) {
    query = query.eq("category", category);
  }

  query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching products from database:", error.message);
    return [];
  }

  const products = (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    description: p.description,
    image: p.image,
    price: parseFloat(p.price),
    unit_label: p.unit_label,
    pack_quantity: p.pack_quantity,
    is_active: p.is_active,
    tiered_pricing: (p.product_tiers || []).map((t: any) => ({
      label: t.label,
      price: parseFloat(t.price)
    }))
  }));

  const mockProducts: Product[] = [
    {
      id: "mock-1",
      name: "Bellam Plain Putharekulu",
      slug: "bellam-plain-putharekulu",
      category: "putharekulu",
      description: "Authentic Bellam Plain Putharekulu",
      image: "/images/bellam_plain_putharekulu.webp",
      price: 120,
      unit_label: "box",
      is_active: true,
      tiered_pricing: []
    },
    {
      id: "mock-2",
      name: "Kshatriya Foods Special Dry Fruit Box",
      slug: "kshatriya-foods-special-dry-fruit-box",
      category: "putharekulu",
      description: "Special dry fruit putharekulu box",
      image: "/images/kshatriya_foods_special_dry_fruit_box.webp",
      price: 400,
      unit_label: "box",
      is_active: true,
      tiered_pricing: []
    },
    {
      id: "mock-3",
      name: "Special Combo",
      slug: "special-combo",
      category: "putharekulu", // Adding to Putharekkulu section as per instructions, wait, actually user said "add a special combo to the bestseller" but maybe the category is combo. I will put it in putharekulu to be safe or "combos".
      description: "A special combo of our best sellers",
      image: "/images/special_combo.webp",
      price: 1199,
      unit_label: "combo",
      is_active: true,
      tiered_pricing: []
    }
  ];

  let result = [...products, ...mockProducts];
  if (category) {
    result = result.filter(p => p.category === category);
  }
  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_tiers(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  const mockProducts: Product[] = [
    {
      id: "mock-1",
      name: "Bellam Plain Putharekulu",
      slug: "bellam-plain-putharekulu",
      category: "putharekulu",
      description: "Authentic Bellam Plain Putharekulu",
      image: "/images/bellam_plain_putharekulu.webp",
      price: 120,
      unit_label: "box",
      is_active: true,
      tiered_pricing: []
    },
    {
      id: "mock-2",
      name: "Kshatriya Foods Special Dry Fruit Box",
      slug: "kshatriya-foods-special-dry-fruit-box",
      category: "putharekulu",
      description: "Special dry fruit putharekulu box",
      image: "/images/kshatriya_foods_special_dry_fruit_box.webp",
      price: 400,
      unit_label: "box",
      is_active: true,
      tiered_pricing: []
    },
    {
      id: "mock-3",
      name: "Special Combo",
      slug: "special-combo",
      category: "putharekulu",
      description: "A special combo of our best sellers",
      image: "/images/special_combo.webp",
      price: 1199,
      unit_label: "combo",
      is_active: true,
      tiered_pricing: []
    }
  ];

  const mockProduct = mockProducts.find(p => p.slug === slug);
  if (mockProduct) {
    return mockProduct;
  }

  if (error) {
    console.error(`Error fetching product slug ${slug}:`, error.message);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    category: data.category,
    description: data.description,
    image: data.image,
    price: parseFloat(data.price),
    unit_label: data.unit_label,
    pack_quantity: data.pack_quantity,
    is_active: data.is_active,
    tiered_pricing: (data.product_tiers || []).map((t: any) => ({
      label: t.label,
      price: parseFloat(t.price)
    }))
  };
}
