import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "../../../../lib/db";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "authenticated";
}

export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const price = parseFloat(body.price);
    if (Number.isNaN(price)) {
      return NextResponse.json({ error: "Price is not a valid number" }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        brand: body.brand,
        description: body.description,
        price,
        category: body.category,
        certifications: body.certifications,
        imageUrl: body.imageUrl || null,
        affiliateUrl: body.affiliateUrl || null,
        supplier: body.supplier || "amazon",
        asin: body.asin || null,
        inStock: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/products");

    return NextResponse.json({ product });
  } catch (error) {
    const err = error as { code?: string; message?: string };
    console.error("Create product error:", err);

    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Another product already uses this slug. Pick a unique URL slug." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const price = parseFloat(body.price);
    if (Number.isNaN(price)) {
      return NextResponse.json({ error: "Price is not a valid number" }, { status: 400 });
    }

    const product = await db.product.update({
      where: { id: body.id },
      data: {
        name: body.name,
        slug: body.slug,
        brand: body.brand,
        description: body.description,
        price,
        category: body.category,
        certifications: body.certifications,
        imageUrl: body.imageUrl || null,
        affiliateUrl: body.affiliateUrl || null,
        supplier: body.supplier || "amazon",
        asin: body.asin || null,
        inStock: body.inStock,
      },
    });

    revalidatePath("/");
    revalidatePath(`/products/${body.slug}`);

    return NextResponse.json({ product });
  } catch (error) {
    // Surface the actual Prisma error to the client so the admin can see what
    // failed (unique slug collision, missing field, etc.) instead of a vague
    // "Failed to update product".
    const err = error as { code?: string; message?: string; meta?: unknown };
    console.error("Update product error:", err);

    // P2002 = unique constraint violation. Most commonly slug.
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Another product already uses this slug. Pick a unique URL slug." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await db.product.delete({ where: { id } });

  revalidatePath("/");

  return NextResponse.json({ success: true });
}