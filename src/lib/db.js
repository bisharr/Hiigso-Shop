import { supabase } from "./supabase";

export async function getActiveBranches() {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return { data: data || [], error };
}

export async function getActiveCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return { data: data || [], error };
}

export async function getActiveBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return { data: data || [], error };
}

export async function getFeaturedProducts(limit = 4) {
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
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data: data || [], error };
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

  return { data: data || [], error };
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
      inventory(
        id,
        branch_id,
        stock_quantity,
        reserved_quantity,
        is_available,
        branches(id, name, city)
      )
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

  return { data: data || [], error };
}

/* ---------------- CART ---------------- */

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
}

export async function getMyActiveCart() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { data: null, error: userError || new Error("User not found.") };
  }

  const { data, error } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { data, error };
}

export async function createMyCart() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { data: null, error: userError || new Error("User not found.") };
  }

  const { data, error } = await supabase
    .from("carts")
    .insert([{ user_id: user.id, status: "active" }])
    .select()
    .single();

  return { data, error };
}

export async function getOrCreateMyActiveCart() {
  const existing = await getMyActiveCart();

  if (existing.data) {
    return existing;
  }

  return await createMyCart();
}

export async function getMyCartItems() {
  const cartResult = await getOrCreateMyActiveCart();

  if (cartResult.error || !cartResult.data) {
    return { data: [], error: cartResult.error, cart: null };
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      branches(id, name, city),
      products(
        id,
        name,
        slug,
        price,
        status,
        sku,
        product_images(id, image_url, alt_text, is_primary, sort_order)
      )
    `,
    )
    .eq("cart_id", cartResult.data.id)
    .order("created_at", { ascending: false });

  return { data: data || [], error, cart: cartResult.data };
}

export async function addToCart({
  productId,
  branchId,
  quantity = 1,
  unitPrice,
}) {
  const cartResult = await getOrCreateMyActiveCart();

  if (cartResult.error || !cartResult.data) {
    return { data: null, error: cartResult.error };
  }

  const cartId = cartResult.data.id;

  const { data: existingItem, error: existingError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .eq("branch_id", branchId)
    .maybeSingle();

  if (existingError) {
    return { data: null, error: existingError };
  }

  if (existingItem) {
    const { data, error } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantity,
        unit_price: unitPrice,
      })
      .eq("id", existingItem.id)
      .select()
      .single();

    return { data, error };
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert([
      {
        cart_id: cartId,
        product_id: productId,
        branch_id: branchId,
        quantity,
        unit_price: unitPrice,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function updateCartItemQuantity(itemId, quantity) {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .select()
    .single();

  return { data, error };
}

export async function removeCartItem(itemId) {
  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
  return { error };
}

/* ---------------- WISHLIST ---------------- */

export async function getMyWishlistItems() {
  const { data, error } = await supabase
    .from("wishlist_items")
    .select(
      `
      *,
      products(
        id,
        name,
        slug,
        price,
        compare_at_price,
        short_description,
        description,
        rating_average,
        rating_count,
        status,
        brands(id, name, slug),
        product_images(id, image_url, alt_text, is_primary, sort_order)
      )
    `,
    )
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}

export async function getWishlistItemByProduct(productId) {
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();

  return { data, error };
}

export async function addToWishlist(productId) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { data: null, error: userError || new Error("User not found.") };
  }

  const { data, error } = await supabase
    .from("wishlist_items")
    .insert([{ user_id: user.id, product_id: productId }])
    .select()
    .single();

  return { data, error };
}

export async function removeFromWishlistByProduct(productId) {
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("product_id", productId);

  return { error };
}

/* ---------------- ORDERS / CHECKOUT ---------------- */

export function calculateCartSubtotal(items = []) {
  return items.reduce(
    (sum, item) => sum + Number(item.unit_price) * Number(item.quantity),
    0,
  );
}

export function calculateDeliveryFee(fulfillmentMethod) {
  return fulfillmentMethod === "delivery" ? 5 : 0;
}

export async function createOrderFromCart({ cart, cartItems, checkoutData }) {
  try {
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
      return { data: null, error: userError || new Error("User not found.") };
    }

    if (!cart?.id) {
      return { data: null, error: new Error("Active cart not found.") };
    }

    if (!cartItems?.length) {
      return { data: null, error: new Error("Cart is empty.") };
    }

    const subtotal = calculateCartSubtotal(cartItems);
    const deliveryFee = calculateDeliveryFee(checkoutData.fulfillmentMethod);
    const discountAmount = 0;
    const totalAmount = subtotal + deliveryFee - discountAmount;

    const invalidBranchItem = cartItems.find(
      (item) => item.branch_id !== checkoutData.branchId,
    );

    if (invalidBranchItem) {
      return {
        data: null,
        error: new Error(
          "All cart items must belong to the same selected branch for checkout.",
        ),
      };
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_id: user.id,
          branch_id: checkoutData.branchId,
          fulfillment_method: checkoutData.fulfillmentMethod,
          payment_status: "pending",
          status: "pending",
          contact_name: checkoutData.contactName,
          contact_phone: checkoutData.contactPhone,
          contact_email: checkoutData.contactEmail || null,
          delivery_address:
            checkoutData.fulfillmentMethod === "delivery"
              ? checkoutData.deliveryAddress || null
              : null,
          customer_note: checkoutData.customerNote || null,
          subtotal,
          delivery_fee: deliveryFee,
          discount_amount: discountAmount,
          total_amount: totalAmount,
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      return {
        data: null,
        error: orderError || new Error("Failed to create order."),
      };
    }

    const orderItemsPayload = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.products?.name || "Product",
      product_sku: item.products?.sku || "N/A",
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: Number(item.unit_price) * Number(item.quantity),
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (orderItemsError) {
      return { data: null, error: orderItemsError };
    }

    const { error: updateCartError } = await supabase
      .from("carts")
      .update({ status: "converted" })
      .eq("id", cart.id);

    if (updateCartError) {
      return { data: null, error: updateCartError };
    }

    const { error: deleteCartItemsError } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id);

    if (deleteCartItemsError) {
      return { data: null, error: deleteCartItemsError };
    }

    return { data: order, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getMyOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      branches(id, name, city)
    `,
    )
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}

export async function getMyOrderById(orderId) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      branches(id, name, city),
      order_items(
        id,
        product_id,
        product_name,
        product_sku,
        quantity,
        unit_price,
        line_total
      )
    `,
    )
    .eq("id", orderId)
    .single();

  return { data, error };
}
