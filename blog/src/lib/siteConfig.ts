import { prisma } from "@/lib/prisma";

export async function getSiteConfig(key: string): Promise<string | null> {
  const config = await prisma.siteConfig.findUnique({ where: { key } });
  return config?.value ?? null;
}

export async function getAllSiteConfig(): Promise<Record<string, string>> {
  const configs = await prisma.siteConfig.findMany();
  return Object.fromEntries(configs.map((c) => [c.key, c.value]));
}
