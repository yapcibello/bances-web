#!/usr/bin/env node
// Import WP → Astro MDX (Clínica Dental Bances).
//
// Adaptación del pipeline dual-pass (cheerio + turndown) probado en
// logopedajessica-web. Origen de datos: dump JSON de la WP REST API en
// tmp/wp-api/ (posts-page-N.json, media-page-N.json, categories.json,
// tags.json, users.json).
//
// Pasada 1: genera apps/www/src/content/posts/{slug}.mdx preservando el
// permalink WP exacto en frontmatter (`urlOriginal`). Descarga las imágenes
// (hero + contenido) desde su `source_url` a
// apps/www/public/wp-content/uploads/{año}/{mes}/{archivo} — MISMA ruta que el
// WP original (regla de URLs inmutables: los enlaces a imágenes indexados
// deben seguir resolviendo). Reescribe los src/href a rutas relativas.
//
// Pasada 2 (dentro del mismo scan cheerio): detecta documentos descargables,
// iframes de YouTube (→ <YouTubeEmbed />), shortcodes WP y wrappers Elementor.
//
// Taxonomía: categories.json + tags.json → content/{categorias,tags}/*.json.
//
// Logs TSV en docs/migracion-blog/.
//
// Uso:
//   node scripts/import-blog-wp.mjs                  # import completo
//   node scripts/import-blog-wp.mjs --dry-run        # solo reporta, no escribe
//   node scripts/import-blog-wp.mjs --one=SLUG       # solo un post (debug)
//   node scripts/import-blog-wp.mjs --taxonomia-only # solo categorías + tags
//   node scripts/import-blog-wp.mjs --posts-only     # solo posts

import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadHtml } from 'cheerio';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const API_DIR = join(ROOT, 'tmp', 'wp-api');
const WWW = join(ROOT, 'apps', 'www');
const POSTS_DIR = join(WWW, 'src', 'content', 'posts');
const CATEGORIAS_DIR = join(WWW, 'src', 'content', 'categorias');
const TAGS_DIR = join(WWW, 'src', 'content', 'tags');
const PUBLIC_DIR = join(WWW, 'public');
const DOCS_DIR = join(ROOT, 'docs', 'migracion-blog');

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry-run');
const ONE = [...args].find(a => a.startsWith('--one='))?.split('=')[1];
const TAXONOMIA_ONLY = args.has('--taxonomia-only');
const POSTS_ONLY = args.has('--posts-only');

const WP_HOST = 'clinicadentalbances.com';
// Autor por defecto: el usuario WP es técnico (admin0X7LuMIo) y la REST API de
// /users está bloqueada (401). Usamos el nombre público de la clínica.
const AUTOR_DEFECTO = 'Clínica Dental Bances';

// ─── Utilidades ──────────────────────────────────────────────────────────────

