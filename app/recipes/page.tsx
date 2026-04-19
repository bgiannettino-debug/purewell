import Link from "next/link";
import { db } from "../../lib/db";
import CartSidebar from "../components/CartSidebar";

export const dynamic = "force-dynamic";

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

export default async function RecipesPage() {
  const recipes = await db.recipe.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
        <Link href="/" className="text-lg font-medium">
          pure<span className="text-emerald-700">well</span>
        </Link>
        <div className="flex-1" />
        <CartSidebar />
      </nav>

      <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-8">
        <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">
          DIY wellness recipes
        </div>
        <h1 className="text-2xl font-medium text-emerald-900 mb-2">
          Make it at home
        </h1>
        <p className="text-sm text-emerald-700 max-w-lg">
          Free homemade wellness recipes using natural ingredients. Each recipe
          links to the products you need — or use what you already have.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="grid grid-cols-2 gap-4">
          {recipes.map((recipe) => {
            const goals = recipe.goals as string[];
            return (
              <Link
                href={`/recipes/${recipe.slug}`}
                key={recipe.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2 flex-wrap">
                    {goals.map((goal) => (
                      <span
                        key={goal}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                          goalColors[goal] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {recipe.prepTime} min
                  </span>
                </div>

                <h2 className="text-base font-medium text-gray-900 mb-2 capitalize">
                  {recipe.name}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>{recipe.servings} serving{recipe.servings > 1 ? "s" : ""}</span>
                    <span>~${recipe.costPerServing.toFixed(2)}/serving</span>
                    <span>{recipe.difficulty}</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-600">
                    Free →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}