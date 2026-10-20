// Pair scoring for both rule sets: a line-for-line port of scorer.py, checked against it
// by tests/parity.mjs. See scorer.py for why each constant has its value.
//
// Embeddings come from an async encoder (texts -> unit Float32Arrays). Call
// prepare(words) before scoring so every word's vectors are cached; everything
// after that is synchronous.
import { Context } from "./context.js";
import { pairKey } from "./resources.js";

export const GLOSS_FIT = [1.03, -0.12];
export const WORD_FIT = [1.087, -0.195];
export const TIERS = { synonym: 1.0, derived: 0.6, hypernym: 0.6, sibling: 0.4, part: 0.4, compound: 0.3 };
export const PRIORITY = ["synonym", "derived", "hypernym", "compound", "sibling", "part"];
const FLOOR_ONLY = new Set(["derived", "hypernym"]);
const WORD_RE = /^[a-z]{3,15}$/;
export const IMPROVED = { phrase: 0.6, "wiki phrase": 0.5, root: 0.6, pattern: 0.4 };
export const WEAK_SUPPORT = 0.1;
const IMPROVED_SKIP = new Set(["compound", "sibling"]);
export const CONCEPTNET_FIT = [1.0, 0.0];
export const CONTEXT_FIT = [1.2, -0.105];
export const PREFIXES = ["counter", "inter", "super", "trans", "under", "anti", "fore", "over", "semi",
  "dis", "mis", "mid", "non", "out", "pre", "sub", "co", "de", "re", "un", "up"];
export const SUFFIXES = ["ation", "ness", "ment", "less", "able", "ible", "ship", "hood", "ward",
  "wise", "ful", "ish", "ist", "ism", "ity", "ize", "ise", "dom", "ing", "er", "ed", "ly"];
export const PATTERNS = ["phobia", "holic", "mania", "scape", "proof", "ology", "less", "ware", "free",
  "wise", "ful", "ism"];

const fit = (cos, [k, c]) => Math.min(Math.max(k * cos + c, 0), 1);
const signed = x => (x >= 0 ? `+${x}` : `${x}`);  // Python's f"{x:+}"
const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
const isLowerPy = s => s === s.toLowerCase() && s !== s.toUpperCase();  // Python str.islower()

function normalize(v) {
  let n = 0;
  for (let i = 0; i < v.length; i++) n += v[i] * v[i];
  n = Math.sqrt(n);
  const out = new Float32Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i] / n;
  return out;
}

export class Scorer {
  constructor(res, encode) {
    this.res = res;
    this.wn = res.wordnet;
    this.encode = encode;
    this.context = new Context(res);
    this.emb = new Map();
    this.memo = { status: new Map(), common: new Map(), rel: new Map() };
  }

  // ---- vocabulary ----
  baseForms(word) {
    const out = new Set([word]);
    for (const p of "nvar") { const f = this.wn.morphy(word, p); if (f) out.add(f); }
    return out;
  }

  wordnetStatus(word) {
    if (this.memo.status.has(word)) return this.memo.status.get(word);
    const bases = this.baseForms(word);
    const names = [];
    for (const s of this.wn.synsets(word)) for (const l of s.lemmaNames()) if (bases.has(l.toLowerCase())) names.push(l);
    const status = !names.length ? null : names.some(isLowerPy) ? "common" : "proper";
    this.memo.status.set(word, status);
    return status;
  }

  isBuiltFromWords(word) {
    const common = w => w.length >= 3 && this.wordnetStatus(w) === "common";
    if (PREFIXES.some(p => word.startsWith(p) && common(word.slice(p.length)))) return true;
    for (const suf of [...SUFFIXES, ...PATTERNS]) {
      const stem = word.slice(0, word.length - suf.length);
      if (word.endsWith(suf) && (common(stem) || common(stem + "e"))) return true;
    }
    for (let i = 3; i < word.length - 2; i++) if (common(word.slice(0, i)) && common(word.slice(i))) return true;
    return false;
  }

