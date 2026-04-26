// HTML email templates for transactional sends. Kept as pure
// string-builder functions instead of a JSX/MJML pipeline because:
//   1. We send max 2 templates today; React Email is overkill.
//   2. Email HTML cares deeply about inline styles + table layout —
//      libraries hide that boilerplate but you need to relearn the
//      escape hatches every time you hit a Gmail clipping bug.
//   3. Pure functions = trivial to unit-test and to migrate later.
//
// Inline styles only. No external CSS files (Gmail strips them).
// Tables for layout where horizontal alignment matters (Outlook
// doesn't support flexbox). Single max-width: 560px container.
//
// Brand colors: #3d6b4f (green), #2d2a24 (text), #faf8f5 (page bg),
// #e7e3dc (border), #6b6560 (secondary text), #9c9488 (muted).

const SITE_URL = "https://purewellnatural.com";

const styles = {
  body: `margin:0;padding:0;background:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2d2a24;`,
  wrap: `max-width:560px;margin:0 auto;padding:32px 24px;`,
  card: `background:#fff;border:1px solid #e7e3dc;border-radius:14px;padding:18px;margin-bottom:12px;`,
  h1: `font-size:22px;font-weight:700;color:#2d2a24;margin:0 0 8px;line-height:1.3;`,
  h2: `font-size:16px;font-weight:600;color:#2d2a24;margin:0 0 6px;`,
  p: `font-size:14px;color:#6b6560;line-height:1.6;margin:0 0 8px;`,
  meta: `font-size:12px;color:#9c9488;margin:0 0 4px;`,
  cta: `display:inline-block;background:#3d6b4f;color:#fff;font-size:14px;font-weight:600;padding:11px 20px;border-radius:10px;text-decoration:none;`,
  ctaLink: `color:#3d6b4f;font-size:13px;font-weight:500;text-decoration:none;`,
  footer: `font-size:11px;color:#9c9488;text-align:center;margin-top:24px;line-height:1.6;`,
  chip: `display:inline-block;background:#f5f2ed;color:#6b6560;font-size:11px;font-weight:500;padding:3px 10px;border-radius:99px;`,
  greenChip: `display:inline-block;background:#eef5f0;color:#3d6b4f;font-size:11px;font-weight:500;padding:3px 10px;border-radius:99px;`,
};

