import Link from "next/link";

export function TagBadge({
  name,
  slug,
  interactive = true,
}: {
  name: string;
  slug: string;
  interactive?: boolean;
}) {
  const baseClasses =
    "inline-block text-xs font-medium px-2 py-0.5 rounded-full";

  if (interactive) {
    return (
      <Link
        href={`/tag/${slug}`}
        className={`${baseClasses} bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors`}
      >
        {name}
      </Link>
    );
  }

  return (
    <span className={`${baseClasses} bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300`}>{name}</span>
  );
}