  isCommon(word) {
    if (this.memo.common.has(word)) return this.memo.common.get(word);
    let ok = false;
    if (WORD_RE.test(word)) {
      const status = this.wordnetStatus(word);
      ok = status ? status === "common" : this.res.hasConceptnet(word) && this.isBuiltFromWords(word);
    }
    this.memo.common.set(word, ok);
    return ok;
  }

  isPlayable(word, mode = "improved") {
    if (mode === "original") return this.isCommon(word) && this.wn.synsets(word).length > 0;
    return this.isCommon(word);
  }

  // ---- embeddings ----
  async prepare(words) {
    const todo = [...new Set(words)].filter(w => !this.emb.has(w));
    if (!todo.length) return;
    const texts = [], spans = [];
    for (const w of todo) {
      const glosses = this.wn.synsets(w).slice(0, 3).map(s => `${w}: ${s.definition()}`);
      spans.push([texts.length, glosses.length]);
      texts.push(w, ...glosses);
    }
    const vecs = await this.encode(texts);
    todo.forEach((w, i) => {
      const [start, n] = spans[i];
      const wordVec = vecs[start];
      let glossVec = wordVec;
      if (n) {
        const mean = new Float32Array(wordVec.length);
        for (let j = 1; j <= n; j++) for (let k = 0; k < mean.length; k++) mean[k] += vecs[start + j][k] / n;
        glossVec = normalize(mean);
      }
      const blended = new Float32Array(wordVec.length);
      for (let k = 0; k < blended.length; k++) blended[k] = wordVec[k] + glossVec[k];
      this.emb.set(w, [wordVec, normalize(blended)]);
    });
  }

  embeddingParts(a, b) {
    const [wa, ga] = this.emb.get(a), [wb, gb] = this.emb.get(b);
    const glossCos = dot(ga, gb), wordCos = dot(wa, wb);
    return { glossCos, wordCos, gloss: fit(glossCos, GLOSS_FIT), word: fit(wordCos, WORD_FIT) };
  }

  // ---- WordNet relations ----
  relationsOneWay(a, b, nounsOnly) {
    const out = {};
    const setdefault = (k, v) => { if (!(k in out)) out[k] = v; };
    const synA = this.wn.synsets(a), setB = new Set(this.wn.synsets(b).map(s => s.id));
    const ba = this.baseForms(a), bb = this.baseForms(b);
    const shared = [...ba].filter(x => bb.has(x)).sort();
    if (shared.length) out.synonym = `same base form '${shared[0]}'`;
    for (const s of synA) {
      if (setB.has(s.id)) setdefault("synonym", `both in synset ${s.name()}: ${s.definition()}`);
      const derivs = s.derivations();
      s.lemmaNames().forEach((name, i) => {
        if ((derivs[i] || []).includes(b)) setdefault("derived", `'${name}' (${s.name()}) is derivationally related to '${b}'`);
        if (name.includes("_") && name.split("_").includes(b)) setdefault("compound", `multi-word lemma '${name}' in ${s.name()}`);
      });
      if (nounsOnly && s.pos() !== "n") continue;
      const hypers = [...s.hypernyms(), ...s.instanceHypernyms()];
      for (const h of hypers) if (setB.has(h.id)) setdefault("hypernym", `${s.name()} is a kind of ${h.name()}`);
      for (const h of s.hyponyms()) if (setB.has(h.id)) setdefault("hypernym", `${h.name()} is a kind of ${s.name()}`);
      for (const h of hypers) for (const sib of h.hyponyms()) {
        if (setB.has(sib.id) && sib.id !== s.id) setdefault("sibling", `${s.name()} and ${sib.name()} are both kinds of ${h.name()}`);
      }
      for (const x of [...s.partMeronyms(), ...s.memberMeronyms(), ...s.substanceMeronyms()]) {
        if (setB.has(x.id)) setdefault("part", `${x.name()} is part of ${s.name()}`);
      }
      for (const x of [...s.partHolonyms(), ...s.memberHolonyms(), ...s.substanceHolonyms()]) {
        if (setB.has(x.id)) setdefault("part", `${s.name()} is part of ${x.name()}`);
      }
    }
    return out;
  }

