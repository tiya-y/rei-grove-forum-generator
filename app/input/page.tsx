import { getCategories } from "@/lib/categories";
import { InputForm } from "@/components/input-form";

export const dynamic = "force-dynamic";

export default async function InputPage() {
  const categories = await getCategories();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Batch</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate discussion-starter posts for the REI Grove forums, ready for review.
        </p>
      </div>
      <InputForm categories={categories.map((c) => c.name)} />
    </div>
  );
}
