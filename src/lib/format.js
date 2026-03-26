export function formatCurrency(amount) {
  const value = Number(amount || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPaymentMethod(method) {
  switch (method) {
    case "sahal_golis":
      return "Sahal / Golis";
    case "evc":
      return "EVC";
    case "edahab":
      return "E-Dahab";
    case "salaam_bank_waafi":
      return "Salaam Bank / Waafi";
    case "cash_on_delivery":
      return "Cash on Delivery";
    default:
      return "Unknown";
  }
}
