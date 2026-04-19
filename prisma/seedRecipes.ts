import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  await db.recipe.deleteMany();

  await db.recipe.createMany({
    data: [
      {
        name: "Ashwagandha golden sleep latte",
        slug: "ashwagandha-golden-sleep-latte",
        description: "A warming bedtime latte blending ashwagandha, turmeric, and cinnamon with creamy oat milk. A cozy nightly ritual that actually works.",
        prepTime: 5,
        servings: 1,
        costPerServing: 1.20,
        difficulty: "Easy",
        goals: ["sleep", "stress"],
        ingredients: [
          { amount: "1 cup", name: "Oat milk (unsweetened)" },
          { amount: "1 tsp", name: "Ashwagandha powder" },
          { amount: "½ tsp", name: "Turmeric powder" },
          { amount: "¼ tsp", name: "Cinnamon" },
          { amount: "1 pinch", name: "Black pepper" },
          { amount: "1 tsp", name: "Raw honey or maple syrup" },
        ],
        steps: [
          { step: 1, title: "Warm the milk", instruction: "Pour oat milk into a small saucepan. Heat over medium-low until steaming but not boiling." },
          { step: 2, title: "Mix the spice blend", instruction: "In your mug, combine ashwagandha, turmeric, cinnamon, and black pepper. Add 2 tbsp warm milk and stir into a smooth paste." },
          { step: 3, title: "Froth and combine", instruction: "Pour remaining warm milk into the mug. Froth with a handheld frother for 20 seconds for a creamy texture." },
          { step: 4, title: "Sweeten and serve", instruction: "Stir in honey or maple syrup to taste. Dust with extra cinnamon on top. Drink 30-60 minutes before bed." },
        ],
      },
      {
        name: "Elderberry immune syrup",
        slug: "elderberry-immune-syrup",
        description: "A potent homemade elderberry syrup loaded with antioxidants and immune-boosting compounds. Makes a 2-week supply for the whole family.",
        prepTime: 45,
        servings: 30,
        costPerServing: 0.40,
        difficulty: "Intermediate",
        goals: ["immune", "energy"],
        ingredients: [
          { amount: "1 cup", name: "Dried elderberries" },
          { amount: "3 cups", name: "Water" },
          { amount: "1 tbsp", name: "Fresh grated ginger" },
          { amount: "1 tsp", name: "Cinnamon powder" },
          { amount: "½ tsp", name: "Cloves" },
          { amount: "1 cup", name: "Raw honey (added after cooling)" },
        ],
        steps: [
          { step: 1, title: "Simmer the berries", instruction: "Combine elderberries, water, ginger, cinnamon, and cloves in a saucepan. Bring to a boil then reduce to a simmer." },
          { step: 2, title: "Reduce", instruction: "Simmer uncovered for 45 minutes until liquid is reduced by almost half. The mixture will darken and thicken." },
          { step: 3, title: "Strain", instruction: "Remove from heat and let cool slightly. Pour through a fine mesh strainer, pressing berries to extract all liquid." },
          { step: 4, title: "Add honey", instruction: "Once cooled to room temperature, stir in raw honey. Never add honey to hot liquid — heat destroys its beneficial enzymes." },
          { step: 5, title: "Store", instruction: "Pour into a glass jar and refrigerate. Takes 1 tbsp daily for immune maintenance or 1 tbsp every 2-3 hours when sick." },
        ],
      },
      {
        name: "Turmeric golden milk paste",
        slug: "turmeric-golden-milk-paste",
        description: "A concentrated paste you make once and use all month. Just mix a teaspoon into warm milk each morning for powerful anti-inflammatory benefits.",
        prepTime: 15,
        servings: 30,
        costPerServing: 0.25,
        difficulty: "Easy",
        goals: ["gut", "joints", "immune"],
        ingredients: [
          { amount: "½ cup", name: "Turmeric powder" },
          { amount: "1 tsp", name: "Black pepper (boosts absorption 2000%)" },
          { amount: "½ tsp", name: "Ginger powder" },
          { amount: "½ tsp", name: "Cinnamon" },
          { amount: "¼ cup", name: "Coconut oil" },
          { amount: "⅓ cup", name: "Water" },
        ],
        steps: [
          { step: 1, title: "Combine dry ingredients", instruction: "Mix turmeric, black pepper, ginger, and cinnamon together in a small saucepan." },
          { step: 2, title: "Add water", instruction: "Add water and stir over medium-low heat for 5-7 minutes until a thick paste forms." },
          { step: 3, title: "Add coconut oil", instruction: "Remove from heat and stir in coconut oil until fully combined. The fat helps absorption of curcumin." },
          { step: 4, title: "Store and use", instruction: "Cool completely then store in a glass jar in the fridge for up to 30 days. Use 1 tsp per serving mixed into warm milk or smoothies." },
        ],
      },
      {
        name: "Chamomile honey sleep tea",
        slug: "chamomile-honey-sleep-tea",
        description: "The simplest, most effective bedtime tea. Just three ingredients and five minutes for a deeply calming pre-sleep ritual.",
        prepTime: 5,
        servings: 1,
        costPerServing: 0.80,
        difficulty: "Easy",
        goals: ["sleep", "stress"],
        ingredients: [
          { amount: "1 bag", name: "Chamomile tea (or 2 tsp loose leaf)" },
          { amount: "8 oz", name: "Hot water (not boiling — 200°F)" },
          { amount: "1 tsp", name: "Raw honey" },
          { amount: "1 slice", name: "Fresh lemon (optional)" },
        ],
        steps: [
          { step: 1, title: "Heat water", instruction: "Heat water to 200°F — just before boiling. Boiling water can make chamomile bitter and destroy delicate compounds." },
          { step: 2, title: "Steep", instruction: "Add chamomile tea bag or loose leaf to your mug. Pour hot water over it and steep for 5 minutes covered with a small plate to trap the steam." },
          { step: 3, title: "Sweeten", instruction: "Remove the tea bag. Add honey and stir gently. Add lemon if using. Sip slowly 30 minutes before bed." },
        ],
      },
      {
        name: "Peppermint focus tea",
        slug: "peppermint-focus-tea",
        description: "A caffeine-free alternative to coffee that sharpens mental clarity and lifts energy through peppermint's natural stimulating compounds.",
        prepTime: 5,
        servings: 1,
        costPerServing: 0.60,
        difficulty: "Easy",
        goals: ["energy", "stress"],
        ingredients: [
          { amount: "1 tbsp", name: "Fresh or dried peppermint leaves" },
          { amount: "8 oz", name: "Hot water" },
          { amount: "1 tsp", name: "Honey (optional)" },
          { amount: "2 drops", name: "Peppermint essential oil (food-grade, optional)" },
        ],
        steps: [
          { step: 1, title: "Prepare leaves", instruction: "If using fresh peppermint, bruise the leaves slightly by rubbing between your palms to release the oils." },
          { step: 2, title: "Steep", instruction: "Place leaves in a mug or infuser. Pour hot water over and steep for 3-5 minutes. Longer steeping = stronger flavor." },
          { step: 3, title: "Serve", instruction: "Strain if needed. Add honey if desired. Inhale the steam before drinking — the aroma alone boosts alertness." },
        ],
      },
      {
        name: "Ginger lemon immune shot",
        slug: "ginger-lemon-immune-shot",
        description: "A powerful 2oz shot of concentrated ginger, lemon, and turmeric. Take it every morning to prime your immune system for the day.",
        prepTime: 10,
        servings: 6,
        costPerServing: 0.50,
        difficulty: "Easy",
        goals: ["immune", "energy", "gut"],
        ingredients: [
          { amount: "4 inches", name: "Fresh ginger root, peeled" },
          { amount: "3", name: "Lemons, juiced" },
          { amount: "1 tsp", name: "Turmeric powder" },
          { amount: "1 pinch", name: "Cayenne pepper" },
          { amount: "1 tbsp", name: "Raw honey" },
          { amount: "½ cup", name: "Water" },
        ],
        steps: [
          { step: 1, title: "Juice the ginger", instruction: "Blend ginger with water then strain through a fine mesh strainer, pressing to extract all the juice." },
          { step: 2, title: "Combine", instruction: "Mix ginger juice, lemon juice, turmeric, cayenne, and honey in a jar. Stir or shake well." },
          { step: 3, title: "Store", instruction: "Refrigerate in a sealed glass jar for up to 5 days. Shake before each use. Take 2oz shot each morning on an empty stomach." },
        ],
      },
      {
        name: "Lavender oat milk bath soak",
        slug: "lavender-oat-bath-soak",
        description: "A luxurious DIY bath soak that calms the nervous system, softens skin, and prepares your body for deep sleep. Make a big batch and store it.",
        prepTime: 10,
        servings: 8,
        costPerServing: 0.90,
        difficulty: "Easy",
        goals: ["sleep", "stress", "skin"],
        ingredients: [
          { amount: "2 cups", name: "Colloidal oats (finely ground rolled oats)" },
          { amount: "1 cup", name: "Epsom salt" },
          { amount: "½ cup", name: "Baking soda" },
          { amount: "20 drops", name: "Lavender essential oil" },
          { amount: "10 drops", name: "Chamomile essential oil (optional)" },
        ],
        steps: [
          { step: 1, title: "Grind oats", instruction: "If you don't have colloidal oats, blend regular rolled oats in a blender until a fine powder forms. They should dissolve in water." },
          { step: 2, title: "Mix dry ingredients", instruction: "Combine oats, epsom salt, and baking soda in a large bowl. Stir well." },
          { step: 3, title: "Add essential oils", instruction: "Drizzle lavender and chamomile oils over the mixture. Stir thoroughly to distribute evenly." },
          { step: 4, title: "Store and use", instruction: "Store in a sealed glass jar. Add ¼ cup to warm bath water. Soak for 20 minutes before bed for best sleep results." },
        ],
      },
      {
        name: "Maca energy smoothie",
        slug: "maca-energy-smoothie",
        description: "A nutrient-dense morning smoothie with maca root, banana, and almond butter for sustained energy without the coffee crash.",
        prepTime: 5,
        servings: 1,
        costPerServing: 2.50,
        difficulty: "Easy",
        goals: ["energy", "hormones"],
        ingredients: [
          { amount: "1 tsp", name: "Maca root powder" },
          { amount: "1", name: "Frozen banana" },
          { amount: "1 tbsp", name: "Almond butter" },
          { amount: "1 cup", name: "Oat milk or almond milk" },
          { amount: "1 tsp", name: "Cacao powder" },
          { amount: "1 tsp", name: "Honey" },
          { amount: "1 cup", name: "Ice" },
        ],
        steps: [
          { step: 1, title: "Add all ingredients", instruction: "Place all ingredients in a blender. Start with the liquid at the bottom to help blending." },
          { step: 2, title: "Blend", instruction: "Blend on high for 45-60 seconds until completely smooth and creamy." },
          { step: 3, title: "Serve immediately", instruction: "Pour into a glass and drink right away. Maca works best consumed in the morning — avoid taking after 2pm as it can interfere with sleep." },
        ],
      },
    ],
  });

  console.log("✅ 8 recipes seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Recipe seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());