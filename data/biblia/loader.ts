// Loader perezoso de libros. Cada JSON vive en data/biblia/*.json.
// Expo usa imports dinamicos literales para cargar cada archivo bajo demanda,
// por lo que el bundle inicial no incluye ningun versiculo.
//
// Forma del JSON crudo (tal como lo genera scripts/scrape_biblia.py) y copiado a data/biblia/*.json.
//   { bid, bk, nombre, capitulos: { "<cp>": { "<vs>": "texto" } } }
//
// Normalizamos a:
//   { id, name, testament, chapters: [{ number, verses: [{ number, text }] }] }
//
// Tambien limpiamos un artefacto del scraper: algunos versiculos tienen
// el numero como prefijo dentro del texto (ej. "1 En el principio..."),
// lo removemos cuando coincide con el numero del versiculo.

import { BOOKS_META, slugifyBookName, type BookMeta } from './books-meta';

export interface LocalChapter {
  number: number;
  verses: { number: number; text: string }[];
}

export interface LocalBook {
  id: number;
  name: string;
  testament: 'AT' | 'NT';
  chapters: LocalChapter[];
}

interface RawBookJson {
  bid: number;
  bk: number;
  nombre: string;
  capitulos: Record<string, Record<string, string>>;
}

type RawBookModule = { default: RawBookJson };
type BookLoader = () => Promise<RawBookModule>;

// Mapa perezoso. Los keys son las rutas relativas.
const bookLoaders: Record<string, BookLoader> = {
  './01_Genesis.json': () => import('./01_Genesis.json'),
  './02_Exodo.json': () => import('./02_Exodo.json'),
  './03_Levitico.json': () => import('./03_Levitico.json'),
  './04_Numeros.json': () => import('./04_Numeros.json'),
  './05_Deuteronomio.json': () => import('./05_Deuteronomio.json'),
  './06_Josue.json': () => import('./06_Josue.json'),
  './07_Jueces.json': () => import('./07_Jueces.json'),
  './08_1Samuel.json': () => import('./08_1Samuel.json'),
  './09_2Samuel.json': () => import('./09_2Samuel.json'),
  './10_1Reyes.json': () => import('./10_1Reyes.json'),
  './11_2Reyes.json': () => import('./11_2Reyes.json'),
  './12_1Cronicas.json': () => import('./12_1Cronicas.json'),
  './13_2Cronicas.json': () => import('./13_2Cronicas.json'),
  './14_Esdras.json': () => import('./14_Esdras.json'),
  './15_Nehemias.json': () => import('./15_Nehemias.json'),
  './16_1Macabeos.json': () => import('./16_1Macabeos.json'),
  './17_2Macabeos.json': () => import('./17_2Macabeos.json'),
  './18_Isaias.json': () => import('./18_Isaias.json'),
  './19_Jeremias.json': () => import('./19_Jeremias.json'),
  './20_Ezequiel.json': () => import('./20_Ezequiel.json'),
  './21_Oseas.json': () => import('./21_Oseas.json'),
  './22_Joel.json': () => import('./22_Joel.json'),
  './23_Amos.json': () => import('./23_Amos.json'),
  './24_Abdias.json': () => import('./24_Abdias.json'),
  './25_Jonas.json': () => import('./25_Jonas.json'),
  './26_Miqueas.json': () => import('./26_Miqueas.json'),
  './27_Nahum.json': () => import('./27_Nahum.json'),
  './28_Habacuq.json': () => import('./28_Habacuq.json'),
  './29_Sofonias.json': () => import('./29_Sofonias.json'),
  './30_Ageo.json': () => import('./30_Ageo.json'),
  './31_Zacarias.json': () => import('./31_Zacarias.json'),
  './32_Malaquias.json': () => import('./32_Malaquias.json'),
  './33_Daniel.json': () => import('./33_Daniel.json'),
  './34_Job.json': () => import('./34_Job.json'),
  './35_Proverbios.json': () => import('./35_Proverbios.json'),
  './36_Qohelet.json': () => import('./36_Qohelet.json'),
  './37_Cantar_de_los_Cantares.json': () => import('./37_Cantar_de_los_Cantares.json'),
  './38_Rut.json': () => import('./38_Rut.json'),
  './39_Lamentaciones.json': () => import('./39_Lamentaciones.json'),
  './40_Ester.json': () => import('./40_Ester.json'),
  './41_Tobias.json': () => import('./41_Tobias.json'),
  './42_Judit.json': () => import('./42_Judit.json'),
  './43_Baruc.json': () => import('./43_Baruc.json'),
  './44_Sabiduria.json': () => import('./44_Sabiduria.json'),
  './45_Siracides.json': () => import('./45_Siracides.json'),
  './46_Salmos.json': () => import('./46_Salmos.json'),
  './47_Mateo.json': () => import('./47_Mateo.json'),
  './48_Marcos.json': () => import('./48_Marcos.json'),
  './49_Lucas.json': () => import('./49_Lucas.json'),
  './50_Juan.json': () => import('./50_Juan.json'),
  './51_Hechos.json': () => import('./51_Hechos.json'),
  './52_Romanos.json': () => import('./52_Romanos.json'),
  './53_1Corintios.json': () => import('./53_1Corintios.json'),
  './54_2Corintios.json': () => import('./54_2Corintios.json'),
  './55_Galatas.json': () => import('./55_Galatas.json'),
  './56_Efesios.json': () => import('./56_Efesios.json'),
  './57_Filipenses.json': () => import('./57_Filipenses.json'),
  './58_Colosenses.json': () => import('./58_Colosenses.json'),
  './59_Filemon.json': () => import('./59_Filemon.json'),
  './60_1Tesalonicenses.json': () => import('./60_1Tesalonicenses.json'),
  './61_2Tesalonicenses.json': () => import('./61_2Tesalonicenses.json'),
  './62_1Timoteo.json': () => import('./62_1Timoteo.json'),
  './63_2Timoteo.json': () => import('./63_2Timoteo.json'),
  './64_Tito.json': () => import('./64_Tito.json'),
  './65_Hebreos.json': () => import('./65_Hebreos.json'),
  './66_Santiago.json': () => import('./66_Santiago.json'),
  './67_1Pedro.json': () => import('./67_1Pedro.json'),
  './68_2Pedro.json': () => import('./68_2Pedro.json'),
  './69_Judas.json': () => import('./69_Judas.json'),
  './70_1Juan.json': () => import('./70_1Juan.json'),
  './71_2Juan.json': () => import('./71_2Juan.json'),
  './72_3Juan.json': () => import('./72_3Juan.json'),
  './73_Apocalipsis.json': () => import('./73_Apocalipsis.json'),
};

