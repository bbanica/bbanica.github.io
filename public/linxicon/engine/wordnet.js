// WordNet 3.0 in the browser, reproducing NLTK's wn.synsets() and wn.morphy() exactly
// (nltk/corpus/reader/wordnet.py, _morphy and synsets). Data comes from wordnet.json.gz,
// written by export_web_data.py.

export class Synset {
  constructor(wn, id) { this.wn = wn; this.id = id; this.row = wn.rows[id]; }
  get_(field) { return this.row[this.wn.field[field]]; }
  name() { return this.get_("name"); }
  pos() { return this.get_("pos"); }
  definition() { return this.get_("definition"); }
  examples() { return this.get_("examples"); }
  lemmaNames() { return this.get_("lemmas"); }
  // derivations()[i] = names of lemmas derivationally related to lemmaNames()[i]
  derivations() { return this.get_("derivations") || []; }
  rel(field) { return (this.get_(field) || []).map(id => this.wn.synset(id)); }
  hypernyms() { return this.rel("hypernyms"); }
  instanceHypernyms() { return this.rel("instance_hypernyms"); }
  hyponyms() { return this.rel("hyponyms"); }
  partMeronyms() { return this.rel("part_meronyms"); }
  memberMeronyms() { return this.rel("member_meronyms"); }
  substanceMeronyms() { return this.rel("substance_meronyms"); }
  partHolonyms() { return this.rel("part_holonyms"); }
  memberHolonyms() { return this.rel("member_holonyms"); }
  substanceHolonyms() { return this.rel("substance_holonyms"); }
}

export class WordNet {
  constructor(data) {
    this.rows = data.synsets;
    this.field = Object.fromEntries(data.fields.map((f, i) => [f, i]));
    this.index = data.index;
    this.exceptions = data.exceptions;
    this.substitutions = data.substitutions;
    this.posList = data.posList;
    this.cache = new Map();
    this.synsetCache = [];
  }

  synset(id) {
    return this.synsetCache[id] || (this.synsetCache[id] = new Synset(this, id));
  }

  // nltk _morphy: exception list or one round of suffix rules, then keep forms in the index.
  _morphy(form, pos) {
    const exceptions = this.exceptions[pos] || {};
    let forms;
    if (Object.hasOwn(exceptions, form)) {
      forms = exceptions[form];
    } else {
      forms = [];
      for (const [old, rep] of this.substitutions[pos] || []) {
        if (form.endsWith(old)) forms.push(form.slice(0, form.length - old.length) + rep);
      }
    }
    const out = [], seen = new Set();
    for (const f of [form, ...forms]) {
      const entry = Object.hasOwn(this.index, f) ? this.index[f] : null;
      if (entry && Object.hasOwn(entry, pos) && !seen.has(f)) { out.push(f); seen.add(f); }
    }
    return out;
  }

  morphy(form, pos = null) {
    for (const p of pos ? [pos] : this.posList) {
      const analyses = this._morphy(form, p);
      if (analyses.length) return analyses[0];
    }
    return null;
  }

  // wn.synsets(lemma): every part of speech, every morphy form, every offset, in NLTK's order.
  synsets(lemma) {
    lemma = lemma.toLowerCase();
    if (this.cache.has(lemma)) return this.cache.get(lemma);
    const out = [];
    for (const p of this.posList) {
      for (const form of this._morphy(lemma, p)) {
        for (const id of this.index[form][p] || []) out.push(this.synset(id));
      }
    }
    this.cache.set(lemma, out);
    return out;
  }
}
