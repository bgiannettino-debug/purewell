import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";

// Typeahead suggestions for the navbar search. Kept lean (8 rows,
// minimum 2-char query) so it can fire on every keystroke without
// hammering the DB or returning a wall of marginal matches.
//
// Matches name, brand, and description (case-insensitive). Could be
// upgraded later to Postgres full-text search or a similarity ranking
// (pg_trgm) if the catalog grows enough that lexical contains-matching
// stops feeling smart, but for the current size it's plenty.

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  // Don't suggest until the user has typed enough to be meaningful;
  // 2 chars catches "as" → ashwagandha, etc., while skipping the
  // single-letter noise that would return half the catalog.
  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await db.product.findMany({
      where: {
        inStock: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { brand: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        price: true,
        imageUrl: true,
      },
      take: 8,
      // Order by name length first (shorter names tend to be more
      // exact matches when contains-matching) then by createdAt for
      // stable ordering across requests.
      orderBy: [{ name: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search suggest error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
