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

    const product = await db.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      brand: body.brand,
      description: body.description,
      price: parseFloat(body.price),
      category: body.category,
      certifications: body.certifications,
      imageUrl: body.imageUrl || null,
      affiliateUrl: body.affiliateUrl || null,
      inStock: true,
    },
  });

    revalidatePath("/");
    revalidatePath("/products");

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
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

    const product = await db.product.update({
      where: { id: body.id },
      data: {
        name: body.name,
        slug: body.slug,
        brand: body.brand,
        description: body.description,
        price: parseFloat(body.price),
        category: body.category,
        certifications: body.certifications,
        imageUrl: body.imageUrl || null,
        affiliateUrl: body.affiliateUrl || null,
        inStock: body.inStock,
      },
    });

    revalidatePath("/");
    revalidatePath(`/products/${body.slug}`);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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