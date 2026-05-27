import { getSiteConfig } from "@/lib/siteConfig";

export async function Footer() {
  const footerText = await getSiteConfig("footer_text");

  if (!footerText) return null;

  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-500">
        {footerText}
      </div>
    </footer>
  );
}
