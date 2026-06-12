/* =========================================================================
   Global Kitchen — recipe generation + UI
   ========================================================================= */

/* ---------- Deterministic PRNG (so the same 5,000+ recipes appear on
   every visit, without shipping a multi-megabyte data file) ---------- */
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
function rint(r, min, max) { return min + Math.floor(r() * (max - min + 1)); }

/* ---------- Recipe generation ---------- */
const RECIPES = [];
const SUB_INDEX = {};   // subId -> { sub, cuisine, recipes: [] }
const CUISINE_INDEX = {};

(function generate() {
  for (const cuisine of CUISINE_DATA) {
    CUISINE_INDEX[cuisine.id] = { cuisine, recipes: [] };
    for (const sub of cuisine.subcuisines) {
      SUB_INDEX[sub.id] = { sub, cuisine, recipes: [] };
      for (const dish of sub.dishes) {
        for (const protein of sub.proteins) {
          const comboSeed = hashStr(sub.id + "|" + dish + "|" + protein);
          const r = rng(comboSeed);
          // Each dish×protein combo gets 2–3 style variants, deterministically
          // chosen, with the first style offset by the seed so every style
          // (incl. quick & crock pot) is well represented.
          const nStyles = 2 + (comboSeed % 2);
          const start = comboSeed % STYLE_VARIANTS.length;
          const seen = new Set();
          for (let k = 0; k < nStyles; k++) {
            const style = STYLE_VARIANTS[(start + k * 3) % STYLE_VARIANTS.length];
            if (seen.has(style.label)) continue;
            seen.add(style.label);
            const time = rint(r, style.time[0], style.time[1]);
            const recipe = {
              id: RECIPES.length,
              name: buildName(style, protein, dish),
              cuisineId: cuisine.id,
              subId: sub.id,
              cuisineName: cuisine.name,
              subName: sub.name,
              flag: sub.flag,
              dish, protein,
              styleLabel: style.label,
              method: style.method,
              time,
              servings: rint(r, 2, 8),
              difficulty: style.method === "crockpot" ? 1 : rint(r, 1, 3),
              vegetarian: VEG_PROTEINS.has(protein),
              aromatic: pick(r, sub.aromatics),
              staple: pick(r, sub.staples),
              seed: comboSeed + k
            };
            RECIPES.push(recipe);
            SUB_INDEX[sub.id].recipes.push(recipe);
            CUISINE_INDEX[cuisine.id].recipes.push(recipe);
          }
        }
      }
    }
  }
})();

function buildName(style, protein, dish) {
  const prefix = style.id === "classic" ? "Classic"
    : style.id === "quick" ? "30-Minute"
    : style.id === "crockpot" ? "Crock Pot"
    : style.label;
  return `${prefix} ${protein} ${dish}`;
}

/* ---------- On-demand ingredient & instruction generation ---------- */
const PANTRY = ["olive oil", "kosher salt", "black pepper", "yellow onion, diced", "garlic cloves, minced"];
const VEG_ADDONS = ["bell pepper, sliced", "carrots, sliced", "snap peas", "broccoli florets", "zucchini, chopped", "spinach", "green beans, trimmed", "cherry tomatoes, halved", "mushrooms, sliced", "red onion, sliced"];
const FINISHERS = ["fresh herbs, chopped, to garnish", "a squeeze of fresh citrus", "toasted nuts or seeds", "a drizzle of good oil", "thinly sliced scallions", "chili flakes, to taste"];

