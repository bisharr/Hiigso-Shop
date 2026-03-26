import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import EmptyState from "../common/EmptyState";

export default function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 8,
}) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        message="We could not find any products that match your current search or filters."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
