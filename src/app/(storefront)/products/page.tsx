import { getProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const filteredProducts = await getProducts(category);

  const categories = [
    { id: "", label: "All" },
    { id: "putharekulu", label: "Putharekulu" },
    { id: "mamidi-tandara", label: "Mamidi Tandara" },
    { id: "tati-specials", label: "Tati Specials" },
    { id: "traditional-sweets", label: "Traditional Sweets" },
    { id: "traditional-snacks", label: "Traditional Snacks" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-maroon mb-4">
          Our Collection
        </h1>
        <div className="h-1 w-24 bg-primary-maroon mx-auto mb-8"></div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((c) => (
            <a
              key={c.id}
              href={c.id ? `/products?category=${c.id}` : "/products"}
              className={`px-6 py-2 rounded-full border transition-colors ${
                (category === c.id || (!category && c.id === ""))
                  ? "bg-primary-maroon text-matte-black border-primary-maroon font-medium shadow-[0_0_15px_rgba(128,0,0,0.4)]"
                  : "bg-transparent text-text-primary/80 border-primary-maroon/30 hover:border-primary-maroon hover:text-primary-maroon"
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-xl text-text-primary/60">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