function buildRecipeDetail(rec) {
  const r = rng(rec.seed ^ 0x9e3779b9);
  const qty = (lo, hi, unit) => `${rint(r, lo, hi)} ${unit}`;
  const ingredients = [
    `${qty(1, 2, "lb")} ${rec.protein.toLowerCase()}${rec.vegetarian ? "" : ", trimmed and cut into bite-size pieces"}`,
    `2 tbsp ${PANTRY[0]}`,
    `${qty(1, 3, "tsp")} ${PANTRY[1]} (to taste)`,
    `1/2 tsp ${PANTRY[2]}`,
    `1 ${PANTRY[3]}`,
    `${rint(r, 2, 4)} ${PANTRY[4]}`,
    `Signature seasoning: ${rec.aromatic}`,
    `${pick(r, VEG_ADDONS)}`,
    `${pick(r, VEG_ADDONS)}`,
    `${rec.staple}, to serve`,
    `${pick(r, FINISHERS)}`
  ];

  let steps;
  if (rec.method === "crockpot") {
    steps = [
      `Season the ${rec.protein.toLowerCase()} generously with salt, pepper, and the ${rec.aromatic}.`,
      `Layer the onion and vegetables in the bottom of the crock pot, then add the ${rec.protein.toLowerCase()} on top.`,
      `Add garlic and 1 cup of liquid (stock, sauce base, or water as the dish calls for). Cover.`,
      `Cook on LOW for ${Math.round(rec.time / 60)}–${Math.round(rec.time / 60) + 1} hours (or HIGH for about half that), until tender and the flavors have melded.`,
      `Taste and adjust seasoning. Shred or stir gently as appropriate for ${rec.dish.toLowerCase()}.`,
      `Serve over ${rec.staple} and finish with the garnish.`
    ];
  } else if (rec.method === "grill") {
    steps = [
      `Marinate the ${rec.protein.toLowerCase()} in the ${rec.aromatic} with oil, salt, and garlic for at least 15 minutes.`,
      `Preheat a grill or grill pan to medium-high heat.`,
      `Grill the ${rec.protein.toLowerCase()} until charred at the edges and cooked through, turning once.`,
      `Grill the vegetables alongside until tender with light char marks.`,
      `Rest briefly, then slice and assemble in the style of ${rec.dish.toLowerCase()}.`,
      `Serve with ${rec.staple} and the finishing garnish.`
    ];
  } else if (rec.method === "oven") {
    steps = [
      `Preheat the oven to ${pick(r, [350, 375, 400])}°F (${pick(r, [175, 190, 200])}°C).`,
      `Sauté the onion and garlic in oil until softened; stir in the ${rec.aromatic}.`,
      `Combine with the ${rec.protein.toLowerCase()} and vegetables in a baking dish, building the layers of ${rec.dish.toLowerCase()}.`,
      `Bake for ${rec.time - 15}–${rec.time} minutes, until bubbling and cooked through.`,
      `Rest 5–10 minutes so it sets and the flavors settle.`,
      `Serve with ${rec.staple} and finish with the garnish.`
    ];
  } else {
    steps = [
      `Prep everything first: cut the ${rec.protein.toLowerCase()}, dice the onion, mince the garlic, and measure out the ${rec.aromatic}.`,
      `Heat the oil in a large skillet or wok over medium-high heat.`,
      `Cook the ${rec.protein.toLowerCase()} until just done; remove and set aside.`,
      `In the same pan, cook the onion, garlic, and vegetables until crisp-tender, then stir in the ${rec.aromatic}.`,
      `Return the ${rec.protein.toLowerCase()} to the pan and toss everything together in the style of ${rec.dish.toLowerCase()}, about 2–3 minutes.`,
      `Serve hot over ${rec.staple}, topped with the finishing garnish.`
    ];
  }
  return { ingredients, steps };
}

/* ---------- UI state ---------- */
const PAGE_SIZE = 24;
let state = { scope: null, page: 0, search: "", quick: null };

const $ = (id) => document.getElementById(id);
const columnsEl = $("cuisineColumns");
const browserEl = $("browser");
const gridEl = $("recipeGrid");

function fmtTime(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}
const DIFF = { 1: "Easy", 2: "Medium", 3: "Involved" };

