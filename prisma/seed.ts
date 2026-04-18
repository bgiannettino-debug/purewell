import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  // Clear existing products first to avoid duplicates
  await db.product.deleteMany();

  await db.product.createMany({
    data: [
      {
        name: "Ashwagandha KSM-66",
        slug: "ashwagandha-ksm-66",
        brand: "Himalaya Wellness",
        description: "600mg organic root extract. Reduces cortisol and supports deep sleep.",
        price: 24.95,
        category: "supplements",
        certifications: ["USDA Organic", "Non-GMO", "Vegan"],
        imageUrl: "https://images.unsplash.com/photo-1611241893603-3c359704e0ee?w=400&q=80",
      },
      {
        name: "Magnesium Glycinate 400mg",
        slug: "magnesium-glycinate",
        brand: "Pure Encapsulations",
        description: "Most bioavailable magnesium form. Supports sleep and stress relief.",
        price: 32.50,
        category: "supplements",
        certifications: ["Non-GMO", "Vegan", "GMP Certified"],
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
      },
      {
        name: "Rhodiola Rosea 500mg",
        slug: "rhodiola-rosea",
        brand: "Gaia Herbs",
        description: "Adaptogenic herb that combats fatigue and sharpens focus.",
        price: 21.00,
        category: "supplements",
        certifications: ["Organic", "Vegan"],
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
      },
      {
        name: "Elderberry + Zinc Complex",
        slug: "elderberry-zinc",
        brand: "Garden of Life",
        description: "Immune defense with elderberry and zinc for seasonal protection.",
        price: 19.95,
        category: "supplements",
        certifications: ["USDA Organic", "Non-GMO", "Vegan"],
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
      },
      {
        name: "Turmeric Curcumin C3",
        slug: "turmeric-curcumin",
        brand: "Thorne Research",
        description: "Anti-inflammatory with BioPerine for enhanced absorption.",
        price: 19.95,
        category: "supplements",
        certifications: ["Non-GMO", "GMP Certified"],
        imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
      },
      {
        name: "Lavender Essential Oil",
        slug: "lavender-essential-oil",
        brand: "Plant Therapy",
        description: "100% pure therapeutic grade lavender for aromatherapy.",
        price: 12.00,
        category: "essential-oils",
        certifications: ["USDA Organic", "Non-GMO"],
        imageUrl: "https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?w=400&q=80",
      },
    ],
  });

  console.log("✅ Products seeded with images!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());