async function loadJsonDir(dir, prefix) {
  const files = (await readdir(dir)).filter(f => f.startsWith(prefix) && f.endsWith('.json'));
  const out = [];
  for (const f of files.sort()) {
    const data = JSON.parse(await readFile(join(dir, f), 'utf8'));
    if (Array.isArray(data)) out.push(...data);
  }
  return out;
}
async function loadJson(file) {
  return JSON.parse(await readFile(join(API_DIR, file), 'utf8'));
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
// Decodifica entidades HTML (numéricas y nombradas) usando cheerio.
function decodeEntities(s) {
  const $ = loadHtml(`<span>${s}</span>`, { decodeEntities: true });
  return $('span').text();
}
function truncate(s, n) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + '…';
}
function yamlEscape(s) {
  if (s == null) return '';
  const str = String(s);
  if (/[:#\-?|>*&!%@`"'\\]/.test(str) || /^[\s-]/.test(str) || /\n/.test(str)) {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return str;
}
function toFrontmatter(obj) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      if (v.length === 0) { lines.push(`${k}: []`); continue; }
      lines.push(`${k}:`);
      for (const item of v) lines.push(`  - ${yamlEscape(item)}`);
    } else if (v instanceof Date) {
      lines.push(`${k}: ${v.toISOString()}`);
    } else if (typeof v === 'number') {
      lines.push(`${k}: ${v}`);
    } else if (v === null || v === undefined) {
      // skip
    } else {
      lines.push(`${k}: ${yamlEscape(v)}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

// ─── Logs TSV ────────────────────────────────────────────────────────────────

class TSV {
  constructor(file, headers) {
    this.file = file;
    this.headers = headers;
    this.rows = [headers.join('\t')];
  }
  add(row) {
    this.rows.push(this.headers.map(h => {
      const v = row[h] ?? '';
      return String(v).replace(/\t/g, ' ').replace(/\n/g, ' ');
    }).join('\t'));
  }
  async save() {
    if (DRY) return;
    await mkdir(dirname(this.file), { recursive: true });
    await writeFile(this.file, this.rows.join('\n') + '\n', 'utf8');
  }
}

// ─── Turndown config ─────────────────────────────────────────────────────────

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});
turndown.use(gfm);
turndown.keep(['figcaption', 'figure']);

// Extrae el video ID de cualquier forma de URL YT: embed, watch, youtu.be.
function youtubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith('//') ? 'https:' + url : url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2] || null;
      if (u.pathname === '/watch') return u.searchParams.get('v');
    }
    if (host === 'youtu.be') return u.pathname.slice(1) || null;
  } catch {}
  return null;
}

// ─── Descarga de media (sin mirror local: HTTP directo) ───────────────────────

// Cache global de descargas: URL absoluta o pathname → path destino relativo.
const mediaDownloaded = new Map();

// Descarga (si no existe ya) un asset de /wp-content/uploads/ desde el WP_HOST,
// preservando su ruta original bajo apps/www/public/. Devuelve la ruta pública
// relativa (/wp-content/uploads/...) o null si no se puede resolver/descargar.
async function copyMediaToPublic(sourceUrl) {
  let pathname;
  try {
    if (sourceUrl.startsWith('/')) pathname = sourceUrl;
    else pathname = new URL(sourceUrl).pathname;
  } catch { return null; }
  if (!pathname.startsWith('/wp-content/uploads/')) return null;

  // Path en disco con UTF-8 real (no percent-encoded).
  const rel = decodeURIComponent(pathname);
  if (mediaDownloaded.has(rel)) return mediaDownloaded.get(rel);

  const destRel = rel; // misma ruta que el WP original
  const destFile = join(PUBLIC_DIR, destRel.replace(/^\//, ''));

  if (existsSync(destFile)) {
    mediaDownloaded.set(rel, destRel);
    return destRel;
  }

  const fullUrl = sourceUrl.startsWith('http')
    ? sourceUrl
    : `https://${WP_HOST}${pathname}`;
  try {
    const res = await fetch(fullUrl);
    if (!res.ok) { mediaDownloaded.set(rel, null); return null; }
    const buf = Buffer.from(await res.arrayBuffer());
    if (!DRY) {
      await mkdir(dirname(destFile), { recursive: true });
      await writeFile(destFile, buf);
    }
    mediaDownloaded.set(rel, destRel);
    return destRel;
  } catch {
    mediaDownloaded.set(rel, null);
    return null;
  }
}

// Descarga un asset arbitrario (documento) preservando su path original.
async function copyAssetToPublic(url) {
  let pathname;
  try {
    if (url.startsWith('/')) pathname = url;
    else pathname = new URL(url).pathname;
  } catch { return null; }

  const destRel = decodeURIComponent(pathname);
  const destFile = join(PUBLIC_DIR, destRel.replace(/^\//, ''));
  if (existsSync(destFile)) return destRel;

  const fullUrl = url.startsWith('http') ? url : `https://${WP_HOST}${pathname}`;
  try {
    const res = await fetch(fullUrl);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (!DRY) {
      await mkdir(dirname(destFile), { recursive: true });
      await writeFile(destFile, buf);
    }
    return destRel;
  } catch {
    return null;
  }
}

function isBlogAsset(url) {
  if (!url) return false;
  if (url.startsWith('/')) return true;
  try {
    const u = new URL(url);
    return u.hostname === WP_HOST;
  } catch { return false; }
}

// ─── Limpieza del HTML Elementor ──────────────────────────────────────────────

// El contenido de Bances viene envuelto en wrappers de Elementor
// (data-elementor-*, .elementor-element, .e-con...). Desenvolvemos esos
// contenedores para quedarnos solo con el contenido editorial real, y
// eliminamos atributos ruidosos (style, class de Elementor, data-*).
function limpiarHtmlContenido($) {
  // Eliminar atributos de presentación/Elementor en todos los nodos.
  $('[style]').removeAttr('style');
  $('*').each((_, el) => {
    if (!el.attribs) return;
    for (const attr of Object.keys(el.attribs)) {
      if (attr.startsWith('data-') || attr.startsWith('data_')) $(el).removeAttr(attr);
    }
    const cls = el.attribs.class;
    if (cls && /elementor|e-con|e-flex|e-parent|e-child|fusion-|avada-|wp-/.test(cls)) {
      $(el).removeAttr('class');
    }
  });

  // Desenvolver los <div> de Elementor (sin contenido semántico propio): se
  // sustituye el div por sus hijos, repetidamente hasta estabilizar.
  let cambios = true;
  let pasadas = 0;
  while (cambios && pasadas < 20) {
    cambios = false;
    pasadas++;
    $('div').each((_, el) => {
      const $el = $(el);
      // Solo desenvolver divs sin atributos relevantes (ya limpiados arriba).
      const attrs = Object.keys(el.attribs || {});
      if (attrs.length === 0 || (attrs.length === 1 && attrs[0] === 'class' && !$el.attr('class'))) {
        $el.replaceWith($el.contents());
        cambios = true;
      }
    });
  }
}

// ─── Taxonomía: categorías + tags WP → content/{categorias,tags}/ ─────────────

function limpiarHtmlTaxonomia(html) {
  if (!html) return '';
  const $ = loadHtml(`<div id="root">${html}</div>`, { decodeEntities: true });

  $('[style]').removeAttr('style');
  $('[class]').each((_, el) => {
    const cls = $(el).attr('class') || '';
    if (/fusion-|avada-|wp-|elementor/.test(cls)) $(el).removeAttr('class');
    else if (cls.trim() === '') $(el).removeAttr('class');
  });

  $('span').each((_, el) => {
    const $el = $(el);
    if (Object.keys(el.attribs || {}).length === 0) {
      $el.replaceWith($el.contents());
    }
  });

  $('h2').each((_, el) => {
    const t = $(el).text().trim();
    if (!t) $(el).remove();
  });

  $('a[href], img[src]').each((_, el) => {
    const $el = $(el);
    ['href', 'src'].forEach(attr => {
      const val = $el.attr(attr);
      if (!val) return;
      if (val.startsWith(`https://${WP_HOST}`)) $el.attr(attr, val.slice(`https://${WP_HOST}`.length) || '/');
      if (val.startsWith(`http://${WP_HOST}`)) $el.attr(attr, val.slice(`http://${WP_HOST}`.length) || '/');
    });
  });

  let out = $('#root').html() || '';
  out = out.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return out;
}

function derivarLead(htmlLimpio, nombre) {
  const placeholder = `Artículos sobre ${nombre}.`;
  if (!htmlLimpio) return placeholder;
  const $ = loadHtml(`<div id="root">${htmlLimpio}</div>`);
  const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  const BLOQUES_SKIP = new Set(['figure', 'img', 'ul', 'ol', 'table']);

  const root = $('#root')[0];
  if (!root) return placeholder;

  const nodos = root.children || [];
  let empezar = false;
  let leadText = '';
  for (const n of nodos) {
    const tag = n.name ? n.name.toLowerCase() : null;
    if (!empezar) {
      if (tag && HEADINGS.has(tag)) { empezar = true; continue; }
      if (n.type === 'text' || (tag && !HEADINGS.has(tag))) empezar = true;
      else continue;
    }
    if (tag && HEADINGS.has(tag)) break;
    if (tag && BLOQUES_SKIP.has(tag)) continue;
    const t = $(n).text().replace(/\s+/g, ' ').trim();
    if (t) { leadText = t; break; }
  }

  if (!leadText) leadText = $('#root').text().replace(/\s+/g, ' ').trim();
  if (!leadText) return placeholder;

  const frase = leadText.match(/^[^.!?]*[.!?]/);
  let lead = (frase ? frase[0] : leadText).trim();
  if (lead.length > 240) lead = truncate(lead, 200);
  return lead;
}

async function importarTaxonomia() {
  console.log('📖 Importando taxonomía WP (categorías + tags)...');
  const categories = await loadJson('categories.json');
  const tags = await loadJson('tags.json');
  console.log(`   ${categories.length} categorías · ${tags.length} tags`);

  const tsvRevisar = new TSV(join(DOCS_DIR, 'taxonomia-revisar.tsv'),
    ['tipo', 'slug', 'nombre', 'motivo', 'lead_autogenerado']);

  const procesar = async (items, tipo, destDir) => {
    if (!DRY) await mkdir(destDir, { recursive: true });
    let escritos = 0;
    let aRevisar = 0;
    for (const item of items) {
      const slug = item.slug;
      const nombre = decodeEntities(item.name || slug);
      const rawDesc = item.description || '';
      const descripcionHtml = limpiarHtmlTaxonomia(rawDesc);
      const lead = derivarLead(descripcionHtml, nombre);

      const leadEsPlaceholder = lead.startsWith('Artículos sobre');
      const sinDescripcion = !descripcionHtml;
      if (sinDescripcion || leadEsPlaceholder) {
        tsvRevisar.add({
          tipo,
          slug,
          nombre,
          motivo: sinDescripcion ? 'sin-descripcion-wp' : 'lead-autogenerado',
          lead_autogenerado: lead,
        });
        aRevisar++;
      }

      const data = {
        slug,
        nombre,
        lead,
        ...(descripcionHtml ? { descripcionHtml } : {}),
        wpId: item.id,
      };
      if (!DRY) {
        await writeFile(join(destDir, `${slug}.json`), JSON.stringify(data, null, 2) + '\n', 'utf8');
      }
      escritos++;
    }
    console.log(`   ✅ ${tipo}: ${escritos} escritos (${aRevisar} marcados para revisión editorial)`);
  };

  await procesar(categories, 'categoria', CATEGORIAS_DIR);
  await procesar(tags, 'tag', TAGS_DIR);
  await tsvRevisar.save();
  console.log(`\n📋 Items para revisión editorial: ${tsvRevisar.file}`);
}

// ─── Pipeline ──────────────────────────────────────────────────────────────

async function main() {
  if (TAXONOMIA_ONLY) {
    await importarTaxonomia();
    return;
  }

  console.log('📖 Cargando dump REST API...');
  const posts = await loadJsonDir(API_DIR, 'posts-page-');
  const media = await loadJsonDir(API_DIR, 'media-page-');
  const categories = await loadJson('categories.json');
  const tags = await loadJson('tags.json');

  const mediaById = new Map(media.map(m => [m.id, m]));
  const categoriesById = new Map(categories.map(c => [c.id, c]));
  const tagsById = new Map(tags.map(t => [t.id, t]));

  console.log(`   ${posts.length} posts · ${media.length} media · ${categories.length} cats · ${tags.length} tags`);

  const tsvPosts = new TSV(join(DOCS_DIR, 'posts-migrados.tsv'),
    ['slug', 'wpId', 'urlOriginal', 'pubDate', 'author', 'categorias', 'tags', 'hero', 'imgs', 'docs', 'warnings']);
  const tsvDocs = new TSV(join(DOCS_DIR, 'docs-migrados.tsv'),
    ['url_original', 'path_destino', 'tipo', 'tamano', 'post_referenciador', 'fuente']);
  const tsvAmbig = new TSV(join(DOCS_DIR, 'ambiguedades.tsv'),
    ['post_slug', 'tipo_ambiguedad', 'muestra', 'decision_yapci', 'timestamp']);

  const docsDownloaded = new Map();
  let totalImgs = 0;
  let totalDocs = 0;
  let totalAmbig = 0;

  const toProcess = ONE ? posts.filter(p => p.slug === ONE) : posts;
  if (ONE && toProcess.length === 0) {
    console.error(`❌ --one=${ONE}: no encontrado`);
    process.exit(1);
  }

  for (const post of toProcess) {
    if (post.status !== 'publish') {
      tsvAmbig.add({
        post_slug: post.slug,
        tipo_ambiguedad: `status-${post.status}`,
        muestra: `Post en estado "${post.status}" — omitido`,
        decision_yapci: '',
        timestamp: new Date().toISOString(),
      });
      totalAmbig++;
      continue;
    }

    const result = await processPost(post, { mediaById, categoriesById, tagsById, tsvDocs, tsvAmbig, docsDownloaded });
    tsvPosts.add(result.row);
    totalImgs += result.row.imgs;
    totalDocs += result.row.docs;
    totalAmbig += result.ambigCount;
    console.log(`   · ${result.row.slug} (${result.row.imgs} imgs)`);
  }

  await tsvPosts.save();
  await tsvDocs.save();
  await tsvAmbig.save();

  if (!POSTS_ONLY) {
    console.log('');
    await importarTaxonomia();
  }

  console.log(`\n✅ Import ${DRY ? '(DRY RUN) ' : ''}completado:`);
  console.log(`   · ${toProcess.length} posts procesados`);
  console.log(`   · ${totalImgs} imágenes copiadas/reescritas`);
  console.log(`   · ${totalDocs} documentos detectados`);
  console.log(`   · ${totalAmbig} ambigüedades registradas`);
  console.log(`\n📋 Logs:`);
  console.log(`   · ${tsvPosts.file}`);
  console.log(`   · ${tsvDocs.file}`);
  console.log(`   · ${tsvAmbig.file}`);
}

async function processPost(post, ctx) {
  const { mediaById, categoriesById, tagsById, tsvDocs, tsvAmbig, docsDownloaded } = ctx;

  const slug = post.slug;
  const urlOriginal = new URL(post.link).pathname; // /categoria/slug/
  const pubDate = new Date(post.date_gmt + 'Z');
  const updatedDate = post.modified_gmt !== post.date_gmt ? new Date(post.modified_gmt + 'Z') : null;
  const categorias = post.categories.map(id => categoriesById.get(id)?.slug).filter(Boolean);
  const tagsArr = post.tags.map(id => tagsById.get(id)?.slug).filter(Boolean);
  const title = decodeEntities(post.title.rendered);
  const description = truncate(decodeEntities(stripHtml(post.excerpt.rendered)), 160);

  // HERO IMAGE — descarga desde el media asociado.
  let heroImage = null;
  if (post.featured_media) {
    const heroMedia = mediaById.get(post.featured_media);
    if (heroMedia?.source_url) {
      heroImage = await copyMediaToPublic(heroMedia.source_url);
    }
  }

  const $ = loadHtml(post.content.rendered, { decodeEntities: false });
  let imgs = 0;
  let docs = 0;
  let ambigCount = 0;
  const warnings = [];

  // ─── Detectar shortcodes WP sin resolver ──────────────────────────────────
  const rawText = post.content.rendered;
  const shortcodeRe = /\[([a-z][a-z0-9_-]*)(?:\s[^\]]*)?\](?:(?:(?!\[\/\1\])[\s\S])*\[\/\1\])?/gi;
  const shortcodesFound = new Set();
  let m;
  while ((m = shortcodeRe.exec(rawText)) !== null) {
    shortcodesFound.add(m[1]);
  }
  for (const sc of shortcodesFound) {
    tsvAmbig.add({
      post_slug: slug,
      tipo_ambiguedad: 'shortcode-wp',
      muestra: `Shortcode [${sc}] detectado — revisar el MDX generado`,
      decision_yapci: '',
      timestamp: new Date().toISOString(),
    });
    ambigCount++;
    warnings.push(`shortcode-[${sc}]`);
  }

  // ─── iframes: YouTube → <YouTubeEmbed />, resto → ambigüedad ──────────────
  let ytEmbedsInPost = 0;
  $('iframe').each((_, el) => {
    const src = $(el).attr('src') || '';
    const ytId = youtubeId(src);
    if (ytId) {
      $(el).replaceWith(`<p>@@YT_EMBED_${ytId}@@</p>`);
      ytEmbedsInPost++;
    } else {
      tsvAmbig.add({
        post_slug: slug,
        tipo_ambiguedad: 'iframe-no-youtube',
        muestra: src.slice(0, 200),
        decision_yapci: '',
        timestamp: new Date().toISOString(),
      });
      ambigCount++;
    }
  });
  if (ytEmbedsInPost > 0) warnings.push(`youtube-embeds-${ytEmbedsInPost}`);

  // ─── Detectar scripts embebidos ───────────────────────────────────────────
  $('script').each((_, el) => {
    const src = $(el).attr('src') || '';
    const content = $(el).html() || '';
    tsvAmbig.add({
      post_slug: slug,
      tipo_ambiguedad: 'script',
      muestra: src ? `src=${src}` : `inline: ${content.slice(0, 150)}`,
      decision_yapci: '',
      timestamp: new Date().toISOString(),
    });
    ambigCount++;
    $(el).remove();
  });

  // ─── Detectar wrappers Elementor (informativo) ─────────────────────────────
  const elementorCount = $('[class*="elementor"], [data-elementor-type], [data-widget_type]').length;
  if (elementorCount > 0) {
    tsvAmbig.add({
      post_slug: slug,
      tipo_ambiguedad: 'tema-elementor',
      muestra: `${elementorCount} wrappers Elementor desenvueltos automáticamente`,
      decision_yapci: 'auto-unwrap',
      timestamp: new Date().toISOString(),
    });
    ambigCount++;
  }

  // ─── Pasada 2: docs + imgs ────────────────────────────────────────────────
  const docExtensions = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|odt|odp|odg|zip|rar|7z)$/i;

  // Imágenes en <img src=...> — descargar y reescribir.
  for (const el of $('img').toArray()) {
    const src = $(el).attr('src');
    if (!src) continue;
    if (isBlogAsset(src)) {
      $(el).removeAttr('srcset');
      $(el).removeAttr('sizes');
      const newSrc = await copyMediaToPublic(src);
      if (newSrc) {
        $(el).attr('src', newSrc);
        imgs++;
      } else {
        tsvAmbig.add({
          post_slug: slug,
          tipo_ambiguedad: 'img-no-encontrada',
          muestra: src,
          decision_yapci: '',
          timestamp: new Date().toISOString(),
        });
        ambigCount++;
      }
    }
  }

  // <a href=...> con extensión de documento o imagen.
  for (const el of $('a').toArray()) {
    const href = $(el).attr('href');
    if (!href) continue;
    if (isBlogAsset(href) && docExtensions.test(href)) {
      let destPath = docsDownloaded.get(href);
      if (!destPath) {
        destPath = await copyAssetToPublic(href);
        if (destPath) {
          docsDownloaded.set(href, destPath);
          const fullPath = join(PUBLIC_DIR, destPath.replace(/^\//, ''));
          let sz = 0;
          try { sz = (await stat(fullPath)).size; } catch {}
          tsvDocs.add({
            url_original: href,
            path_destino: destPath,
            tipo: extname(href).slice(1).toLowerCase(),
            tamano: sz,
            post_referenciador: slug,
            fuente: 'HTML-scan',
          });
          docs++;
        }
      }
      if (destPath) $(el).attr('href', destPath);
    } else if (isBlogAsset(href) && /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(href)) {
      const newHref = await copyMediaToPublic(href);
      if (newHref) $(el).attr('href', newHref);
    }
  }

  // ─── Limpiar wrappers Elementor antes de turndown ──────────────────────────
  limpiarHtmlContenido($);

  // ─── Convertir URLs absolutas internas a relativas ─────────────────────────
  $('a[href], img[src]').each((_, el) => {
    const $el = $(el);
    ['href', 'src'].forEach(attr => {
      const val = $el.attr(attr);
      if (val && val.startsWith(`https://${WP_HOST}`)) {
        $el.attr(attr, val.slice(`https://${WP_HOST}`.length) || '/');
      }
      if (val && val.startsWith(`http://${WP_HOST}`)) {
        $el.attr(attr, val.slice(`http://${WP_HOST}`.length) || '/');
      }
    });
  });

  // ─── Turndown ─────────────────────────────────────────────────────────────
  const cleanHtml = $('body').length ? $('body').html() : $.html();
  let markdown = turndown.turndown(cleanHtml || '');
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
  // Sustituir markers YT por el componente (turndown escapa _ → \_).
  markdown = markdown.replace(/@@YT\\?_EMBED\\?_([A-Za-z0-9\\_-]+)@@/g, (_, id) => {
    const cleanId = id.replace(/\\_/g, '_');
    return `<YouTubeEmbed id="${cleanId}" />`;
  });
  // Auto-cerrar void tags HTML que turndown preserva sin `/>` (MDX/JSX).
  markdown = markdown.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');

  // ─── Frontmatter (schema Bances) ──────────────────────────────────────────
  // `slug` NO va en frontmatter — Astro lo infiere del nombre de archivo.
  const fm = {
    title,
    description,
    urlOriginal,
    pubDate,
    ...(updatedDate ? { updatedDate } : {}),
    author: AUTOR_DEFECTO,
    categories: categorias,
    tags: tagsArr,
    ...(heroImage ? { heroImage } : {}),
    wpId: post.id,
  };

  const imports = [];
  if (ytEmbedsInPost > 0) {
    imports.push(`import YouTubeEmbed from '../../components/YouTubeEmbed.astro';`);
  }
  const importsBlock = imports.length ? `${imports.join('\n')}\n\n` : '';

  const mdx = `${toFrontmatter(fm)}\n\n${importsBlock}${markdown}\n`;

  if (!DRY) {
    await mkdir(POSTS_DIR, { recursive: true });
    await writeFile(join(POSTS_DIR, `${slug}.mdx`), mdx, 'utf8');
  }

  return {
    row: {
      slug,
      wpId: post.id,
      urlOriginal,
      pubDate: pubDate.toISOString(),
      author: AUTOR_DEFECTO,
      categorias: categorias.join(';'),
      tags: tagsArr.join(';'),
      hero: heroImage || '',
      imgs,
      docs,
      warnings: warnings.join(','),
    },
    ambigCount,
  };
}

main().catch(err => {
  console.error('❌ Error en import:', err);
  process.exit(1);
});