// Indice por slug → BookMeta y por filename → loader.
const metaBySlug = new Map<string, BookMeta>();
const metaById = new Map<number, BookMeta>();
for (const meta of BOOKS_META) {
  metaBySlug.set(slugifyBookName(meta.name), meta);
  metaById.set(meta.id, meta);
}

const cache = new Map<string, Promise<LocalBook>>();

function resolveLoader(file: string): BookLoader {
  const key = `./${file}`;
  const loader = bookLoaders[key];
  if (!loader) {
    throw new Error(`Archivo de libro no encontrado en bookLoaders: ${key}`);
  }
  return loader;
}

function stripLeadingVerseNumber(raw: string, verseNumber: number): string {
  // Ej: "1 En el principio..." con verseNumber=1 → "En el principio..."
  const prefix = new RegExp(`^\\s*${verseNumber}\\s+`);
  return raw.replace(prefix, '').replace(/\s+/g, ' ').trim();
}

function normalize(meta: BookMeta, raw: RawBookJson): LocalBook {
  const chapters: LocalChapter[] = Object.keys(raw.capitulos)
    .map((cp) => Number(cp))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b)
    .map((cpNum) => {
      const versesObj = raw.capitulos[String(cpNum)] || {};
      const verses = Object.keys(versesObj)
        .map((vs) => Number(vs))
        .filter((n) => Number.isFinite(n))
        .sort((a, b) => a - b)
        .map((vsNum) => ({
          number: vsNum,
          text: stripLeadingVerseNumber(versesObj[String(vsNum)] ?? '', vsNum),
        }));
      return { number: cpNum, verses };
    });

  return {
    id: meta.id,
    name: meta.name,
    testament: meta.testament,
    chapters,
  };
}

export function listBooks(): BookMeta[] {
  return BOOKS_META;
}

export function getBookMetaBySlug(slug: string): BookMeta | undefined {
  return metaBySlug.get(slug);
}

export function getBookMetaById(id: number): BookMeta | undefined {
  return metaById.get(id);
}

export function loadBookBySlug(slug: string): Promise<LocalBook> {
  const meta = metaBySlug.get(slug);
  if (!meta) throw new Error(`Libro no encontrado: ${slug}`);
  return loadBookByMeta(meta);
}

export function loadBookByMeta(meta: BookMeta): Promise<LocalBook> {
  const key = meta.file;
  const cached = cache.get(key);
  if (cached) return cached;

  const promise = resolveLoader(meta.file)().then((mod) => normalize(meta, mod.default));
  cache.set(key, promise);
  return promise;
}

export async function loadAllBooks(): Promise<LocalBook[]> {
  return Promise.all(BOOKS_META.map((m) => loadBookByMeta(m)));
}
