import Link from "next/link";

export default function OrderConfirmed() {
  return (
    <main>
      <nav className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
        <div className="text-lg font-medium">
          pure<span className="text-emerald-700">well</span>
        </div>
      </nav>

      <div className="max-w-lg mx-auto text-center px-5 py-16">
        <div
          className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            className="w-8 h-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 mb-3">
          Order confirmed!
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Thank you for your order. Your natural wellness products are on their
          way. Check your email for confirmation and tracking details.
        </p>

        <div className="bg-emerald-50 rounded-xl p-5 mb-8 text-left">
          <div className="text-sm font-medium text-emerald-800 mb-2">
            What happens next
          </div>
          <ul className="text-sm text-emerald-700 space-y-2">
            <li>✓ Order confirmation email sent</li>
            <li>✓ Ships within 1–2 business days</li>
            <li>✓ Tracking number sent when order ships</li>
          </ul>
        </div>

        <Link
          href="/"
          className="bg-emerald-600 text-white font-medium px-8 py-3 rounded-xl inline-block hover:bg-emerald-700 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}