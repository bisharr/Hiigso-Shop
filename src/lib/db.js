import { supabase } from "./supabase";

/* ---------------- BASIC PUBLIC DATA ---------------- */

export async function getActiveBranches() {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return { data: data || [], error };
}

export async function getAllBranches() {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
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
      product_images(id, image_url, alt_text, is_primary, sort_order),
      inventory(
        id,
        branch_id,
        stock_quantity,
        reserved_quantity,
        low_stock_threshold,
        is_available,
        branches(id, name, city, is_active)
      )
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
      product_images(id, image_url, alt_text, is_primary, sort_order),
      inventory(
        id,
        branch_id,
        stock_quantity,
        reserved_quantity,
        low_stock_threshold,
        is_available,
        branches(id, name, city, is_active)
      )
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
        low_stock_threshold,
        is_available,
        branches(id, name, city, address, phone, email, is_active)
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

/* ---------------- AUTH / USER ---------------- */

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
}

export async function getAdminStaffProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, branch_id, is_active")
    .in("role", ["staff", "branch_manager", "admin", "super_admin"])
    .order("full_name", { ascending: true });

  return { data: data || [], error };
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      branches(id, name, city)
    `,
    )
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}

export async function updateProfileRole(profileId, role) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", profileId)
    .select()
    .single();

  return { data, error };
}

export async function updateProfileBranch(profileId, branchId) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ branch_id: branchId || null })
    .eq("id", profileId)
    .select()
    .single();

  return { data, error };
}

export async function updateProfileActiveStatus(profileId, isActive) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", profileId)
    .select()
    .single();

  return { data, error };
}

/* ---------------- CART ---------------- */

export function calculateCartSubtotal(items = []) {
  return items.reduce(
    (sum, item) => sum + Number(item.unit_price) * Number(item.quantity),
    0,
  );
}

export function calculateDeliveryFee(fulfillmentMethod) {
  return fulfillmentMethod === "delivery" ? 3 : 0;
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
  if (existing.data) return existing;
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

/* ---------------- ORDERS ---------------- */

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
          payment_method: checkoutData.paymentMethod,
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

/* ---------------- REVIEWS ---------------- */

export async function getMyReviewForProduct(productId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();

  return { data, error };
}

export async function submitProductReview({
  productId,
  rating,
  title,
  comment,
}) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { data: null, error: userError || new Error("User not found.") };
  }

  const existing = await getMyReviewForProduct(productId);

  if (existing.data) {
    const { data, error } = await supabase
      .from("reviews")
      .update({
        rating,
        title: title || null,
        comment: comment || null,
        is_approved: false,
      })
      .eq("id", existing.data.id)
      .select()
      .single();

    return { data, error };
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert([
      {
        product_id: productId,
        user_id: user.id,
        rating,
        title: title || null,
        comment: comment || null,
        is_approved: false,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function getAdminReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      products!reviews_product_id_fkey(id, name, slug),
      profiles!reviews_user_id_fkey(id, full_name, email)
    `,
    )
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}

export async function updateReviewApproval(reviewId, isApproved) {
  const { data, error } = await supabase
    .from("reviews")
    .update({ is_approved: isApproved })
    .eq("id", reviewId)
    .select()
    .single();

  return { data, error };
}

/* ---------------- NOTIFICATIONS ---------------- */

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
}) {
  const { data, error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: userId,
        title,
        message,
        type,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function getMyNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}

export async function markNotificationAsRead(notificationId) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single();

  return { data, error };
}

export async function markAllNotificationsAsRead() {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);

  return { error };
}

/* ---------------- ADMIN MASTER DATA ---------------- */

