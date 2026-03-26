import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineBolt,
  HiOutlineBuildingStorefront,
  HiOutlineShieldCheck,
  HiOutlineTruck,
} from "react-icons/hi2";
import SectionHeading from "../components/common/SectionHeading";
import ProductGrid from "../components/storefront/ProductGrid";
import { getFeaturedProducts, getActiveBranches } from "../lib/db";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoadingProducts(true);
      setLoadingBranches(true);

      const [{ data: products }, { data: branchData }] = await Promise.all([
        getFeaturedProducts(4),
        getActiveBranches(),
      ]);

      setFeaturedProducts(products || []);
      setBranches(branchData || []);
      setLoadingProducts(false);
      setLoadingBranches(false);
    }

    loadHomeData();
  }, []);

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_20%)]"></div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 ring-1 ring-white/15 backdrop-blur">
              Hiigso Electronics Online
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Smart electronics shopping across Somalia
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Discover phones, laptops, accessories, and home electronics with a
              fast, secure, beautiful shopping experience built for modern
              customers and multi-branch business growth.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Explore Store
              </Link>

              <Link
                to="/register"
                className="rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/10">
                <p className="text-2xl font-bold">Secure</p>
                <p className="mt-1 text-sm text-slate-200">
                  RLS-powered data access and protected workflows.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/10">
                <p className="text-2xl font-bold">Responsive</p>
                <p className="mt-1 text-sm text-slate-200">
                  Beautiful mobile, tablet, and desktop experience.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Multi-Branch Ready",
                text: "See products, stock, and branch availability in one system.",
                icon: <HiOutlineBuildingStorefront className="h-6 w-6" />,
              },
              {
                title: "Fast Performance",
                text: "Modern React + Vite storefront with smooth user experience.",
                icon: <HiOutlineBolt className="h-6 w-6" />,
              },
              {
                title: "Secure Shopping",
                text: "Safe auth, protected data, and strong backend rules.",
                icon: <HiOutlineShieldCheck className="h-6 w-6" />,
              },
              {
                title: "Delivery & Pickup",
                text: "Designed for flexible customer fulfillment choices.",
                icon: <HiOutlineTruck className="h-6 w-6" />,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-[28px] bg-white/10 p-6 backdrop-blur ring-1 ring-white/10"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3 text-blue-100">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why customers choose us"
          title="Modern, trusted, and built for real electronics retail"
          subtitle="Hiigso Electronics Online is designed to give customers a premium online shopping experience while giving the business strong control over products, stock, and branch operations."
          align="center"
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Beautiful storefront with fast browsing",
            "Branch-aware product availability",
            "Secure authentication and access control",
            "Scalable system for future growth",
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <p className="text-base font-semibold text-slate-800">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Featured"
          title="Featured products"
          subtitle="Highlighted products ready to impress your customers."
        />
        <ProductGrid
          products={featuredProducts}
          loading={loadingProducts}
          skeletonCount={4}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Branches"
          title="Serving customers across multiple cities"
          subtitle="Multi-branch support is one of the strongest parts of the system."
        />

        {loadingBranches ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="h-5 w-40 animate-pulse rounded bg-slate-200"></div>
                <div className="mt-4 h-4 w-28 animate-pulse rounded bg-slate-200"></div>
                <div className="mt-3 h-4 w-52 animate-pulse rounded bg-slate-200"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  {branch.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-blue-600">
                  {branch.city}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {branch.address || "Address not available yet."}
                </p>
                <div className="mt-4 text-sm text-slate-500">
                  {branch.phone || "Phone not available"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
