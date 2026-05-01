import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How PureWell collects, uses, and protects your information — including email opt-ins, cookies, and third-party services we rely on.",
};

// NOTE: This is a plain-language privacy policy meant to satisfy
// affiliate-program review requirements (Amazon, iHerb, Thrive)
// and reflect what PureWell actually does today. It's not legal
// advice. Re-review with counsel before scaling beyond a hobby
// project, or when adding payment processing, accounts with
// passwords, or international users at scale.

const card = {
  background: "#fff",
  border: "1px solid #e7e3dc",
  borderRadius: "16px",
  padding: "24px",
};
const h2 = { fontSize: "16px", fontWeight: 600 as const, color: "#2d2a24", marginBottom: "10px" };
const p = { fontSize: "14px", color: "#6b6560", lineHeight: "1.8" };
const li = { fontSize: "14px", color: "#6b6560", lineHeight: "1.8", marginBottom: "6px" };

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#2d2a24", marginBottom: "8px" }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: "13px", color: "#9c9488", marginBottom: "32px" }}>
          Last updated: April 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={card}>
            <h2 style={h2}>Plain-English summary</h2>
            <p style={p}>
              PureWell is an affiliate-only wellness catalog. We don&apos;t process payments
              ourselves — every purchase happens on the retailer&apos;s site (Amazon, iHerb, Thrive
              Market). We collect very little: an email address only when you explicitly ask us
              to send you something, basic site-functionality cookies, and standard server logs.
              We never sell your data, and the only people we share information with are the
              specific service providers listed below who help us run the site.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>Information we collect</h2>
            <p style={p}>
              <strong>Email address.</strong> We collect your email when you opt in to receive
              your wellness quiz protocol or a recipe by email, or when you subscribe to our
              newsletter. Each email submission is its own opt-in — you control what you sign up
              for.
            </p>
            <p style={{ ...p, marginTop: "10px" }}>
              <strong>Quiz answers and cart items.</strong> When you take the wellness quiz or
              add products to your cart, those choices are stored locally in your browser
              (localStorage) so they persist across page reloads. They&apos;re not sent to our
              servers unless you explicitly request the email-me-this-plan or email-me-this-recipe
              feature.
            </p>
            <p style={{ ...p, marginTop: "10px" }}>
              <strong>Server-side logs.</strong> Our hosting provider (Vercel) and DNS provider
              (Cloudflare) log standard request data — IP address, user agent, requested URL,
              timestamp — for security and operations. These logs are retained for a short period
              and aren&apos;t tied to your identity.
            </p>
            <p style={{ ...p, marginTop: "10px" }}>
              <strong>What we don&apos;t collect.</strong> We don&apos;t process or store payment
              information (purchases happen on the retailer&apos;s site). We don&apos;t require
              accounts or passwords. We don&apos;t track you across other websites.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>How we use information</h2>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              <li style={li}>To send you the specific wellness plan or recipe you requested.</li>
              <li style={li}>
                If (and only if) you check the marketing-opt-in box, to send occasional wellness
                tips, recipe ideas, and curated product updates. You can unsubscribe at any time
                from any email we send you.
              </li>
              <li style={li}>To run the AI wellness quiz, label analyzer, and recipe generator
                features. These features pass your input to Anthropic&apos;s Claude API to produce
                a response. Your input isn&apos;t stored by Anthropic for training.</li>
              <li style={li}>To operate, maintain, and improve the site itself.</li>
            </ul>
            <p style={{ ...p, marginTop: "10px" }}>
              <strong>We never sell your data.</strong> We don&apos;t share your information with
              advertisers or data brokers. We don&apos;t use your email to target ads on other
              sites.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>Third-party services we rely on</h2>
            <p style={p}>
              We use the following service providers to run PureWell. Each one only sees the
              specific data they need to do their job:
            </p>
            <ul style={{ paddingLeft: "20px", margin: "10px 0 0" }}>
              <li style={li}>
                <strong>Vercel</strong> — site hosting and Web Analytics. Sees standard
                request logs and aggregate page-view data (top pages, referrers, country,
                device). No cookies, no persistent identifiers, no cross-site tracking;
                IP addresses are anonymized.
              </li>
              <li style={li}>
                <strong>Cloudflare</strong> — DNS, CDN, and email forwarding for replies sent to
                hello@purewellnatural.com. Sees standard request logs and forwarded email
                contents (in transit only — Cloudflare doesn&apos;t store our forwarded mail).
              </li>
              <li style={li}>
                <strong>Supabase</strong> — Postgres database where we store the product catalog,
                recipes, and email subscribers (when you opt in). Hosted on AWS in the US.
              </li>
              <li style={li}>
                <strong>Resend</strong> — transactional email delivery. Sees your email address
                and the contents of emails we send to you.
              </li>
              <li style={li}>
                <strong>Anthropic</strong> — AI provider for the quiz, label analyzer, and recipe
                generator. Sees the specific input you provide to those features. Anthropic does
                not use API inputs for model training.
              </li>
              <li style={li}>
                <strong>Affiliate retailers (Amazon, iHerb, Thrive Market)</strong> — when you
                click an affiliate link, the destination retailer&apos;s privacy policy applies.
                We pass an anonymous tracking tag with the link so we can earn commission on a
                purchase, but we don&apos;t share any personal information with them.
              </li>
            </ul>
          </div>

          <div style={card}>
            <h2 style={h2}>Cookies and local storage</h2>
            <p style={p}>
              We use a small number of cookies and browser localStorage entries strictly for
              site functionality:
            </p>
            <ul style={{ paddingLeft: "20px", margin: "10px 0 0" }}>
              <li style={li}>
                <strong>Cart and quiz state</strong> — stored in localStorage so your cart and
                quiz protocol persist across page reloads.
              </li>
              <li style={li}>
                <strong>Retailer preference</strong> — stored in localStorage if you pick a
                preferred retailer in the filter, so the site remembers it next time.
              </li>
              <li style={li}>
                <strong>Admin session</strong> — a session cookie used by the site administrator
                to access the product management interface. Doesn&apos;t apply to regular
                visitors.
              </li>
            </ul>
            <p style={{ ...p, marginTop: "10px" }}>
              We use Vercel Web Analytics for aggregate page-view metrics — it&apos;s
              cookie-free and doesn&apos;t set any persistent identifiers, so it isn&apos;t
              listed above. We don&apos;t use any third-party advertising or cross-site
              tracking cookies.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>Your rights</h2>
            <p style={p}>
              Regardless of where you live, you can do the following at any time:
            </p>
            <ul style={{ paddingLeft: "20px", margin: "10px 0 0" }}>
              <li style={li}>
                <strong>Unsubscribe from emails</strong> — every email we send has an
                unsubscribe link in the footer. Clicking it stops all future emails to that
                address.
              </li>
              <li style={li}>
                <strong>Request deletion of your data</strong> — email us at
                hello@purewellnatural.com and we&apos;ll remove your subscriber record from our
                database within 30 days.
              </li>
              <li style={li}>
                <strong>Request access to your data</strong> — same email; we&apos;ll send back
                whatever we have on file (typically just your email address and opt-in status).
              </li>
              <li style={li}>
                <strong>Clear your cart and quiz history</strong> — clear your browser&apos;s
                localStorage for purewellnatural.com, or use private/incognito browsing.
              </li>
            </ul>
            <p style={{ ...p, marginTop: "10px" }}>
              <strong>California residents</strong> have additional rights under the CCPA/CPRA
              (right to know, delete, correct, opt out of sale, and non-discrimination). We
              don&apos;t sell personal information, but you can still exercise these rights via
              the email above.
            </p>
            <p style={{ ...p, marginTop: "10px" }}>
              <strong>EU/UK residents</strong> have rights under the GDPR (access, rectification,
              erasure, portability, restriction, objection). Same email applies. Our legal basis
              for processing is your consent (for marketing) and legitimate interest in
              operating the service (for transactional and security purposes).
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>Children&apos;s privacy</h2>
            <p style={p}>
              PureWell isn&apos;t directed at children under 13, and we don&apos;t knowingly
              collect personal information from anyone under 13. If you believe a child has
              provided us with personal information, contact us and we&apos;ll delete it.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>Data retention</h2>
            <p style={p}>
              Subscriber records are kept for as long as you remain subscribed plus a short
              archival period after unsubscribe (so we can honor your unsubscribe across all
              future emails). Server logs from Vercel and Cloudflare are retained on their
              standard schedules (typically 30–90 days). Quiz answers and cart items in your
              browser&apos;s localStorage stay until you clear them.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>Changes to this policy</h2>
            <p style={p}>
              If we make material changes to this policy, we&apos;ll update the date at the top
              and post a notice on the site. For any change that meaningfully affects your
              rights, we&apos;ll email subscribers ahead of time.
            </p>
          </div>

          <div style={{ ...card, background: "#eef5f0", border: "1px solid #c8ddd0" }}>
            <h2 style={h2}>Contact</h2>
            <p style={p}>
              Questions about this policy or your data? Email us at{" "}
              <a href="mailto:hello@purewellnatural.com" style={{ color: "#3d6b4f", textDecoration: "underline" }}>
                hello@purewellnatural.com
              </a>
              . You can also review our <Link href="/disclosure" style={{ color: "#3d6b4f", textDecoration: "underline" }}>Affiliate Disclosure</Link> and{" "}
              <Link href="/terms" style={{ color: "#3d6b4f", textDecoration: "underline" }}>Terms of Service</Link>.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
