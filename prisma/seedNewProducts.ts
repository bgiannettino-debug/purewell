import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  await db.product.createMany({
    skipDuplicates: true,
    data: [
      // Skincare
      {
        name: "Jojoba Oil",
        slug: "jojoba-oil",
        brand: "Desert Essence",
        description: "100% pure cold-pressed jojoba oil. Balances skin's natural oils, reduces acne, and deeply moisturizes without clogging pores.",
        price: 14.99,
        category: "skincare",
        certifications: ["USDA Organic", "Non-GMO", "Vegan"],
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
      },
      {
        name: "Vitamin C Serum 20%",
        slug: "vitamin-c-serum",
        brand: "TruSkin",
        description: "Potent 20% vitamin C serum with hyaluronic acid and vitamin E. Brightens skin, fades dark spots, and boosts collagen production.",
        price: 22.99,
        category: "skincare",
        certifications: ["Vegan", "Gluten-free", "Third-party tested"],
        imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
      },
      {
        name: "Hyaluronic Acid Serum",
        slug: "hyaluronic-acid-serum",
        brand: "Neutrogena Naturals",
        description: "Pure hyaluronic acid serum that holds 1000x its weight in water. Plumps fine lines and delivers deep lasting hydration.",
        price: 18.50,
        category: "skincare",
        certifications: ["Vegan", "Non-GMO", "Gluten-free"],
        imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80",
      },
      {
        name: "Organic Aloe Vera Gel",
        slug: "aloe-vera-gel",
        brand: "Seven Minerals",
        description: "Pure organic aloe vera gel for sunburn relief, skin soothing, and hydration. No alcohol, no artificial fragrance.",
        price: 12.99,
        category: "skincare",
        certifications: ["USDA Organic", "Vegan", "Non-GMO", "Gluten-free"],
        imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80",
      },
      {
        name: "Sea Buckthorn Oil",
        slug: "sea-buckthorn-oil",
        brand: "Sibu Beauty",
        description: "Omega-rich sea buckthorn berry oil for anti-aging, skin regeneration, and barrier repair. Rich in vitamins C, E, and A.",
        price: 29.95,
        category: "skincare",
        certifications: ["USDA Organic", "Non-GMO", "Vegan"],
        imageUrl: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80",
      },
      {
        name: "Bakuchiol Retinol Alternative",
        slug: "bakuchiol-serum",
        brand: "Herbivore Botanicals",
        description: "Plant-based retinol alternative from bakuchiol seed. Reduces wrinkles and improves skin texture without irritation or sun sensitivity.",
        price: 34.00,
        category: "skincare",
        certifications: ["Vegan", "Non-GMO", "Third-party tested"],
        imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80",
      },
      {
        name: "Niacinamide Serum 10%",
        slug: "niacinamide-serum",
        brand: "The Ordinary",
        description: "10% niacinamide with 1% zinc for pore minimizing, oil control, and even skin tone. Gentle enough for daily use.",
        price: 11.99,
        category: "skincare",
        certifications: ["Vegan", "Gluten-free", "Non-GMO"],
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
      },
      {
        name: "Argan Oil",
        slug: "argan-oil",
        brand: "ArtNaturals",
        description: "100% pure Moroccan argan oil for hair, skin, and nails. Tames frizz, adds shine, and deeply conditions without greasiness.",
        price: 16.95,
        category: "skincare",
        certifications: ["USDA Organic", "Non-GMO", "Vegan"],
        imageUrl: "https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?w=400&q=80",
      },
      {
        name: "Green Tea Face Moisturizer",
        slug: "green-tea-moisturizer",
        brand: "Innisfree",
        description: "Lightweight daily moisturizer with green tea extract, antioxidants, and ceramides. Hydrates, protects, and calms sensitive skin.",
        price: 19.00,
        category: "skincare",
        certifications: ["Vegan", "Gluten-free", "Third-party tested"],
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
      },
      {
        name: "Calendula Cream",
        slug: "calendula-cream",
        brand: "Weleda",
        description: "Gentle calendula flower extract cream for sensitive and dry skin. Soothes irritation, repairs the skin barrier, and locks in moisture.",
        price: 17.99,
        category: "skincare",
        certifications: ["USDA Organic", "Non-GMO", "Vegan"],
        imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80",
      },

      // Nutrition
      {
        name: "Organic Cacao Powder",
        slug: "organic-cacao-powder",
        brand: "Navitas Organics",
        description: "Raw organic cacao powder packed with magnesium, iron, and antioxidants. Add to smoothies, oatmeal, or baking for a nutritious chocolate boost.",
        price: 13.99,
        category: "nutrition",
        certifications: ["USDA Organic", "Non-GMO", "Vegan", "Gluten-free"],
        imageUrl: "https://images.unsplash.com/photo-1610450949065-1f2841536422?w=400&q=80",
      },
      {
        name: "Organic Chia Seeds",
        slug: "organic-chia-seeds",
        brand: "Viva Naturals",
        description: "Premium organic chia seeds loaded with omega-3s, fiber, and plant protein. Perfect for puddings, smoothies, and baking.",
        price: 11.99,
        category: "nutrition",
        certifications: ["USDA Organic", "Non-GMO", "Vegan", "Gluten-free"],
        imageUrl: "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=400&q=80",
      },
      {
        name: "Hemp Seeds",
        slug: "hemp-seeds",
        brand: "Manitoba Harvest",
        description: "Hulled hemp seeds with a complete amino acid profile. 10g of protein per serving, rich in omega-3 and omega-6 fatty acids.",
        price: 14.99,
        category: "nutrition",
        certifications: ["Non-GMO", "Vegan", "Gluten-free", "Third-party tested"],
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      },
      {
        name: "Flaxseed Oil",
        slug: "flaxseed-oil",
        brand: "Barlean's",
        description: "Cold-pressed organic flaxseed oil, the richest plant source of ALA omega-3. Supports heart health, inflammation, and brain function.",
        price: 16.99,
        category: "nutrition",
        certifications: ["USDA Organic", "Non-GMO", "Vegan", "Gluten-free"],
        imageUrl: "https://images.unsplash.com/photo-1535127022272-dbe7ee35cf33?w=400&q=80",
      },
      {
        name: "Nutritional Yeast",
        slug: "nutritional-yeast",
        brand: "Bragg",
        description: "Fortified nutritional yeast with B12, protein, and all essential amino acids. Adds a cheesy, nutty flavor to any dish.",
        price: 9.99,
        category: "nutrition",
        certifications: ["Non-GMO", "Vegan", "Gluten-free", "Third-party tested"],
        imageUrl: "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=400&q=80",
      },
      {
        name: "Acai Powder",
        slug: "acai-powder",
        brand: "Navitas Organics",
        description: "Freeze-dried organic acai berry powder bursting with antioxidants and anthocyanins. Perfect for smoothie bowls and energy drinks.",
        price: 17.99,
        category: "nutrition",
        certifications: ["USDA Organic", "Non-GMO", "Vegan", "Gluten-free"],
        imageUrl: "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=400&q=80",
      },
      {
        name: "Wheatgrass Powder",
        slug: "wheatgrass-powder",
        brand: "Amazing Grass",
        description: "Pure organic wheatgrass powder with chlorophyll, vitamins, and minerals. Alkalizes the body and supports detoxification.",
        price: 19.99,
        category: "nutrition",
        certifications: ["USDA Organic", "Non-GMO", "Vegan", "Gluten-free"],
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      },
      {
        name: "Organic Coconut Oil",
        slug: "organic-coconut-oil",
        brand: "Nutiva",
        description: "Virgin cold-pressed organic coconut oil for cooking, skin care, and hair treatment. Rich in MCTs for sustained energy.",
        price: 13.99,
        category: "nutrition",
        certifications: ["USDA Organic", "Non-GMO", "Vegan", "Gluten-free", "Fair Trade"],
        imageUrl: "https://images.unsplash.com/photo-1526434426615-1abe81efcb0b?w=400&q=80",
      },
      {
        name: "Manuka Honey MGO 400+",
        slug: "manuka-honey",
        brand: "Wedderspoon",
        description: "Authentic New Zealand Manuka honey with MGO 400+ for immune support, wound healing, and digestive health. Raw and unpasteurized.",
        price: 34.99,
        category: "nutrition",
        certifications: ["Non-GMO", "Third-party tested", "GMP Certified"],
        imageUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80",
      },
      {
        name: "Black Seed Oil",
        slug: "black-seed-oil",
        brand: "Amazing Herbs",
        description: "Cold-pressed black cumin seed oil (Nigella sativa) with thymoquinone for immune support, inflammation, and respiratory health.",
        price: 21.99,
        category: "nutrition",
        certifications: ["Non-GMO", "Vegan", "Third-party tested", "GMP Certified"],
        imageUrl: "https://images.unsplash.com/photo-1535127022272-dbe7ee35cf33?w=400&q=80",
      },
    ],
  });

  console.log("✅ 20 new products seeded — 10 skincare + 10 nutrition!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());