  relations(a, b, nounsOnly = false) {
    const key = `${a}|${b}|${nounsOnly}`;
    if (!this.memo.rel.has(key)) this.memo.rel.set(key, { ...this.relationsOneWay(b, a, nounsOnly), ...this.relationsOneWay(a, b, nounsOnly) });
    return this.memo.rel.get(key);
  }

  // ---- other signals ----
  conceptnetScore(a, b) {
    const [words, m] = this.res.conceptnetVectors([a, b]);
    return words.length < 2 ? 0.0 : fit(dot(m[0], m[1]), CONCEPTNET_FIT);
  }

  phrase(a, b) {
    const key = pairKey(a, b);
    const cn = this.res.phrases("phrases_conceptnet.txt.gz").get(key);
    if (cn) return [cn, true];
    for (const [x, y] of [[a, b], [b, a]]) {
      for (const s of this.wn.synsets(x)) for (const name of s.lemmaNames()) {
        const parts = name.toLowerCase().split("_");
        if (parts.length > 1 && parts.includes(x) && parts.includes(y)) return [parts.join(" "), true];
      }
    }
    const wiki = this.res.phrases("phrases.txt.gz").get(key);
    return wiki ? [wiki, false] : null;
  }

  sharedRoot(a, b) {
    for (const [x, y] of [[a, b], [b, a]]) {
      const bases = this.baseForms(y);
      for (const p of PREFIXES) if (x.startsWith(p) && x.length - p.length >= 3 && bases.has(x.slice(p.length))) return `${p} + ${y}`;
      for (const suf of SUFFIXES) {
        const stem = x.slice(0, x.length - suf.length);
        if (x.endsWith(suf) && stem.length >= 3 && (bases.has(stem) || bases.has(stem + "e"))) return `${y} + ${suf}`;
      }
    }
    return null;
  }

  sharedPattern(a, b) {
    for (const p of PATTERNS) {
      if (a.endsWith(p) && b.endsWith(p)) {
        const stems = [a.slice(0, a.length - p.length), b.slice(0, b.length - p.length)];
        if (stems.every(s => s.length >= 3 && this.wn.synsets(s).length)) return `-${p}`;
      }
    }
    return null;
  }

  // ---- explain / score ----
  embeddingSignal(a, b, mode) {
    const { glossCos, wordCos, gloss, word } = this.embeddingParts(a, b);
    const raw = { "word+definition cosine": glossCos, "word+definition → game scale": gloss };
    if (mode === "original") {
      return signal("embedding", gloss, `MiniLM cosine of each word blended with its WordNet definitions, rescaled ${GLOSS_FIT[0]}×cos${signed(GLOSS_FIT[1])}`, raw);
    }
    Object.assign(raw, { "bare-word cosine": wordCos, "bare-word → game scale": word });
    return signal("embedding", Math.max(gloss, word), `higher of word+definition (${gloss.toFixed(3)}) and bare-word (${word.toFixed(3)}) MiniLM scores`, raw);
  }

  contextSignal(a, b) {
    const o = this.context.overlap(a, b);
    const best = o.best;
    if (!best) return [signal("context", 0.0, "no sense profiles big enough to compare"), o];
    const value = fit(best.f1, CONTEXT_FIT);
    const raw = { precision: best.precision, recall: best.recall, F1: best.f1, "→ game scale": value };
    return [signal("context", value, `best meaning pair: ${best.sense_a} ~ ${best.sense_b}; game scale = ${CONTEXT_FIT[0]}×F1${signed(CONTEXT_FIT[1])}`, raw), o];
  }

