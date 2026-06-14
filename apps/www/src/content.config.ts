import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content Collections — adaptadas al sitio REAL clinicadentalbances.com.
 *
 * Réplica 1:1: solo existen las colecciones presentes en el sitio origen.
 * - `tratamientos`: las páginas de tratamientos del WordPress.
 * - `posts`: el blog (ruta /recomendaciones-y-consejos-dentales/).
 * - `categorias` / `tags`: taxonomías del blog (listados de archivo). Se migran
 *   TODAS para preservar sus 27 URLs (regla de URLs inmutables).
 *
 * REGLA DE URLS INMUTABLES: el campo `urlOriginal` preserva el slug exacto del
 * WordPress. Prohibido cambiar slugs existentes sin confirmación humana previa.
 */

/** Schema base compartido por las colecciones de contenido. */
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
    /** Slugs de categorías a las que pertenece (la primera define la URL). */
    categories: z.array(z.string()).default([]),
    /** Slugs de etiquetas. */
    tags: z.array(z.string()).default([]),
    /** ID del post en WordPress (trazabilidad de migración). */
    wpId: z.number().optional(),
  }),
});

/** Taxonomía: categorías y tags como datos (JSON) para generar listados. */
const taxonomiaSchema = z.object({
  /** Slug = nombre de archivo, es la base de la URL. */
  slug: z.string(),
  /** Nombre legible mostrado en el listado. */
  nombre: z.string(),
  /** Frase resumen / lead para la cabecera del archivo. */
  lead: z.string().optional(),
  /** Descripción HTML opcional (de la taxonomía WP). */
  descripcionHtml: z.string().optional(),
  /** ID en WordPress. */
  wpId: z.number().optional(),
});

const categorias = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categorias' }),
  schema: taxonomiaSchema,
});

const tags = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tags' }),
  schema: taxonomiaSchema,
});

export const collections = { tratamientos, posts, categorias, tags };
