import type { MetadataRoute } from "next";

// Tant que le contenu est fictif (personne inventée), le site ne doit pas être indexé.
// Phase 7 : passer à `allow: "/"`, ajouter le sitemap, et retirer `robots` des métadonnées de layout.tsx.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
