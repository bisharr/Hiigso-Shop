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

export function getPaymentMethodDetails(method) {
  switch (method) {
    case "sahal_golis":
      return {
        label: "Sahal / Golis",
        accountName: "Hiigso Electronics",
        accountNumber: "0612345678",
        note: "Fadlan ku dir lacagta Sahal/Golis kadibna xaqiiji order-kaaga.",
      };
    case "evc":
      return {
        label: "EVC",
        accountName: "Hiigso Electronics",
        accountNumber: "252612345678",
        note: "Fadlan ku dir lacagta EVC kadibna sii wad order-ka.",
      };
    case "edahab":
      return {
        label: "E-Dahab",
        accountName: "Hiigso Electronics",
        accountNumber: "652345678",
        note: "Fadlan ku bixi E-Dahab account-kan.",
      };
    case "salaam_bank_waafi":
      return {
        label: "Salaam Bank / Waafi",
        accountName: "Hiigso Electronics",
        accountNumber: "WAAFI-998877",
        note: "Isticmaal Salaam Bank ama Waafi si aad u bixiso.",
      };
    case "cash_on_delivery":
      return {
        label: "Cash on Delivery",
        accountName: "Hiigso Electronics",
        accountNumber: "No account needed",
        note: "Waxaad lacagta siinaysaa marka alaabta laguu keeno.",
      };
    default:
      return {
        label: "Unknown",
        accountName: "Hiigso Electronics",
        accountNumber: "N/A",
        note: "",
      };
  }
}
