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
        className={`${baseClasses} bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors`}
      >
        {name}
      </Link>
    );
  }

  return (
    <span className={`${baseClasses} bg-blue-100 text-blue-700`}>{name}</span>
  );
}
