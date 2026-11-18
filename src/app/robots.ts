import type { MetadataRoute } from "next";

// Tant que la relecture finale n'est pas faite, le site ne doit pas être indexé.
// Ensuite : passer à `allow: "/"`, ajouter le sitemap, et retirer `robots` des métadonnées de layout.tsx.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
