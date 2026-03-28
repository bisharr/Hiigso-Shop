import { Link, useSearchParams } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePhone,
  HiOutlineCreditCard,
} from "react-icons/hi2";
import { formatPaymentMethod } from "../lib/format";

const WHATSAPP_NUMBER = "252907759273";

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();

  const orderNumber = searchParams.get("orderNumber") || "";
  const paymentMethod = searchParams.get("paymentMethod") || "";
  const fullName = searchParams.get("fullName") || "";
  const phone = searchParams.get("phone") || "";

  const whatsappMessage = encodeURIComponent(
    `Salaan Hiigso Electronics,\n\n` +
      `Waxaan sameeyay order cusub.\n` +
      `Order Number: ${orderNumber}\n` +
      `Magaca: ${fullName}\n` +
      `Telefoon: ${phone}\n` +
      `Habka Lacag Bixinta: ${formatPaymentMethod(paymentMethod)}\n\n` +
      `Fadlan ii xaqiiji order-kayga. Mahadsanid.`,
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full rounded-[32px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <HiOutlineCheckCircle className="h-10 w-10" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Order placed successfully
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Thank you for shopping with Hiigso Electronics. Your order has been
          received successfully.
        </p>

        <div className="mt-6 rounded-2xl bg-blue-50 p-5 ring-1 ring-blue-100">
          <h2 className="text-lg font-bold text-slate-900">
            Farriin Somali ah
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            Waad ku mahadsan tahay dalabkaaga. Order-kaaga si Wacan ayuu noo soo
            gaaray . Fadlan hadii Aad dagdagsan tahay noo soo dir fariin
            WhatsAppkan si aan kuugu xaqiijino dalabkaaga Laguuna dhakhsado,
            gaar ahaan haddii aad lacag ku bixisay EVC, E-Dahab, Sahal/Golis,
            ama Waafi.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 text-left ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Order Number</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {orderNumber}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-left ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Payment Method</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatPaymentMethod(paymentMethod)}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            <HiOutlineChatBubbleLeftRight className="h-5 w-5" />
            WhatsAppKeena
          </a>

          <Link
            to="/account/orders"
            className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            View My Orders(Lasoco Dalabkada)
          </Link>

          <Link
            to="/shop"
            className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <HiOutlinePhone className="h-5 w-5 text-blue-600" />
              <p className="font-semibold text-slate-900">Customer Contact</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">{fullName || "N/A"}</p>
            <p className="text-sm text-slate-600">{phone || "N/A"}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <HiOutlineCreditCard className="h-5 w-5 text-blue-600" />
              <p className="font-semibold text-slate-900">Payment Reminder</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Fadlan hubi inaad noo soo dirto faahfaahinta payment-ka haddii aad
              horay u bixisay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