  explain(a, b, mode = "improved") {
    const emb = this.embeddingSignal(a, b, mode);
    const rels = this.relations(a, b, mode === "improved");
    const signals = [emb];
    let ctx = null, rule, winner;

    if (mode === "original") {
      rule = "Original rules: if WordNet relations exist, the first in priority order "
        + `(${PRIORITY.join(" > ")}) REPLACES the embedding score. derived/hypernym only `
        + "raise it to 0.6; the others set it outright, so compound (0.3) blocks a link.";
      const winnerRel = PRIORITY.find(r => r in rels) || null;
      for (const r of PRIORITY) {
        if (!(r in rels)) continue;
        const sig = signal(`wordnet: ${r}`, TIERS[r], rels[r]);
        if (r !== winnerRel) { sig.status = "skipped"; sig.note = `lower priority than ${winnerRel}`; }
        signals.push(sig);
      }
      if (winnerRel && !(FLOOR_ONLY.has(winnerRel) && emb.value > TIERS[winnerRel])) {
        winner = signals.find(s => s.name === `wordnet: ${winnerRel}`);
        emb.status = "skipped"; emb.note = `replaced by the ${winnerRel} relation`;
      } else {
        winner = emb;
        for (const s of signals.slice(1)) if (s.status === "candidate") { s.status = "skipped"; s.note = "floor only: embedding is already higher"; }
      }
    } else {
      rule = "Improved rules: every signal proposes a score and the HIGHEST wins. "
        + "WordNet relations only ever raise a score. Ties go to the more specific signal.";
      const cnKnown = this.res.conceptnetVectors([a, b])[0].length === 2;
      const cnScore = this.conceptnetScore(a, b);
      const cn = signal("conceptnet", cnScore, cnKnown ? "ConceptNet Numberbatch cosine" : "a word is missing from ConceptNet", { cosine: cnScore });
      const supported = Math.max(emb.value, cn.value) >= WEAK_SUPPORT;
      for (const r of PRIORITY) {
        if (!(r in rels)) continue;
        const sig = signal(`wordnet: ${r}`, TIERS[r], rels[r]);
        if (IMPROVED_SKIP.has(r)) {
          sig.status = "skipped";
          sig.note = r === "compound" ? "handled as a phrase instead" : "siblings are too loose; real ones link via embeddings";
        }
        signals.push(sig);
      }
      const found = this.phrase(a, b);
      if (found) {
        const [text, curated] = found;
        if (curated) {
          signals.push(signal("phrase", IMPROVED.phrase, `'${text}' (ConceptNet terms / WordNet)`, {}, `phrase: ${text}`));
        } else {
          const sig = signal("phrase (Wikipedia)", IMPROVED["wiki phrase"], `'${text}' (Wikipedia title)`, {}, `phrase: ${text} (Wikipedia)`);
          if (!supported) {
            sig.status = "skipped";
            sig.note = `needs embedding or ConceptNet ≥ ${WEAK_SUPPORT}; best is ${Math.max(emb.value, cn.value).toFixed(3)}`;
          }
          signals.push(sig);
        }
      }
      const root = this.sharedRoot(a, b);
      if (root) signals.push(signal("root", IMPROVED.root, root, {}, `root: ${root}`));
      const pattern = this.sharedPattern(a, b);
      if (pattern) signals.push(signal("pattern", IMPROVED.pattern, `both end in ${pattern}`, {}, `pattern: ${pattern}`));
      const [ctxSig, o] = this.contextSignal(a, b);
      ctx = o;
      signals.push(cn, ctxSig);
      // First-listed wins ties: relations/phrases before the fuzzy scores.
      for (const s of [...signals.slice(1), emb]) if (s.status === "candidate" && (!winner || s.value > winner.value)) winner = s;
    }
    winner.status = "winner";
    return { a, b, mode, rule, signals, score: winner.value, reason: winner.reason, context: ctx };
  }

  score(a, b, mode = "improved") {
    const e = this.explain(a, b, mode);
    return [e.score, e.reason];
  }
}

function signal(name, value, detail, raw = {}, reason = null) {
  return { name, value, detail, raw, reason: reason || name.replace("wordnet: ", ""), status: "candidate", note: "" };
}
