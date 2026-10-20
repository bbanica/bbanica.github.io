// Runs the whole engine in a background thread so the page never freezes while scoring.
// Messages: { id, type, ...args } -> { id, ok, data | error }; progress: { type: "progress", ... }.
// Answers have the same shape the Python server's API returned.
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0";
import { Resources } from "./resources.js";
import { Scorer } from "./scorer.js";
import { Game } from "./game.js";

const STARTERS = `anchor apple banana bicycle blanket bottle bridge butter camera candle castle
cheese cloud coffee comet desert diamond doctor dragon engine feather forest garden
ghost guitar hammer harbor helmet island jacket jungle kettle ladder lemon library
magnet mirror monkey mountain needle ocean orchestra oven painter pencil piano pirate
planet pocket prison rabbit rocket saddle school shadow ship silver soldier spider
storm sugar telescope theater thunder tiger tomato tower tractor treasure tunnel
umbrella violin volcano wallet whale window winter wizard`.split(/\s+/);
const MODES = ["original", "improved"];
const pick = (list, not) => { const l = list.filter(w => w !== not); return l[Math.floor(Math.random() * l.length)]; };
const progress = (step, detail = {}) => postMessage({ type: "progress", step, ...detail });

let scorer, games, ready;

async function init() {
  // A path, not a full URL: Transformers.js only checks that local files (the tokenizer)
  // exist when given a path. pathname keeps it working under a sub-path like /linxicon/.
  env.localModelPath = new URL("../models/", import.meta.url).pathname;
  env.allowLocalModels = true;  // off by default in browsers; the model ships with the page
  env.allowRemoteModels = false;
  const res = await Resources.load(async name => {
    const r = await fetch(new URL(`../data/${name}`, import.meta.url));
    if (!r.ok) throw new Error(`Couldn't load ${name} (${r.status})`);
    return new Uint8Array(await r.arrayBuffer());
  }, label => progress(label));
  progress("language model");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
    dtype: "fp16", device: "wasm",
    progress_callback: p => { if (p.status === "progress" && p.file?.endsWith(".onnx")) progress("language model", { loaded: p.loaded, total: p.total }); },
  });
  scorer = new Scorer(res, async texts => {
    const out = [];
    for (let i = 0; i < texts.length; i += 32) {
      const t = await extractor(texts.slice(i, i + 32), { pooling: "mean", normalize: true });
      const [n, d] = t.dims;
      for (let j = 0; j < n; j++) out.push(Float32Array.from(t.data.subarray(j * d, (j + 1) * d)));
    }
    return out;
  });
}

async function newGames(tl, br) {
  tl = tl || pick(STARTERS, br);
  br = br || pick(STARTERS, tl);
  const out = {};
  for (const mode of MODES) out[mode] = await Game.create(scorer, tl, br, mode);
  return out;
}

const payload = (errors = {}) => ({ ...Object.fromEntries(MODES.map(m => [m, games[m].state()])), errors });

const handlers = {
  async state() { return payload(); },

  async new({ tl, br }) {
    tl = (tl || "").trim().toLowerCase() || null;
    br = (br || "").trim().toLowerCase() || null;
    const bad = [tl, br].filter(w => w && !scorer.isPlayable(w, "original"));
    if (bad.length || (tl && tl === br)) throw new Error(`Not playable: ${bad.join(", ") || tl}`);
    games = await newGames(tl, br);
    return payload();
  },

  async add({ word }) {
    const errors = {};
    for (const mode of MODES) {
      const err = await games[mode].add(String(word || ""));
      if (err) errors[mode] = err;
    }
    return payload(errors);
  },

  // Rebuild a saved game: same start/end words, then each word in the order it was tried.
  async restore({ tl, br, tried }) {
    if (![tl, br].every(w => w && scorer.isPlayable(w, "original")) || tl === br) return null;
    games = await newGames(tl, br);
    for (const word of tried || []) for (const mode of MODES) await games[mode].add(String(word));
    return payload();
  },

  async explain({ a, b }) {
    a = (a || "").trim().toLowerCase(); b = (b || "").trim().toLowerCase();
    if (!/^[a-z]{3,15}$/.test(a) || !/^[a-z]{3,15}$/.test(b) || a === b) throw new Error("Give two different words of 3–15 letters.");
    await scorer.prepare([a, b]);
    return Object.fromEntries(MODES.map(mode => [mode, {
      ...scorer.explain(a, b, mode),
      playable: { [a]: scorer.isPlayable(a, mode), [b]: scorer.isPlayable(b, mode) },
      board: games[mode].linkStatus(a, b),
    }]));
  },
};

// One request at a time, in order, so games never see interleaved changes.
let queue = Promise.resolve();
onmessage = ({ data: { id, type, ...args } }) => {
  queue = queue.then(async () => {
    try {
      ready ??= init();  // whichever message comes first starts loading
      await ready;
      if (!handlers[type] && type !== "init") throw new Error(`Unknown request: ${type}`);
      if (type === "init" || (!games && type !== "new" && type !== "restore")) games ??= await newGames();
      postMessage({ id, ok: true, data: type === "init" ? payload() : await handlers[type](args) });
    } catch (e) {
      postMessage({ id, ok: false, error: e.message || String(e) });
    }
  });
};