/* ---------- Render cuisine columns ---------- */
function renderColumns() {
  columnsEl.innerHTML = CUISINE_DATA.map((c) => {
    const total = CUISINE_INDEX[c.id].recipes.length;
    const subs = c.subcuisines.map((s) =>
      `<li><button class="sub-link" data-sub="${s.id}">
         <span>${s.flag} ${s.name}</span>
         <span class="sub-count">${SUB_INDEX[s.id].recipes.length}</span>
       </button></li>`).join("");
    return `
      <div class="cuisine-col" style="--accent:${c.color}">
        <div class="col-head">
          <span class="col-icon">${c.icon}</span>
          <h2>${c.name}</h2>
          <p class="col-blurb">${c.blurb}</p>
        </div>
        <ul class="sub-list">${subs}</ul>
        <button class="col-all" data-cuisine="${c.id}">View all ${total.toLocaleString()} ${c.name} recipes →</button>
      </div>`;
  }).join("");
}

/* ---------- Recipe scope resolution ---------- */
function currentRecipes() {
  let list;
  if (state.quick === "quick30") list = RECIPES.filter((x) => x.time <= 30);
  else if (state.quick === "crockpot") list = RECIPES.filter((x) => x.method === "crockpot");
  else if (state.quick === "all") list = RECIPES;
  else if (state.scope?.type === "sub") list = SUB_INDEX[state.scope.id].recipes;
  else if (state.scope?.type === "cuisine") list = CUISINE_INDEX[state.scope.id].recipes;
  else list = RECIPES;

  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter((x) =>
      x.name.toLowerCase().includes(q) ||
      x.subName.toLowerCase().includes(q) ||
      x.cuisineName.toLowerCase().includes(q) ||
      x.aromatic.toLowerCase().includes(q));
  }
  if ($("filter30").checked) list = list.filter((x) => x.time <= 30);
  if ($("filterCrock").checked) list = list.filter((x) => x.method === "crockpot");
  if ($("filterVeg").checked) list = list.filter((x) => x.vegetarian);

  const sort = $("sortSelect").value;
  list = list.slice();
  if (sort === "time") list.sort((a, b) => a.time - b.time || a.name.localeCompare(b.name));
  else if (sort === "difficulty") list.sort((a, b) => a.difficulty - b.difficulty || a.name.localeCompare(b.name));
  else list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

/* ---------- Render browser ---------- */
function renderBrowser() {
  const list = currentRecipes();
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  state.page = Math.min(state.page, pages - 1);
  const slice = list.slice(state.page * PAGE_SIZE, (state.page + 1) * PAGE_SIZE);

  let title, sub;
  if (state.search) { title = `Search: “${state.search}”`; sub = ""; }
  else if (state.quick === "quick30") { title = "⏱️ 30-Minute Meals"; sub = "On the table in half an hour or less."; }
  else if (state.quick === "crockpot") { title = "🍲 Crock Pot Meals"; sub = "Set it in the morning, eat well tonight."; }
  else if (state.quick === "all") { title = "📖 All Recipes"; sub = "Every recipe in the library."; }
  else if (state.scope?.type === "sub") { const s = SUB_INDEX[state.scope.id]; title = `${s.sub.flag} ${s.sub.name} Recipes`; sub = `Part of our ${s.cuisine.name} collection.`; }
  else if (state.scope?.type === "cuisine") { const c = CUISINE_INDEX[state.scope.id]; title = `${c.cuisine.icon} ${c.cuisine.name} Recipes`; sub = c.cuisine.blurb; }
  else { title = "All Recipes"; sub = ""; }

  $("browserTitle").textContent = title;
  $("browserSub").textContent = `${list.length.toLocaleString()} recipes${sub ? " — " + sub : ""}`;

  gridEl.innerHTML = slice.map((x) => `
    <article class="card" data-id="${x.id}">
      <div class="card-top" style="--accent:${CUISINE_INDEX[x.cuisineId].cuisine.color}">
        <span class="card-flag">${x.flag}</span>
        <div class="card-badges">
          ${x.time <= 30 ? '<span class="badge badge-quick">⏱️ 30 min</span>' : ""}
          ${x.method === "crockpot" ? '<span class="badge badge-crock">🍲 Crock Pot</span>' : ""}
          ${x.vegetarian ? '<span class="badge badge-veg">🥦 Veg</span>' : ""}
        </div>
      </div>
      <h3>${x.name}</h3>
      <p class="card-meta">${x.subName} · ${fmtTime(x.time)} · ${DIFF[x.difficulty]} · Serves ${x.servings}</p>
      <p class="card-flavor">Featuring ${x.aromatic}, served with ${x.staple}.</p>
    </article>`).join("") || `<p class="empty">No recipes match those filters — try removing one.</p>`;

  $("pageInfo").textContent = `Page ${state.page + 1} of ${pages}`;
  $("prevPage").disabled = state.page === 0;
  $("nextPage").disabled = state.page >= pages - 1;

  columnsEl.classList.add("hidden");
  document.querySelector(".hero").classList.add("hidden");
  browserEl.classList.remove("hidden");
  window.scrollTo({ top: 0 });
}

