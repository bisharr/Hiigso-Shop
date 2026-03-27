import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineBolt,
  HiOutlineBuildingStorefront,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineDevicePhoneMobile,
  HiOutlineGlobeAlt,
  HiOutlineShoppingBag,
  HiOutlineStar,
  HiOutlineCheckCircle,
  HiOutlineGift,
  HiOutlineMapPin,
  HiOutlineSparkles,
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
      try {
        setLoadingProducts(true);
        setLoadingBranches(true);

        const [{ data: products }, { data: branchData }] = await Promise.all([
          getFeaturedProducts(4),
          getActiveBranches(),
        ]);

        setFeaturedProducts(products || []);
        setBranches(branchData || []);
      } catch (error) {
        console.error("Failed to load home data:", error);
        setFeaturedProducts([]);
        setBranches([]);
      } finally {
        setLoadingProducts(false);
        setLoadingBranches(false);
      }
    }

    loadHomeData();
  }, []);

  const heroCards = [
    {
      title: "Multi-Branch Support",
      text: "Products, stock, and branch availability all in one clean system.",
      icon: <HiOutlineBuildingStorefront className="h-6 w-6" />,
    },
    {
      title: "Fast Experience",
      text: "Degdeg, smooth, and easy to use on mobile, tablet, and desktop.",
      icon: <HiOutlineBolt className="h-6 w-6" />,
    },
    {
      title: "Secure Checkout",
      text: "Shopping flow ammaan ah with a trusted customer experience.",
      icon: <HiOutlineShieldCheck className="h-6 w-6" />,
    },
    {
      title: "Delivery & Pickup",
      text: "Macmiilka si fudud ayuu u dooran karaa delivery ama pickup.",
      icon: <HiOutlineTruck className="h-6 w-6" />,
    },
  ];

  const trustFeatures = [
    {
      title: "Best Value",
      text: "Electronics tayo leh with pricing that feels fair and attractive.",
      icon: <HiOutlineGift className="h-6 w-6" />,
    },
    {
      title: "Modern Products",
      text: "Phones, laptops, accessories, and more in one organized place.",
      icon: <HiOutlineDevicePhoneMobile className="h-6 w-6" />,
    },
    {
      title: "Trusted Shopping",
      text: "Dalabkaaga, payment-kaaga, iyo xogtaada si ammaan ah ayaa loo maareeyaa.",
      icon: <HiOutlineCheckCircle className="h-6 w-6" />,
    },
    {
      title: "Shop Anywhere",
      text: "Online uga dalbo si fudud meel kasta oo aad joogto.",
      icon: <HiOutlineGlobeAlt className="h-6 w-6" />,
    },
  ];

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.10),transparent_22%)]"></div>

        <div className="absolute -left-16 top-12 h-40 w-40 rounded-full bg-green-400/10 blur-3xl"></div>
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-blue-400/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-white/5 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 ring-1 ring-white/15 backdrop-blur">
              <HiOutlineSparkles className="h-4 w-4" />
              Welcome to Hiigso Electronics Online
            </span>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Smart electronics shopping
              <span className="mt-1 block text-green-400">
                simple, secure, and modern
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Discover phones, laptops, accessories, and everyday tech with a
              clean storefront that feels fast, modern, and easy to use.
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Hiigso waxay kuu keenaysaa shopping experience qurux badan, adeeg
              la isku halayn karo, iyo branch-yo kuu sahlaya helitaanka alaabta
              aad rabto.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="rounded-2xl bg-green-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 hover:text-black"
              >
                Explore Store
              </Link>

              <Link
                to="/register"
                className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-green-300">
                  <HiOutlineShieldCheck className="h-5 w-5" />
                  <p className="text-base font-bold">Secure</p>
                </div>
                <p className="mt-1 text-sm text-slate-200">
                  Safe checkout and trusted flow.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-blue-200">
                  <HiOutlineTruck className="h-5 w-5" />
                  <p className="text-base font-bold">Fast</p>
                </div>
                <p className="mt-1 text-sm text-slate-200">
                  Dalab fudud iyo adeeg degdeg ah.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-yellow-300">
                  <HiOutlineStar className="h-5 w-5" />
                  <p className="text-base font-bold">Trusted</p>
                </div>
                <p className="mt-1 text-sm text-slate-200">
                  Built to impress your customers.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-200">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/10">
                <HiOutlineShoppingBag className="h-4 w-4 text-green-300" />
                Easy shopping
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/10">
                <HiOutlineMapPin className="h-4 w-4 text-blue-200" />
                Multiple branches
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/10">
                <HiOutlineBolt className="h-4 w-4 text-yellow-300" />
                Modern experience
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {heroCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[26px] bg-white/10 p-5 backdrop-blur ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3 text-blue-100">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold">{card.title}</h3>
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
          badge="Why choose us"
          title="Modern, reliable, and easy to use"
          subtitle="Hiigso Electronics Online combines clean design, trusted shopping, and strong multi-branch support to create a better customer experience."
          align="center"
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trustFeatures.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-700">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div className="rounded-[30px] bg-gradient-to-r from-blue-700 via-slate-900 to-slate-950 px-6 py-8 text-white shadow-lg sm:px-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/15">
                Better design • Better trust • Better sales
              </span>

              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                Shop smarter with Hiigso
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
                Whether your customer wants a new phone, a laptop, or a useful
                accessory, Hiigso gives them a cleaner and more attractive
                buying experience.
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
                Hiigso waxay kuu keenaysaa shopping experience qurux badan,
                adeeg la isku halayn karo, iyo branch-yo kuu sahlaya helitaanka
                alaabta aad rabto. Dalabkaaga, payment-kaaga, iyo xogtaada si
                ammaan ah ayaa loo maareeyaa, adigoo siinaya kalsooni buuxda
                markaad wax iibsanayso.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                <p className="text-2xl font-bold">24/7</p>
                <p className="mt-2 text-sm text-white/90">
                  Browse products anytime.
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                <p className="text-2xl font-bold">Responsive</p>
                <p className="mt-2 text-sm text-white/90">
                  Works well across all screens.
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                <p className="text-2xl font-bold">Secure</p>
                <p className="mt-2 text-sm text-white/90">
                  Safe and trusted shopping flow.
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                <p className="text-2xl font-bold">Brand Match</p>
                <p className="mt-2 text-sm text-white/90">
                  Same color direction and clean layout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Featured"
          title="Featured products"
          subtitle="Highlighted products ready to attract attention and boost conversions."
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
          title="Serving customers across different locations"
          subtitle="Hiigso makes it easier to manage and showcase branches in a clear and organized way."
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
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <HiOutlineBuildingStorefront className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
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
