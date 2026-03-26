import { supabase } from "./supabase";

export async function getActiveBranches() {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return { data, error };
}

export async function getActiveCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return { data, error };
}

export async function getActiveBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return { data, error };
}

export async function getPublicProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(id, name, slug),
      brands(id, name, slug),
      product_images(id, image_url, alt_text, is_primary, sort_order)
    `,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getPublicProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(id, name, slug),
      brands(id, name, slug),
      product_images(id, image_url, alt_text, is_primary, sort_order),
      inventory(id, branch_id, stock_quantity, reserved_quantity, is_available, branches(id, name, city))
    `,
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  return { data, error };
}

export async function getApprovedReviews(productId) {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      title,
      comment,
      created_at,
      user_id
    `,
    )
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return { data, error };
}
