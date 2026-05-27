import { prisma } from "@/lib/prisma";
import { SiteConfigForm } from "./SiteConfigForm";

const CONFIG_KEYS = [
  { key: "site_title", label: "Site Title" },
  { key: "site_subtitle", label: "Site Subtitle" },
  { key: "site_description", label: "Site Description" },
  { key: "site_keywords", label: "SEO Keywords" },
  { key: "site_icon", label: "Site Icon (Favicon)", type: "file" },
  { key: "author_name", label: "Author Name" },
  { key: "author_avatar", label: "Author Avatar URL" },
  { key: "author_bio", label: "Author Bio", type: "textarea" },
  { key: "footer_text", label: "Footer Text" },
];

export default async function AdminConfigPage() {
  const configs = await prisma.siteConfig.findMany();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Site Configuration
      </h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <SiteConfigForm
          configs={Object.fromEntries(configs.map((c) => [c.key, c.value]))}
          keys={CONFIG_KEYS}
        />
      </div>
    </div>
  );
}
