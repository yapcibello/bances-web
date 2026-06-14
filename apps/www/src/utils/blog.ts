/**
 * Utilidades del blog — derivan la URL inmutable de cada post a partir de su
 * `urlOriginal` (permalink exacto del WordPress origen).
 *
 * REGLA DE URLS INMUTABLES: la URL de un post es SIEMPRE su `urlOriginal`, no se
 * recalcula desde `categories[0]`. El permalink WP tiene forma
 * `/{categoria}/{slug}/` (con leading y trailing slash).
 */
import type { CollectionEntry } from 'astro:content';

/** Slugs de 1 segmento reservados para páginas estáticas de contenido. */
export const SLUGS_ESTATICOS = new Set([
  'dentista-en-santa-cruz-de-tenerife',
  'tratamientos-dentales-en-santa-cruz-de-tenerife',
  'seguros-dentales',
  'instalaciones',
  'aviso-legal',
  'politica-de-cookies',
  'politica-de-privacidad',
  'recomendaciones-y-consejos-dentales',
]);

/** Ruta base del índice del blog. */
export const BLOG_INDEX = '/recomendaciones-y-consejos-dentales/';

/**
 * Extrae el par (categoria, slug) del `urlOriginal` de un post.
 * Devuelve `null` si el permalink no tiene la forma esperada de 2 segmentos.
 */
export function parsearPermalink(
  urlOriginal: string | undefined,
): { categoria: string; slug: string } | null {
  if (!urlOriginal) return null;
  const segmentos = urlOriginal.split('/').filter(Boolean);
  if (segmentos.length < 2) return null;
  // Categoría = primer segmento; slug = último segmento (preserva 1:1).
  return { categoria: segmentos[0], slug: segmentos[segmentos.length - 1] };
}

/** Devuelve el href definitivo (urlOriginal) de un post del blog. */
export function hrefPost(post: CollectionEntry<'posts'>): string {
  return post.data.urlOriginal ?? `${BLOG_INDEX}${post.id}/`;
}

/** Ordena posts por fecha de publicación descendente (más reciente primero). */
export function ordenarPorFecha(
  posts: CollectionEntry<'posts'>[],
): CollectionEntry<'posts'>[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