const wrap = (title: string, body: string, unsubscribeUrl: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="${styles.body}">
    <div style="${styles.wrap}">
      <!-- Brand mark -->
      <div style="margin-bottom:24px;">
        <span style="font-size:20px;font-weight:700;color:#2d2a24;">pure<span style="color:#3d6b4f;">well</span></span>
        <span style="font-size:11px;color:#9c9488;margin-left:6px;text-transform:uppercase;letter-spacing:0.04em;">natural wellness</span>
      </div>
      ${body}
      <div style="${styles.footer}">
        These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.
        <br/><br/>
        You're receiving this because you requested it from <a href="${SITE_URL}" style="color:#9c9488;">PureWell</a>.
        <br/>
        <a href="${unsubscribeUrl}" style="color:#9c9488;">Unsubscribe</a>
      </div>
    </div>
  </body>
</html>`;

// Minimal HTML escape so user-supplied content (recipe names, etc.)
// can't inject markup. Not exhaustive but covers the common attack
// vectors for plain text dropped into element bodies/attributes.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ───────────────────────────────────────────────────────────────────────
// QUIZ PROTOCOL email
// ───────────────────────────────────────────────────────────────────────

export type ProtocolEmailItem =
  | {
      kind: "supplement";
      timing: string;
      reason: string;
      product: { name: string; brand: string; price: number; slug: string };
    }
  | {
      kind: "recipe";
      timing: string;
      reason: string;
      recipe: { name: string; slug: string; type: string; prepTime: number };
    };

export type ProtocolEmailPayload = {
  protocolName: string;
  summary: string;
  weeklyTip: string;
  items: ProtocolEmailItem[];
};

export function renderProtocolEmail(
  payload: ProtocolEmailPayload,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const subject = `Your PureWell wellness plan: ${payload.protocolName}`;

  const itemCards = payload.items
    .map((item) => {
      if (item.kind === "supplement") {
        const p = item.product;
        return `<div style="${styles.card}">
          <div style="${styles.meta}">${escapeHtml(p.brand)}</div>
          <div style="${styles.h2}">${escapeHtml(p.name)}</div>
          <div style="margin:6px 0 10px;">
            <span style="${styles.chip}">${escapeHtml(item.timing)}</span>
            <span style="${styles.chip};margin-left:4px;">Supplement</span>
            <span style="${styles.greenChip};margin-left:4px;">$${p.price.toFixed(2)}</span>
          </div>
          <div style="${styles.p}">${escapeHtml(item.reason)}</div>
          <a href="${SITE_URL}/products/${encodeURIComponent(p.slug)}?from=quiz" style="${styles.ctaLink}">View product →</a>
        </div>`;
      }
      const r = item.recipe;
      return `<div style="${styles.card}">
        <div style="${styles.h2}">${escapeHtml(r.name)}</div>
        <div style="margin:6px 0 10px;">
          <span style="${styles.chip}">${escapeHtml(item.timing)}</span>
          <span style="${styles.chip};margin-left:4px;">Recipe · ${escapeHtml(r.type)}</span>
          <span style="${styles.chip};margin-left:4px;">${r.prepTime} min</span>
        </div>
        <div style="${styles.p}">${escapeHtml(item.reason)}</div>
        <a href="${SITE_URL}/recipes/${encodeURIComponent(r.slug)}?from=quiz" style="${styles.ctaLink}">View recipe →</a>
      </div>`;
    })
    .join("");

  const body = `
    <h1 style="${styles.h1}">${escapeHtml(payload.protocolName)}</h1>
    <p style="${styles.p};font-size:14px;">${escapeHtml(payload.summary)}</p>

    <div style="margin:20px 0 8px;">
      <span style="font-size:11px;font-weight:600;color:#3d6b4f;text-transform:uppercase;letter-spacing:0.05em;">Your plan</span>
    </div>
    ${itemCards}

    <div style="background:#eef5f0;border:1px solid #c8ddd0;border-radius:14px;padding:16px;margin-top:8px;">
      <div style="font-size:11px;font-weight:600;color:#3d6b4f;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Weekly tip</div>
      <p style="font-size:13px;color:#3d6b4f;line-height:1.6;margin:0;">${escapeHtml(payload.weeklyTip)}</p>
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="${SITE_URL}/quiz/results" style="${styles.cta}">Open my plan on PureWell →</a>
    </div>
  `;

  return { subject, html: wrap(subject, body, unsubscribeUrl) };
}

// ───────────────────────────────────────────────────────────────────────
// RECIPE email
// ───────────────────────────────────────────────────────────────────────

type RecipeIngredient = { amount: string; name: string };
type RecipeStep = { step: number; title: string; instruction: string };

export type RecipeEmailPayload = {
  name: string;
  slug: string;
  description: string;
  type: string;
  prepTime: number;
  servings: number;
  costPerServing: number;
  difficulty: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};

export function renderRecipeEmail(
  payload: RecipeEmailPayload,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const subject = `Recipe: ${payload.name}`;

  const ingredientList = payload.ingredients
    .map(
      (i) =>
        `<li style="font-size:13px;color:#2d2a24;margin-bottom:4px;line-height:1.5;"><strong style="color:#3d6b4f;">${escapeHtml(i.amount)}</strong> ${escapeHtml(i.name)}</li>`,
    )
    .join("");

  const stepList = payload.steps
    .map(
      (s) =>
        `<li style="font-size:13px;color:#2d2a24;margin-bottom:10px;line-height:1.6;"><strong>${escapeHtml(s.title)}.</strong> <span style="color:#6b6560;">${escapeHtml(s.instruction)}</span></li>`,
    )
    .join("");

  const body = `
    <h1 style="${styles.h1}">${escapeHtml(payload.name)}</h1>
    <p style="${styles.p};font-size:14px;">${escapeHtml(payload.description)}</p>

    <div style="margin:14px 0 18px;">
      <span style="${styles.chip}">${payload.prepTime} min prep</span>
      <span style="${styles.chip};margin-left:4px;">${payload.servings} ${payload.servings > 1 ? "servings" : "serving"}</span>
      <span style="${styles.chip};margin-left:4px;">$${payload.costPerServing.toFixed(2)}/serving</span>
      <span style="${styles.chip};margin-left:4px;text-transform:capitalize;">${escapeHtml(payload.difficulty)}</span>
    </div>

    <div style="${styles.card}">
      <div style="${styles.h2}">Ingredients</div>
      <ul style="margin:6px 0 0;padding-left:18px;">${ingredientList}</ul>
    </div>

    <div style="${styles.card}">
      <div style="${styles.h2}">Instructions</div>
      <ol style="margin:6px 0 0;padding-left:18px;">${stepList}</ol>
    </div>

    <div style="text-align:center;margin-top:16px;">
      <a href="${SITE_URL}/recipes/${encodeURIComponent(payload.slug)}" style="${styles.cta}">View recipe on PureWell →</a>
    </div>
  `;

  return { subject, html: wrap(subject, body, unsubscribeUrl) };
}
