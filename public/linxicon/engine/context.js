// Shared-context signal: a port of context.py (see its docstring for the method).
// Each word becomes up to MAX_SENSES sense profiles; two words are compared sense by
// sense with an IDF-weighted soft overlap of ConceptNet vectors, and the best pair wins.

const MAX_SENSES = 4;
const MIN_PROFILE = 4;
const STOP = new Set(`the and for with that this from into onto over under than then them they their
there these those which what when where while who whom whose why how any all some such
each every other another one two can could may might must shall should will would being
been have has had does did doing done not nor but yet also very more most much many few
less least used use uses using make makes made something someone thing things person
people especially usually often sometimes typically way part kind type form act state
quality etc via`.split(/\s+/));
const WORD = /[a-z]{3,15}/g;

export class Context {
  constructor(res) {
    this.res = res;
    this.wn = res.wordnet;
    this.idf = res.idf;
    this.maxIdf = Math.max(...Object.values(res.idf));
    this.cache = new Map();
  }

  weight(word) { return Object.hasOwn(this.idf, word) ? this.idf[word] : this.maxIdf; }

  contentWords(text) {
    const out = [];
    for (const w of text.toLowerCase().match(WORD) || []) {
      if (STOP.has(w)) continue;
      out.push(this.wn.morphy(w, "n") || this.wn.morphy(w, "v") || w);
    }
    return out;
  }

  static singleLemmas(synset, exclude) {
    return synset.lemmaNames().filter(n => !n.includes("_") && n.toLowerCase() !== exclude).map(n => n.toLowerCase());
  }

  // [{ sense, definition, words: Map(word -> source) }]
  profiles(word) {
    if (this.cache.has(word)) return this.cache.get(word);
    const senses = [];
    for (const s of this.wn.synsets(word).slice(0, MAX_SENSES)) {
      const words = new Map();
      const add = (w, src) => { if (!words.has(w)) words.set(w, src); };
      for (const w of this.contentWords([s.definition(), ...s.examples()].join(" "))) add(w, "gloss");
      for (const w of Context.singleLemmas(s, word)) add(w, "synonym");
      for (const h of s.hypernyms()) for (const w of Context.singleLemmas(h, word)) add(w, "category");
      senses.push({ sense: s.name(), definition: s.definition(), words });
    }

    const partnerMap = this.res.phrasePartners("phrases_conceptnet.txt.gz").get(word);
    const [partners, pv] = this.res.conceptnetVectors(partnerMap ? [...partnerMap.keys()].sort() : []);
    if (partners.length) {
      if (!senses.length) senses.push({ sense: "phrases", definition: "(no WordNet entry: phrase partners only)", words: new Map() });
      // Place each partner in the sense whose words it is closest to on average.
      const centroids = senses.map(s => {
        const [, m] = this.res.conceptnetVectors([...s.words.keys()]);
        const c = new Float32Array(300);
        if (m.length) for (const v of m) for (let k = 0; k < 300; k++) c[k] += v[k] / m.length;
        let n = 0;
        for (let k = 0; k < 300; k++) n += c[k] * c[k];
        n = Math.sqrt(n) || 1;
        for (let k = 0; k < 300; k++) c[k] /= n;
        return c;
      });
      partners.forEach((w, i) => {
        let best = 0, bestSim = -Infinity;
        centroids.forEach((c, j) => { const sim = dot(pv[i], c); if (sim > bestSim) { bestSim = sim; best = j; } });
        if (!senses[best].words.has(w)) senses[best].words.set(w, "phrase");
      });
    }
    for (const s of senses) s.words.delete(word);
    this.cache.set(word, senses);
    return senses;
  }

  compare(sa, sb) {
    const [wa, ma] = this.res.conceptnetVectors([...sa.keys()]);
    const [wb, mb] = this.res.conceptnetVectors([...sb.keys()]);
    if (wa.length < MIN_PROFILE || wb.length < MIN_PROFILE) return null;
    const rowMax = new Float64Array(wa.length).fill(-Infinity), rowArg = new Int32Array(wa.length);
    const colMax = new Float64Array(wb.length).fill(-Infinity), colArg = new Int32Array(wb.length);
    for (let i = 0; i < wa.length; i++) {
      const a = ma[i];
      for (let j = 0; j < wb.length; j++) {
        const sim = dot(a, mb[j]);
        if (sim > rowMax[i]) { rowMax[i] = sim; rowArg[i] = j; }
        if (sim > colMax[j]) { colMax[j] = sim; colArg[j] = i; }
      }
    }
    const weightA = wa.map(w => this.weight(w)), weightB = wb.map(w => this.weight(w));
    const sum = a => a.reduce((x, y) => x + y, 0);
    let p = 0, r = 0;
    wa.forEach((_, i) => { p += rowMax[i] * weightA[i]; });
    wb.forEach((_, j) => { r += colMax[j] * weightB[j]; });
    p /= sum(weightA); r /= sum(weightB);
    const f1 = p + r > 0 ? (2 * p * r) / (p + r) : 0.0;
    // (word a, source, word b, source, cosine, weight): weight is the side doing the matching
    const all = [
      ...wa.map((w, i) => [w, sa.get(w), wb[rowArg[i]], sb.get(wb[rowArg[i]]), rowMax[i], weightA[i]]),
      ...wb.map((w, j) => [wa[colArg[j]], sa.get(wa[colArg[j]]), w, sb.get(w), colMax[j], weightB[j]]),
    ].sort((x, y) => y[4] * y[5] - x[4] * x[5]);
    const seen = new Set(), matches = [];
    for (const m of all) {
      const k = `${m[0]}|${m[2]}`;
      if (!seen.has(k)) { seen.add(k); matches.push(m); }
    }
    return { precision: p, recall: r, f1, size_a: wa.length, size_b: wb.length, matches };
  }

  weighted(words) {
    const [known] = this.res.conceptnetVectors([...words.keys()]);
    return known.map(w => [w, words.get(w), this.weight(w)]).sort((x, y) => y[2] - x[2]);
  }

  overlap(a, b) {
    const without = (senses, w) => senses.map(s => ({ ...s, words: new Map([...s.words].filter(([k]) => k !== w)) }));
    const pa = without(this.profiles(a), b), pb = without(this.profiles(b), a);
    const tried = [];
    let best = null;
    for (const sa of pa) for (const sb of pb) {
      const res = this.compare(sa.words, sb.words);
      if (!res) continue;
      tried.push({ sense_a: sa.sense, sense_b: sb.sense, f1: res.f1 });
      if (!best || res.f1 > best.f1) {
        best = { ...res, sense_a: sa.sense, def_a: sa.definition, sense_b: sb.sense, def_b: sb.definition,
                 profile_a: this.weighted(sa.words), profile_b: this.weighted(sb.words) };
      }
    }
    return { best, tried: tried.sort((x, y) => y.f1 - x.f1), senses_a: pa.length, senses_b: pb.length };
  }
}

function dot(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