export async function createBranch(payload) {
  const { data, error } = await supabase
    .from("branches")
    .insert([
      {
        name: payload.name,
        slug: payload.slug,
        city: payload.city,
        address: payload.address || null,
        phone: payload.phone || null,
        email: payload.email || null,
        is_active: !!payload.is_active,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function updateBranch(branchId, payload) {
  const { data, error } = await supabase
    .from("branches")
    .update({
      name: payload.name,
      slug: payload.slug,
      city: payload.city,
      address: payload.address || null,
      phone: payload.phone || null,
      email: payload.email || null,
      is_active: !!payload.is_active,
    })
    .eq("id", branchId)
    .select()
    .single();

  return { data, error };
}

export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}

export async function createCategory(payload) {
  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        name: payload.name,
        slug: payload.slug,
        description: payload.description || null,
        is_active: !!payload.is_active,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function updateCategory(categoryId, payload) {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: payload.name,
      slug: payload.slug,
      description: payload.description || null,
      is_active: !!payload.is_active,
    })
    .eq("id", categoryId)
    .select()
    .single();

  return { data, error };
}

export async function getAllBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}

export async function createBrand(payload) {
  const { data, error } = await supabase
    .from("brands")
    .insert([
      {
        name: payload.name,
        slug: payload.slug,
        is_active: !!payload.is_active,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function updateBrand(brandId, payload) {
  const { data, error } = await supabase
    .from("brands")
    .update({
      name: payload.name,
      slug: payload.slug,
      is_active: !!payload.is_active,
    })
    .eq("id", brandId)
    .select()
    .single();

  return { data, error };
}

/* ---------------- ADMIN PRODUCTS ---------------- */

export async function getAdminProducts() {
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
        low_stock_threshold,
        is_available,
        branches(id, name, city, is_active)
      )
    `,
    )
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}

export async function getAdminProductById(productId) {
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
        low_stock_threshold,
        is_available,
        branches(id, name, city, address, phone, email, is_active)
      )
    `,
    )
    .eq("id", productId)
    .single();

  return { data, error };
}

export async function createProduct(payload) {
  const { user } = await getCurrentUser();

  const insertPayload = {
    category_id: payload.category_id || null,
    brand_id: payload.brand_id || null,
    name: payload.name,
    slug: payload.slug,
    sku: payload.sku,
    short_description: payload.short_description || null,
    description: payload.description || null,
    price: Number(payload.price || 0),
    compare_at_price: payload.compare_at_price
      ? Number(payload.compare_at_price)
      : null,
    is_featured: !!payload.is_featured,
    status: payload.status || "draft",
    created_by: user?.id || null,
    updated_by: user?.id || null,
  };

  const { data, error } = await supabase
    .from("products")
    .insert([insertPayload])
    .select()
    .single();

  return { data, error };
}

export async function updateProduct(productId, payload) {
  const { user } = await getCurrentUser();

  const updatePayload = {
    category_id: payload.category_id || null,
    brand_id: payload.brand_id || null,
    name: payload.name,
    slug: payload.slug,
    sku: payload.sku,
    short_description: payload.short_description || null,
    description: payload.description || null,
    price: Number(payload.price || 0),
    compare_at_price: payload.compare_at_price
      ? Number(payload.compare_at_price)
      : null,
    is_featured: !!payload.is_featured,
    status: payload.status || "draft",
    updated_by: user?.id || null,
  };

  const { data, error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", productId)
    .select()
    .single();

  return { data, error };
}

export async function deleteProduct(productId) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  return { error };
}

export async function uploadProductImageFile(file, productId) {
  if (!file) {
    return { data: null, error: new Error("No file selected.") };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return {
      data: null,
      error: new Error("Only JPG, PNG, and WEBP images are allowed."),
    };
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      data: null,
      error: new Error("Image must be 5MB or smaller."),
    };
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
  const fileName = `${productId}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return {
    data: {
      path: filePath,
      publicUrl: data.publicUrl,
    },
    error: null,
  };
}

export async function saveProductPrimaryImage({
  productId,
  imageUrl,
  altText,
}) {
  if (!imageUrl?.trim()) {
    return { data: null, error: null };
  }

  const { data: existingImages } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (existingImages?.length) {
    const primaryImage =
      existingImages.find((img) => img.is_primary) || existingImages[0];

    const { data, error } = await supabase
      .from("product_images")
      .update({
        image_url: imageUrl,
        alt_text: altText || null,
        is_primary: true,
        sort_order: 0,
      })
      .eq("id", primaryImage.id)
      .select()
      .single();

    return { data, error };
  }

  const { data, error } = await supabase
    .from("product_images")
    .insert([
      {
        product_id: productId,
        image_url: imageUrl,
        alt_text: altText || null,
        is_primary: true,
        sort_order: 0,
      },
    ])
    .select()
    .single();

  return { data, error };
}

/* ---------------- ADMIN INVENTORY ---------------- */

export async function getInventoryByProduct(productId) {
  const { data, error } = await supabase
    .from("inventory")
    .select(
      `
      *,
      branches(id, name, city)
    `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: true });

  return { data: data || [], error };
}

export async function upsertInventoryRow(payload) {
  const { data: existing, error: existingError } = await supabase
    .from("inventory")
    .select("*")
    .eq("product_id", payload.product_id)
    .eq("branch_id", payload.branch_id)
    .maybeSingle();

  if (existingError) {
    return { data: null, error: existingError };
  }

  if (existing) {
    const { data, error } = await supabase
      .from("inventory")
      .update({
        stock_quantity: Number(payload.stock_quantity || 0),
        reserved_quantity: Number(payload.reserved_quantity || 0),
        low_stock_threshold: Number(payload.low_stock_threshold || 0),
        is_available: !!payload.is_available,
      })
      .eq("id", existing.id)
      .select()
      .single();

    return { data, error };
  }

  const { data, error } = await supabase
    .from("inventory")
    .insert([
      {
        product_id: payload.product_id,
        branch_id: payload.branch_id,
        stock_quantity: Number(payload.stock_quantity || 0),
        reserved_quantity: Number(payload.reserved_quantity || 0),
        low_stock_threshold: Number(payload.low_stock_threshold || 0),
        is_available: !!payload.is_available,
      },
    ])
    .select()
    .single();

  return { data, error };
}

/* ---------------- ADMIN ORDERS ---------------- */

export async function getAdminOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      branches(id, name, city, address, phone, email),
      customer:profiles!orders_customer_id_fkey(id, full_name, email),
      assigned_staff:profiles!orders_assigned_staff_id_fkey(id, full_name, email, role),
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
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}

export async function getAdminOrderById(orderId) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      branches(id, name, city, address, phone, email),
      customer:profiles!orders_customer_id_fkey(id, full_name, email),
      assigned_staff:profiles!orders_assigned_staff_id_fkey(id, full_name, email, role),
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

export async function updateOrderStatus(orderId, status) {
  const { data: beforeData } = await supabase
    .from("orders")
    .select("id, status, customer_id, order_number")
    .eq("id", orderId)
    .single();

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (!error && data?.customer_id && beforeData?.status !== status) {
    await createNotification({
      userId: data.customer_id,
      title: "Order status updated",
      message: `Your order ${data.order_number || ""} is now ${status}.`,
      type: "info",
    });
  }

  return { data, error };
}

export async function updateOrderPaymentStatus(orderId, paymentStatus) {
  const { data, error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("id", orderId)
    .select()
    .single();

  return { data, error };
}

export async function assignOrderStaff(orderId, assignedStaffId) {
  const { data, error } = await supabase
    .from("orders")
    .update({ assigned_staff_id: assignedStaffId || null })
    .eq("id", orderId)
    .select()
    .single();

  return { data, error };
}

/* ---------------- DASHBOARD ANALYTICS ---------------- */

export async function getDashboardAnalytics() {
  const [
    { data: orders, error: ordersError },
    { data: inventory, error: inventoryError },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select(
        `
          id,
          status,
          payment_status,
          total_amount,
          created_at,
          branch_id
        `,
      )
      .order("created_at", { ascending: false }),

    supabase.from("inventory").select(`
          id,
          stock_quantity,
          low_stock_threshold,
          is_available,
          product_id,
          branch_id,
          products(id, name, sku),
          branches(id, name, city)
        `),
  ]);

  return {
    data: {
      orders: orders || [],
      inventory: inventory || [],
    },
    error: ordersError || inventoryError || null,
  };
}
