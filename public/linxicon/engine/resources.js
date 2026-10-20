// Loads the exported data files (port of resources.py). Every file is gzip; it's
// decompressed here with DecompressionStream, which works the same in browsers and
// Node, so GitHub Pages can serve the files as plain static downloads.
import { WordNet } from "./wordnet.js";

const DIMS = 300;

async function gunzip(bytes) {
  // If a host already decoded the file (Content-Encoding: gzip), it arrives unzipped.
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) return bytes;
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export class Resources {
  // readFile(name) -> Promise<Uint8Array> of the raw (still gzipped) file in data/
  static async load(readFile, onProgress = () => {}) {
    const r = new Resources();
    const text = async name => new TextDecoder().decode(await gunzip(await readFile(name)));
    const steps = [
      ["WordNet", async () => { r.wordnet = new WordNet(JSON.parse(await text("wordnet.json.gz"))); }],
      ["ConceptNet", async () => {
        const [words, vecs] = await Promise.all([text("conceptnet-words.txt.gz"), readFile("conceptnet-vecs.i8.gz").then(gunzip)]);
        r.cnWords = words.split("\n");
        r.cnIndex = new Map(r.cnWords.map((w, i) => [w, i]));
        r.cnVecs = new Int8Array(vecs.buffer, vecs.byteOffset, vecs.byteLength);
      }],
      ["phrases", async () => {
        const [cn, wiki] = await Promise.all([text("phrases_conceptnet.txt.gz"), text("phrases.txt.gz")]);
        r.phraseLists = { "phrases_conceptnet.txt.gz": phraseMap(cn), "phrases.txt.gz": phraseMap(wiki) };
      }],
      ["word weights", async () => { r.idf = JSON.parse(await text("gloss_idf.json.gz")); }],
    ];
    for (const [label, step] of steps) { onProgress(label); await step(); }
    r.vecCache = new Map();
    r.partnerCache = new Map();
    return r;
  }

  hasConceptnet(word) { return this.cnIndex.has(word); }

  // Unit-length Float32Array for a ConceptNet word, or null.
  conceptnetVector(word) {
    if (this.vecCache.has(word)) return this.vecCache.get(word);
    const i = this.cnIndex.get(word);
    let v = null;
    if (i !== undefined) {
      v = new Float32Array(DIMS);
      let n = 0;
      for (let k = 0; k < DIMS; k++) { v[k] = this.cnVecs[i * DIMS + k]; n += v[k] * v[k]; }
      n = Math.sqrt(n);
      for (let k = 0; k < DIMS; k++) v[k] /= n;
    }
    this.vecCache.set(word, v);
    return v;
  }

  // resources.conceptnet_vectors: the known words (in order) and their vectors.
  conceptnetVectors(words) {
    const known = [], vecs = [];
    for (const w of words) {
      const v = this.conceptnetVector(w);
      if (v) { known.push(w); vecs.push(v); }
    }
    return [known, vecs];
  }

  phrases(name) { return this.phraseLists[name]; }

  // word -> Map(partner -> phrase text)
  phrasePartners(name) {
    if (this.partnerCache.has(name)) return this.partnerCache.get(name);
    const out = new Map();
    for (const [key, text] of this.phrases(name)) {
      const [a, b] = key.split(" ");
      if (!out.has(a)) out.set(a, new Map());
      if (!out.has(b)) out.set(b, new Map());
      out.get(a).set(b, text);
      out.get(b).set(a, text);
    }
    this.partnerCache.set(name, out);
    return out;
  }
}

export const pairKey = (a, b) => (a < b ? `${a} ${b}` : `${b} ${a}`);

function phraseMap(text) {
  // First phrase listed for a pair wins, like resources.phrases' setdefault.
  const out = new Map();
  for (const phrase of text.split("\n")) {
    const words = phrase.split(" ");
    const key = pairKey(words[0], words[words.length - 1]);
    if (!out.has(key)) out.set(key, phrase);
  }
  return out;
}
