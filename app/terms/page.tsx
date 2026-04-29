import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of use for PureWell — the rules and disclaimers covering our affiliate catalog, AI features, recipes, and email opt-ins.",
};

// NOTE: Plain-language terms covering what PureWell actually does
// (affiliate catalog, AI features, recipes, email opt-ins). Not
// legal advice. Re-review with counsel before adding payments,
// user accounts with passwords, paid subscriptions, or anything
// substantially changes the service.

const card = {
  background: "#fff",
  border: "1px solid #e7e3dc",
  borderRadius: "16px",
  padding: "24px",
};
const h2 = { fontSize: "16px", fontWeight: 600 as const, color: "#2d2a24", marginBottom: "10px" };
const p = { fontSize: "14px", color: "#6b6560", lineHeight: "1.8" };
const li = { fontSize: "14px", color: "#6b6560", lineHeight: "1.8", marginBottom: "6px" };

export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5" }}>
      <Navbar />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#2d2a24", marginBottom: "8px" }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: "13px", color: "#9c9488", marginBottom: "32px" }}>
          Last updated: April 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={card}>
            <h2 style={h2}>Plain-English summary</h2>
            <p style={p}>
              PureWell is a curated wellness catalog and educational resource. We don&apos;t sell
              products directly — we link to retailers (Amazon, iHerb, Thrive Market) and earn a
              small commission when you purchase through our links. Our AI quiz, label analyzer,
              recipes, and other content are for general wellness education only and aren&apos;t
              medical advice. By using the site you agree to the terms below.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>1. Acceptance of terms</h2>
            <p style={p}>
              By accessing or using purewellnatural.com (&ldquo;PureWell&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;), you agree to these Terms of Service and our{" "}
              <Link href="/privacy" style={{ color: "#3d6b4f", textDecoration: "underline" }}>Privacy Policy</Link>. If you don&apos;t agree, please don&apos;t use the site.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>2. What PureWell is</h2>
            <p style={p}>
              PureWell is an affiliate-only wellness catalog. We curate natural health products
              from third-party retailers and provide educational content (recipes, AI-powered
              wellness protocols, label analysis). When you click a product link and buy from
              the retailer, we may earn a commission at no extra cost to you. See our{" "}
              <Link href="/disclosure" style={{ color: "#3d6b4f", textDecoration: "underline" }}>Affiliate Disclosure</Link> for details.
            </p>
            <p style={{ ...p, marginTop: "10px" }}>
              We do not sell products directly, process payments, or fulfill orders. Every
              purchase is between you and the retailer, governed by their terms and policies.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>3. Eligibility</h2>
            <p style={p}>
              You must be at least 18 years old (or the age of majority where you live) to use
              PureWell. The site is intended for personal, non-commercial use.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>4. Not medical advice</h2>
            <p style={p}>
              Everything on PureWell — including product descriptions, recipes, the wellness
              quiz, the label analyzer, AI-generated protocols, and recommendations — is for
              general informational and educational purposes only. <strong>It is not medical
              advice and is not a substitute for the advice of a licensed healthcare
              professional.</strong>
            </p>
            <p style={{ ...p, marginTop: "10px" }}>
              Statements about products and ingredients have not been evaluated by the U.S. Food
              and Drug Administration. Products and recipes are not intended to diagnose, treat,
              cure, or prevent any disease.
            </p>
            <p style={{ ...p, marginTop: "10px" }}>
              Always consult your doctor, pharmacist, or qualified healthcare provider before
              starting a new supplement, herb, or wellness routine — especially if you are
              pregnant, nursing, taking medication, managing a chronic condition, or planning
              to give a product to a child.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>5. AI-generated content</h2>
            <p style={p}>
              The wellness quiz, label analyzer, and recipe generator use AI (Anthropic&apos;s
              Claude) to produce personalized output. AI can make mistakes, miss context, or
              generate content that seems authoritative but isn&apos;t medically accurate. Use AI
              output as a starting point, not as a final answer. Verify ingredients,
              interactions, and dosing with a healthcare provider before acting on
              recommendations.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>6. Email opt-in</h2>
            <p style={p}>
              When you opt in to receive a wellness plan, recipe, or newsletter by email, you
              authorize us to send you the requested content and (if you check the marketing
              checkbox) occasional updates. You can unsubscribe at any time using the link in
              every email.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>7. User conduct</h2>
            <p style={p}>You agree not to:</p>
            <ul style={{ paddingLeft: "20px", margin: "10px 0 0" }}>
              <li style={li}>Use the site for any unlawful purpose.</li>
              <li style={li}>Attempt to circumvent security or authentication measures.</li>
              <li style={li}>Submit content (e.g., fake email addresses, scraped product data)
                that would harm us or another party.</li>
              <li style={li}>Scrape, mirror, or systematically extract content from the site
                without our written permission.</li>
              <li style={li}>Use automated tools (bots, crawlers, scripts) to interact with the
                site in ways that degrade performance for other users.</li>
            </ul>
          </div>

          <div style={card}>
            <h2 style={h2}>8. Intellectual property</h2>
            <p style={p}>
              The PureWell name, logo, brand assets, original written content, recipe collection,
              and site design are owned by PureWell and protected by copyright and trademark
              law. Product names, photos, and trademarks belonging to brands and retailers are
              the property of their respective owners and used here under fair use or with the
              permission granted by their affiliate programs.
            </p>
            <p style={{ ...p, marginTop: "10px" }}>
              You&apos;re welcome to share links to PureWell pages on social media or in personal
              correspondence. For commercial republication of our recipes or written content,
              contact us first.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>9. Third-party links</h2>
            <p style={p}>
              The site contains links to third-party retailers (Amazon, iHerb, Thrive Market, and
              others) and external resources. We don&apos;t control those sites and aren&apos;t
              responsible for their content, policies, or the products they sell. When you
              follow an affiliate link, the retailer&apos;s terms and privacy policy apply to
              everything that happens on their site.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>10. Disclaimer of warranties</h2>
            <p style={p}>
              PureWell is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
              warranties of any kind, express or implied, including (but not limited to) implied
              warranties of merchantability, fitness for a particular purpose, accuracy, or
              non-infringement. We don&apos;t warrant that the site will be uninterrupted,
              error-free, secure, or that AI-generated content will be accurate or complete.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>11. Limitation of liability</h2>
            <p style={p}>
              To the fullest extent permitted by law, PureWell, its founders, contributors, and
              service providers shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of or related to your use of the
              site — including (without limitation) damages for loss of profits, goodwill, data,
              or other intangible losses, even if we&apos;ve been advised of the possibility of
              such damages.
            </p>
            <p style={{ ...p, marginTop: "10px" }}>
              We aren&apos;t responsible for any harm resulting from products purchased through
              affiliate links, including allergic reactions, interactions with medications, or
              quality issues — that&apos;s between you, the manufacturer, and the retailer.
              Always read product labels and consult a healthcare professional before use.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>12. Indemnification</h2>
            <p style={p}>
              You agree to indemnify and hold PureWell harmless from any claims, damages,
              liabilities, or expenses (including reasonable attorneys&apos; fees) arising from
              your use of the site, your violation of these terms, or your violation of any
              third-party rights.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>13. Termination</h2>
            <p style={p}>
              We may suspend or terminate your access to the site at any time, with or without
              cause, particularly for behavior that violates these terms or harms other users.
              Sections that by their nature should survive termination (intellectual property,
              disclaimers, liability limits) will continue to apply.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>14. Governing law and disputes</h2>
            <p style={p}>
              These terms are governed by the laws of the United States and the state in which
              PureWell is operated, without regard to conflict-of-law principles. Any dispute
              arising from these terms or your use of the site will first be addressed by good-
              faith negotiation; if that fails, disputes will be resolved in the courts of
              competent jurisdiction in that state.
            </p>
          </div>

          <div style={card}>
            <h2 style={h2}>15. Changes to these terms</h2>
            <p style={p}>
              We may update these terms from time to time. The &ldquo;Last updated&rdquo; date at
              the top reflects the most recent revision. Material changes will be announced via
              a site notice and (where applicable) an email to subscribers. Continued use of the
              site after changes means you accept the updated terms.
            </p>
          </div>

          <div style={{ ...card, background: "#eef5f0", border: "1px solid #c8ddd0" }}>
            <h2 style={h2}>16. Contact</h2>
            <p style={p}>
              Questions about these terms? Email us at{" "}
              <a href="mailto:hello@purewellnatural.com" style={{ color: "#3d6b4f", textDecoration: "underline" }}>
                hello@purewellnatural.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