function goHome() {
  state = { scope: null, page: 0, search: "", quick: null };
  $("searchInput").value = "";
  $("filter30").checked = $("filterCrock").checked = $("filterVeg").checked = false;
  browserEl.classList.add("hidden");
  columnsEl.classList.remove("hidden");
  document.querySelector(".hero").classList.remove("hidden");
  window.scrollTo({ top: 0 });
}

/* ---------- Modal ---------- */
function openRecipe(id) {
  const rec = RECIPES[id];
  const d = buildRecipeDetail(rec);
  $("modalBody").innerHTML = `
    <p class="modal-crumb">${rec.cuisineName} › ${rec.flag} ${rec.subName}</p>
    <h2>${rec.name}</h2>
    <div class="modal-stats">
      <span>⏱️ ${fmtTime(rec.time)}</span>
      <span>🍽️ Serves ${rec.servings}</span>
      <span>📊 ${DIFF[rec.difficulty]}</span>
      <span>${rec.method === "crockpot" ? "🍲 Crock pot" : rec.method === "grill" ? "🔥 Grill" : rec.method === "oven" ? "♨️ Oven" : "🍳 Stovetop"}</span>
      ${rec.vegetarian ? "<span>🥦 Vegetarian</span>" : ""}
    </div>
    <div class="modal-cols">
      <div>
        <h3>Ingredients</h3>
        <ul class="ing-list">${d.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>
      <div>
        <h3>Instructions</h3>
        <ol class="step-list">${d.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
      </div>
    </div>`;
  $("modalOverlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  $("modalOverlay").classList.add("hidden");
  document.body.style.overflow = "";
}

/* ---------- Wire up events ---------- */
renderColumns();
$("totalCount").textContent = `${RECIPES.length.toLocaleString()} recipes`;
$("heroCount").textContent = RECIPES.length.toLocaleString();

columnsEl.addEventListener("click", (e) => {
  const subBtn = e.target.closest("[data-sub]");
  const allBtn = e.target.closest("[data-cuisine]");
  if (subBtn) { state = { ...state, scope: { type: "sub", id: subBtn.dataset.sub }, quick: null, page: 0 }; renderBrowser(); }
  else if (allBtn) { state = { ...state, scope: { type: "cuisine", id: allBtn.dataset.cuisine }, quick: null, page: 0 }; renderBrowser(); }
});

document.querySelectorAll("[data-quick]").forEach((b) =>
  b.addEventListener("click", () => { state = { scope: null, page: 0, search: "", quick: b.dataset.quick }; renderBrowser(); }));

$("backBtn").addEventListener("click", goHome);
$("brandHome").addEventListener("click", (e) => { e.preventDefault(); goHome(); });

let searchTimer;
$("searchInput").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = e.target.value.trim();
    state.page = 0;
    if (state.search) renderBrowser();
    else if (!state.scope && !state.quick) goHome();
    else renderBrowser();
  }, 200);
});

["filter30", "filterCrock", "filterVeg", "sortSelect"].forEach((id) =>
  $(id).addEventListener("change", () => { state.page = 0; renderBrowser(); }));

$("prevPage").addEventListener("click", () => { state.page--; renderBrowser(); });
$("nextPage").addEventListener("click", () => { state.page++; renderBrowser(); });

gridEl.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openRecipe(Number(card.dataset.id));
});
$("modalClose").addEventListener("click", closeModal);
$("modalOverlay").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
