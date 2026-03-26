import { useEffect, useMemo, useState } from "react";
import SectionHeading from "../components/common/SectionHeading";
import ProductGrid from "../components/storefront/ProductGrid";
import {
  getActiveBrands,
  getActiveCategories,
  getPublicProducts,
} from "../lib/db";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function loadShopData() {
      setLoading(true);

      const [
        { data: productData },
        { data: categoryData },
        { data: brandData },
      ] = await Promise.all([
        getPublicProducts(),
        getActiveCategories(),
        getActiveBrands(),
      ]);

      setProducts(productData || []);
      setCategories(categoryData || []);
      setBrands(brandData || []);
      setLoading(false);
    }

    loadShopData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.short_description?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product?.brands?.name?.toLowerCase().includes(query),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category_id === selectedCategory,
      );
    }

    if (selectedBrand !== "all") {
      result = result.filter((product) => product.brand_id === selectedBrand);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        result.sort(
          (a, b) => Number(b.rating_average) - Number(a.rating_average),
        );
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
    }

    return result;
  }, [products, search, selectedCategory, selectedBrand, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Store"
            title="Explore our products"
            subtitle="Browse active products from Hiigso Electronics Online with search, category filters, brand filters, and sorting."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search
              </label>
              <input
                type="text"
                placeholder="Search products, brands, descriptions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
              >
                <option value="all">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_auto]">
            <div className="text-sm font-medium text-slate-500">
              Showing {filteredProducts.length} product
              {filteredProducts.length === 1 ? "" : "s"}
            </div>

            <div className="w-full lg:w-72">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        <ProductGrid
          products={filteredProducts}
          loading={loading}
          skeletonCount={8}
        />
      </section>
    </div>
  );
}
