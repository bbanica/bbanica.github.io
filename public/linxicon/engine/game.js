// Game state and graph rules: a port of game.py (rules from linxicon.com's client bundle).
export const THRESHOLD = 0.3995;
export const MAX_LINKS = 5;
export const MAX_WORDS = 50;

export const edgeId = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);

// Keep edges that are in the top MAX_LINKS of either endpoint.
export function prune(edges) {
  const valid = edges.filter(e => e.score >= THRESHOLD);
  const keep = new Set();
  const words = new Set(valid.flatMap(e => [e.a, e.b]));
  for (const word of words) {
    const mine = valid.filter(e => e.a === word || e.b === word).sort((x, y) => y.score - x.score);
    for (const e of mine.slice(0, MAX_LINKS)) keep.add(e.id);
  }
  return valid.filter(e => keep.has(e.id));
}

// Fewest-words path; among those, the highest score sum.
export function shortestPath(edges, start, goal) {
  const adj = new Map();
  for (const e of edges) {
    if (!adj.has(e.a)) adj.set(e.a, []);
    if (!adj.has(e.b)) adj.set(e.b, []);
    adj.get(e.a).push([e.b, e.score]);
    adj.get(e.b).push([e.a, e.score]);
  }
  const dist = new Map([[start, 0]]), best = new Map([[start, 0]]), prev = new Map([[start, null]]);
  const queue = [start];
  for (let qi = 0; qi < queue.length; qi++) {
    const node = queue[qi];
    for (const [nxt, s] of adj.get(node) || []) {
      if (!dist.has(nxt)) { dist.set(nxt, dist.get(node) + 1); queue.push(nxt); }
      if (dist.get(nxt) === dist.get(node) + 1 && best.get(node) + s > (best.has(nxt) ? best.get(nxt) : -1)) {
        best.set(nxt, best.get(node) + s);
        prev.set(nxt, node);
      }
    }
  }
  if (!dist.has(goal)) return [];
  const path = [goal];
  while (prev.get(path[path.length - 1]) !== null) path.push(prev.get(path[path.length - 1]));
  return path.reverse();
}

export class Game {
  // Use Game.create: adding words needs embeddings, which are async.
  constructor(scorer, tl, br, mode) {
    Object.assign(this, { scorer, tl, br, mode, words: [], pairs: new Map(), edges: [] });
  }

  static async create(scorer, tl, br, mode) {
    const g = new Game(scorer, tl, br, mode);
    for (const w of [tl, br]) await g._add(w);
    return g;
  }

  async _add(word) {
    await this.scorer.prepare([word, ...this.words]);
    for (const other of this.words) {
      const [score, reason] = this.scorer.score(word, other, this.mode);
      const [a, b] = word < other ? [word, other] : [other, word];
      const id = edgeId(a, b);
      this.pairs.set(id, { id, a, b, score, reason });
    }
    this.words.push(word);
    this.edges = prune([...this.pairs.values()]);
  }

  async add(word) {
    word = word.trim().toLowerCase();
    if (this.won) return "Game already won.";
    if (this.words.length >= MAX_WORDS) return "No more words.";
    if (this.words.includes(word)) return `"${word}" already added.`;
    if (!this.scorer.isPlayable(word, this.mode)) return "That word is not playable.";
    await this._add(word);
    return null;
  }

  get path() { return shortestPath(this.edges, this.tl, this.br); }
  get won() { return this.path.length > 0; }

  linkStatus(a, b) {
    if (!this.words.includes(a) || !this.words.includes(b) || a === b) return null;
    const pair = this.pairs.get(edgeId(a, b));
    const valid = [...this.pairs.values()].filter(e => e.score >= THRESHOLD).sort((x, y) => y.score - x.score);
    const rank = word => {
      const mine = valid.filter(e => e.a === word || e.b === word).map(e => e.id);
      const i = mine.indexOf(pair.id);
      return { rank: i >= 0 ? i + 1 : null, of: mine.length };
    };
    const ra = rank(a), rb = rank(b);
    const linked = this.edges.some(e => e.id === pair.id);
    let why;
    if (pair.score < THRESHOLD) why = `score ${pair.score.toFixed(3)} is below the ${THRESHOLD} threshold`;
    else if (linked) why = `kept: in the top ${MAX_LINKS} of ` + [[a, ra], [b, rb]].filter(([, r]) => r.rank && r.rank <= MAX_LINKS).map(([w]) => w).join(" and ");
    else why = `pruned: both words already have ${MAX_LINKS} stronger links`;
    const path = this.path;
    const onPath = linked && path.slice(1).some((w, i) => (w === a && path[i] === b) || (w === b && path[i] === a));
    return { linked, why, threshold: THRESHOLD, max_links: MAX_LINKS, rank: { [a]: ra, [b]: rb }, on_path: onPath };
  }

  state() {
    const path = this.path;
    const pathEdges = path.slice(1).map((w, i) => this.pairs.get(edgeId(path[i], w)));
    return {
      tl: this.tl, br: this.br, mode: this.mode, words: [...this.words], edges: this.edges, path, won: path.length > 0,
      avgScore: pathEdges.length ? pathEdges.reduce((s, e) => s + e.score, 0) / pathEdges.length : 0,
      pairs: [...this.pairs.values()], threshold: THRESHOLD, maxWords: MAX_WORDS,
    };
  }
}
