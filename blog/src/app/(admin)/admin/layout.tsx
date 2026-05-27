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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Panel</h1>
          <p className="text-gray-500 dark:text-gray-400">
            The admin panel is only available in development mode (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">npm run dev</code>
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin Panel</span>
        <Link
          href="/"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
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
