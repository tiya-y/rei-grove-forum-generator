import { getCategories } from "@/lib/categories";
import { CategoryManager } from "@/components/category-manager";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const categories = await getCategories();
  const anthropicConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your API keys and forum categories.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-800">Anthropic (Claude)</h2>
            {anthropicConfigured ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                Not configured
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Used to generate post drafts. Set the <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">ANTHROPIC_API_KEY</code>{" "}
            environment variable to enable generation.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-mono">API Key</span>
            <span className="font-mono text-gray-400">
              {anthropicConfigured ? "••••••••••••" : "not set"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Forum Categories</h2>
          <p className="text-sm text-gray-500 mb-4">
            The forum sections available when generating a new batch.
          </p>
          <CategoryManager categories={categories} />
        </div>
      </div>
    </div>
  );
}
