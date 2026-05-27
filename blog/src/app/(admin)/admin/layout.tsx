import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NEXT_EXPORT === "true") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-500">
            The admin panel is only available in development mode (
            <code className="bg-gray-100 px-1 rounded">npm run dev</code>
            ).
          </p>
        </div>
      </div>
    );
  }

  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Admin Panel</span>
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          &larr; View Site
        </Link>
      </header>
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
