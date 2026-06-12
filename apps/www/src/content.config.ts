import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content Collections — adaptadas al sitio REAL clinicadentalbances.com.
 *
 * Réplica 1:1: solo existen las colecciones presentes en el sitio origen.
 * - `tratamientos`: las páginas de tratamientos del WordPress.
 * - `posts`: el blog (ruta /recomendaciones-y-consejos-dentales/).
 *
 * NO se crean colecciones problemas/sinergias/ubicaciones — no existen en el
 * sitio origen. Ampliar más adelante solo si el contenido real lo requiere.
 *
 * REGLA DE URLS INMUTABLES: el campo `urlOriginal` preserva el slug exacto del
 * WordPress. Prohibido cambiar slugs existentes sin confirmación humana previa.
 */

/** Schema base compartido por todas las colecciones. */
const baseSchema = z.object({
  /** Título de la página/entrada (≤ 60 chars recomendado). */
  title: z.string(),
  /** Meta description (≤ 160 chars recomendado). */
  description: z.string(),
  /**
   * URL original en producción (con leading + trailing slash), para preservar
   * el slug 1:1 con el WordPress. Opcional mientras se migra el contenido.
   */
  urlOriginal: z.string().optional(),
  /** Imagen hero (ruta pública o import). Opcional. */
  heroImage: z.string().optional(),
  /** Borrador — excluido del build cuando es true. */
  draft: z.boolean().optional().default(false),
});

const tratamientos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tratamientos' }),
  schema: baseSchema.extend({
    /** Orden en el listado (menor primero). */
    orden: z.number().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: baseSchema.extend({
    /** Fecha de publicación. */
    pubDate: z.coerce.date(),
    /** Fecha de última actualización (opcional). */
    updatedDate: z.coerce.date().optional(),
    /** Autor de la entrada (opcional). */
    author: z.string().optional(),
  }),
});

export const collections = { tratamientos, posts };
