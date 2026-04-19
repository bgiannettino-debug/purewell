import Link from "next/link";
import { db } from "../../../lib/db";
import { notFound } from "next/navigation";
import CartSidebar from "../../components/CartSidebar";

export const dynamic = "force-dynamic";

type Step = {
  step: number;
  title: string;
  instruction: string;
};

type Ingredient = {
  amount: string;
  name: string;
};

const goalColors: Record<string, string> = {
  sleep: "bg-purple-50 text-purple-700",
  stress: "bg-blue-50 text-blue-700",
  immune: "bg-emerald-50 text-emerald-700",
  energy: "bg-amber-50 text-amber-700",
  gut: "bg-orange-50 text-orange-700",
  joints: "bg-red-50 text-red-700",
  hormones: "bg-pink-50 text-pink-700",
  skin: "bg-rose-50 text-rose-700",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;

  const recipe = await db.recipe.findUnique({
    where: { slug },
  });

  if (!recipe) notFound();

  const goals = recipe.goals as string[];
  const steps = recipe.steps as Step[];
  const ingredients = recipe.ingredients as Ingredient[];

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
        <Link href="/" className="text-lg font-medium">
          pure<span className="text-emerald-700">well</span>
        </Link>
        <div className="flex-1" />
        <Link
          href="/recipes"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← All recipes
        </Link>
        <CartSidebar />
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="flex gap-2 flex-wrap mb-3">
          {goals.map((goal) => (
            <span
              key={goal}
              className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                goalColors[goal] || "bg-gray-100 text-gray-600"
              }`}
            >
              {goal}
            </span>
          ))}
        </div>

        <h1 className="text-2xl font-medium text-gray-900 mb-3 capitalize">
          {recipe.name}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {recipe.description}
        </p>

        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
            <div className="text-lg font-medium text-gray-900">
              {recipe.prepTime}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Minutes</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
            <div className="text-lg font-medium text-gray-900">
              ${recipe.costPerServing.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Per serving</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
            <div className="text-lg font-medium text-gray-900">
              {recipe.servings}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Servings</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
            <div className="text-lg font-medium text-gray-900">
              {recipe.difficulty}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Difficulty</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Ingredients
          </h2>
          <ul className="space-y-3">
            {ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-sm font-medium text-emerald-700 min-w-16">
                  {ing.amount}
                </span>
                <span className="text-sm text-gray-700">{ing.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Instructions
          </h2>
          <div className="space-y-5">
            {steps.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-medium text-emerald-700 flex-shrink-0 mt-0.5">
                  {step.step}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500 leading-relaxed">
                    {step.instruction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-6">
          <div className="text-sm font-medium text-emerald-800 mb-1">
            Shop the ingredients
          </div>
          <p className="text-sm text-emerald-700 mb-3">
            Find the natural products used in this recipe in our store.
          </p>
          <Link
            href="/"
            className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl inline-block hover:bg-emerald-700 transition-colors"
          >
            Browse products →
          </Link>
        </div>

        <div className="text-xs text-gray-400 text-center leading-relaxed">
          These recipes are for general wellness purposes only and have not been
          evaluated by the FDA. Consult your healthcare provider before use if
          pregnant, nursing, or on medications.
        </div>
      </div>
    </main>
  );
}