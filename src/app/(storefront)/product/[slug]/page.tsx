import { getProductBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
export const revalidate = 60;
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Leaf } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <Link href="/products" className="inline-flex items-center text-primary-maroon hover:text-primary-maroon-dark mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-primary-maroon-antique/30 shadow-[0_0_30px_rgba(128,0,0,0.05)] bg-background">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                quality={60}
              />
            ) : (
              <div className="absolute inset-0 border-2 border-dashed border-primary-maroon-antique/20 m-4 rounded-lg flex items-center justify-center">
                <span className="font-heading text-primary-maroon-dark/60">Image Coming Soon</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 rounded-full border border-primary-maroon/30 bg-primary-maroon/5 text-primary-maroon text-xs font-medium tracking-wide uppercase">
              {product.category.replace(/-/g, " ")}
            </span>
          </div>
          
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-text-primary mb-4">
            {product.name}
          </h1>
          
          <div className="text-2xl font-semibold text-primary-maroon mb-6">
            {!product.tiered_pricing && (
              <>₹{product.price} <span className="text-sm font-normal text-text-primary/60">{product.unit_label}</span></>
            )}
            {product.tiered_pricing && (
              <>From ₹{Math.min(...product.tiered_pricing.map(t => t.price))}</>
            )}
          </div>
          
          <p className="text-text-primary/80 leading-relaxed text-lg mb-8">
            {product.description}
          </p>

          <div className="flex gap-6 mb-8 border-y border-primary-maroon/10 py-6">
            <div className="flex items-center gap-2 text-sm text-text-primary/80">
              <Leaf className="h-5 w-5 text-primary-maroon" />
              <span>100% Pure Ingredients</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-primary/80">
              <ShieldCheck className="h-5 w-5 text-primary-maroon" />
              <span>No Preservatives</span>
            </div>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
