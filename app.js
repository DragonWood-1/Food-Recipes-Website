/* =========================================================================
   Foodie World — recipe generation + UI
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

/* ---------- Cross-cutting tags ----------
   The same recipes are browsable three extra ways: by Category
   (meal/diet/appliance), by main Ingredient, and by Season. These tags are
   derived from each recipe's dish, protein, cooking method, and flavors. */
const BREAKFAST_RE = /congee|miso soup|onigiri|menemen|shakshuka|chilaquiles|migas|upma|dosa|uttapam|idli|omelette|manakish|pão de queijo|pao de queijo|porridge|curd rice/i;
const BREAKFAST_SWEET_RE = /pancake|waffle|beignet|concha|hotteok|donut|doughnut|sfenj|berliner|madeleine|scone|churro|taiyaki|dorayaki/i;
const LUNCHY_RE = /soup|salad|sandwich|bowl|wrap|taco|banh mi|po' boy|po'boy|roll|pita|gyro|shawarma|\bbun\b|chowder|pho|noodle/i;
const NONVEGAN_RE = /yogurt|cream|butter|cheese|milk|ghee|honey|mascarpone|custard|condensed|egg/i;
const VEGAN_SWEET_RE = /coconut|fruit|mango|berry|sorbet|sago|fig|date|tapioca|lime|passion|açaí|acai|guava|pandan/i;
const KETO_BLOCK_RE = /rice|noodle|bread|naan|roti|pita|tortilla|pasta|spaghetti|penne|dumpling|\bbun\b|taco|burrito|pav|samosa|couscous|bulgur|pancake|sandwich|jambalaya|paella|biryani|risotto|congee|lo mein|ramen|udon|chow|pho|wonton|spring roll|dosa|idli|uttapam|frankie|empanada|croqueta|coxinha|pide|lahmacun|manakish|börek|borek|pierogi|po'boy|po' boy|frito|nacho|quesadilla|enchilada|tamale|gnocchi|spätzle|spatzle/i;
const CARB_PROTEINS = new Set(["Chickpea", "Lentil", "Black Bean", "White Bean", "Kidney Bean", "Red Bean", "Potato", "Quinoa", "Sprouted Bean"]);
const DAIRY_EGG = new Set(["Paneer", "Feta", "Halloumi", "Egg"]);
const GLUTEN_DISH_RE = /noodle|lo mein|chow mein|chow fun|ramen|udon|soba|yakisoba|wonton|dumpling|gyoza|momo|spring roll|cha gio|schnitzel|katsu|tempura|pancake|okonomiyaki|pajeon|börek|borek|pide|lahmacun|manakish|pita|naan|roti|baguette|\bbread\b|sandwich|po' boy|po'boy|banh mi|pasta|lasagna|spaghetti|carbonara|gnocchi|spätzle|spatzle|\bpav\b|frankie|samosa|empanada|croqueta|coxinha|pierogi|manti|crêpe|crepe|waffle|beignet|churro|baklav|cannoli|strudel|donut|doughnut|berliner|sfenj|cake|cookie|\bpie\b|tart|zeppole|profiterole|madeleine|jalebi|gulab jamun|maamoul|chebakia|ghriba|biscuit|scone|brioche|panettone|stollen|lebkuchen|toast|burger|wrap|gozleme|simit|pretzel|galette|cobbler|crumble|crisp|shortcake|bread pudding|frito|nacho|quesadilla|enchilada|tostada|sopaipilla|sopapilla|concha|frankie|revani/i;
const GLUTEN_STAPLE_RE = /flour tortilla|noodle|bread|naan|pita|baguette|pasta|spaghetti|penne|spätzle|spatzle|\bbun\b|pav|couscous|bulgur|simit|ciabatta|khobz|luchi|bhakri|panko|crust|wheat/i;
const MED_SUBS = new Set(["greek", "italian", "spanish", "french", "lebanese", "turkish", "moroccan"]);
// Genuinely crispy/fried dishes only (stir-fries are stripped out before testing).
const FRYABLE_RE = /\bfr(y|ied|ies)\b|deep-fried|crispy|\bcrisp\b|katsu|tonkatsu|tempura|schnitzel|cutlet|milanesa|breaded|\bwing|nugget|popper|fritter|croquet|coxinha|arancini|rangoon|\bbhaji\b|pakora|\bvada\b|\bbonda\b|falafel|hush ?pupp|calamari|onion ring|spring roll|egg roll|lumpia|cha gio|samosa|empanada|taquito|flauta|chimichanga|tostada|sopaip|sopap|\bsope|chilaquile|karaage|gyoza|potsticker|frites|pajeon|banh xeo|\bdosa\b|uttapam|crab cake|currywurst|frikadelle|keftede|kibbeh|b[öo]rek|bastilla|\bnacho|\bfrito|migas|amritsari|chongqing|salt and pepper|patatas bravas|batata harra/i;
// True ground / minced beef dishes (vs. steak, strips, or braised cuts).
const GROUND_BEEF_RE = /kofta|kafta|kefta|köfte|kofte|keema|kheema|qeema|picadillo|picadinho|chili con carne|meatball|meatloaf|albondiga|albóndiga|polpette|keftede|frikadelle|kibbeh|kibbe|lasagna|lasagne|bolognese|\bragu\b|ragù|moussaka|pastitsio|\blarb\b|laab|mince|minced|mapo|\btaco|enchilada|burrito|\bnacho|frito pie|taco soup|sloppy|dirty rice|lahmacun|manti|escondidinho|krapow|basil stir-fry|salisbury/i;

function applyTags(rec) {
  const dish = rec.dish.toLowerCase();
  const staple = (rec.staple || "").toLowerCase();
  const arom = (rec.aromatic || "").toLowerCase();
  const text = dish + " " + arom;
  const dessert = rec.course === "dessert";

  // --- Ingredient hub ---
  const ing = [];
  if (rec.protein === "Chicken") ing.push("chicken");
  if (rec.protein === "Beef" && GROUND_BEEF_RE.test(dish)) ing.push("beef");
  if (rec.protein === "Salmon") ing.push("salmon");
  if (rec.protein === "Shrimp") ing.push("shrimp");
  if (rec.protein === "Potato" || /potato|aloo|batata|\bpapa\b|fingerling/.test(dish) || /potato/.test(staple)) ing.push("potato");
  if (/risotto|paella|congee|biryani|pilaf|pilav|chaufa|jambalaya|bibimbap|fried rice|arroz/.test(dish) || (/rice/.test(staple) && !/noodle|paper/.test(staple))) ing.push("rice");
  if (/pasta|lasagna|noodle|lo mein|chow fun|chow mein|carbonara|gnocchi|spätzle|spatzle|japchae|pad thai|drunken noodle|dan dan|macaroni|piccata|marsala|parmigiana|arrabbiata|pomodoro/.test(dish) || /noodle|spaghetti|penne|pasta|spätzle|spatzle/.test(staple)) ing.push("pasta");
  rec.ingredientTags = ing;

  // --- Meals (a recipe can be more than one) ---
  const meals = [];
  if (!dessert && BREAKFAST_RE.test(dish)) meals.push("breakfast");
  if (dessert && BREAKFAST_SWEET_RE.test(dish)) meals.push("breakfast");
  if (!dessert) {
    meals.push("dinner");
    if (rec.time <= 40 || LUNCHY_RE.test(dish)) meals.push("lunch");
  }
  rec.mealTags = meals;

  // --- Appliance ---
  const appliance = [];
  if (rec.method === "crockpot") appliance.push("slowcooker");
  if (!dessert && rec.method !== "crockpot") {
    // Strip wok dishes (stir-fries, fried rice/noodles) so they don't count as fried.
    const fryDish = dish.replace(/stir-?fr(y|ied)|fried rice|fried noodles?/g, " ");
    if (FRYABLE_RE.test(fryDish)) appliance.push("airfryer");
  }
  rec.applianceTags = appliance;

  // --- Diets ---
  const diets = [];
  if (MED_SUBS.has(rec.subId)) diets.push("mediterranean");
  if (rec.vegetarian && !DAIRY_EGG.has(rec.protein)) {
    if (!dessert && !NONVEGAN_RE.test(arom)) diets.push("vegan");
    else if (dessert && VEGAN_SWEET_RE.test(text)) diets.push("vegan");
  }
  if (!dessert && !CARB_PROTEINS.has(rec.protein) && !KETO_BLOCK_RE.test(dish)) diets.push("keto");
  if (!GLUTEN_DISH_RE.test(dish) && !GLUTEN_STAPLE_RE.test(staple)) diets.push("glutenfree");
  rec.dietTags = diets;

  // --- Seasons ---
  const seasons = [];
  if (rec.method === "grill" || /salad|ceviche|gazpacho|papaya|fattoush|tabbouleh|elote|skewer|kebab|kabob|poke|tartare|aguachile/.test(dish) ||
      (dessert && /ice cream|sorbet|mango|berry|coconut|sago|bingsu|float|fruit|lime|açaí|acai|popsicle|granita|paleta|sundae/.test(text))) seasons.push("summer");
  if (rec.method === "crockpot" || rec.method === "oven" ||
      /stew|braise|roast|soup|chowder|gratin|tagine|goulash|curry|gumbo|pot pie|casserole|hot pot|cassoulet|ragu|ragù|bourguignon|sauerbraten|étouffée|etouffee/.test(dish) ||
      (dessert && /apple|pumpkin|spice|cinnamon|chestnut|\bfig\b|caramel|pecan|maple/.test(text))) seasons.push("fall");
  if (/roast|casserole|gratin|cornbread|stuffing|pot pie|brined|glazed turkey/.test(dish) ||
      (dessert && /pecan|pumpkin|apple|caramel|tres leches|bread pudding|cobbler|sweet potato|cranberry/.test(text))) seasons.push("thanksgiving");
  if (rec.styleLabel === "Holiday" || /\bham\b|goose|prime rib|wellington|festive/.test(dish) ||
      (dessert && /panettone|lebkuchen|king cake|gingerbread|stollen|black forest|yule|melomakarona|turrón|turron|doberge|kataifi|fruitcake|cookie|peppermint|eggnog|honey|cinnamon|chebakia/.test(text))) seasons.push("christmas");
  if (rec.protein === "Lamb" || /\blamb\b|\bham\b|brunch|asparagus|spring|deviled|quiche|frittata/.test(dish) ||
      (dessert && /carrot|lemon|coconut|ricotta|hot cross|simnel|paska|babka|honey|cheesecake/.test(text))) seasons.push("easter");
  rec.seasonTags = seasons;
}


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
            applyTags(recipe);
            RECIPES.push(recipe);
            SUB_INDEX[sub.id].recipes.push(recipe);
            CUISINE_INDEX[cuisine.id].recipes.push(recipe);
          }
        }
      }
      // Desserts: every traditional dessert gets each dessert variant.
      for (const dessert of sub.desserts) {
        for (const variant of DESSERT_VARIANTS) {
          const seed = hashStr(sub.id + "|dessert|" + dessert + "|" + variant.id);
          const r = rng(seed);
          const time = rint(r, variant.time[0], variant.time[1]);
          const recipe = {
            id: RECIPES.length,
            name: `${variant.label} ${dessert}`,
            cuisineId: cuisine.id,
            subId: sub.id,
            cuisineName: cuisine.name,
            subName: sub.name,
            flag: sub.flag,
            dish: dessert, protein: null,
            course: "dessert",
            styleLabel: variant.label,
            method: variant.method,
            time,
            servings: rint(r, 4, 12),
            difficulty: variant.method === "chilled" ? 1 : rint(r, 1, 3),
            vegetarian: true,
            aromatic: pick(r, sub.sweet),
            staple: pick(r, sub.sweet),
            seed
          };
          applyTags(recipe);
          RECIPES.push(recipe);
          SUB_INDEX[sub.id].recipes.push(recipe);
          CUISINE_INDEX[cuisine.id].recipes.push(recipe);
        }
      }
    }
  }
})();

/* ---------- Top-nav: Categories, Ingredients Hub, Seasonal Hubs ---------- */
const NAV = [
  { label: "Categories", items: [
    { label: "Breakfast Recipes", type: "meal", id: "breakfast" },
    { label: "Lunch Recipes", type: "meal", id: "lunch" },
    { label: "Dinner Recipes", type: "meal", id: "dinner" },
    { label: "Dessert Recipes", type: "course", id: "dessert" },
    { label: "Slow Cooker Recipes", type: "appliance", id: "slowcooker" },
    { label: "Air Fryer Recipes", type: "appliance", id: "airfryer" },
    { label: "Vegan Recipes", type: "diet", id: "vegan" },
    { label: "Keto Recipes", type: "diet", id: "keto" },
    { label: "Gluten-Free Recipes", type: "diet", id: "glutenfree" },
    { label: "Mediterranean Recipes", type: "diet", id: "mediterranean" }
  ]},
  { label: "Ingredients Hub", items: [
    { label: "Chicken Recipes", type: "ing", id: "chicken" },
    { label: "Ground Beef Recipes", type: "ing", id: "beef" },
    { label: "Salmon Recipes", type: "ing", id: "salmon" },
    { label: "Shrimp Recipes", type: "ing", id: "shrimp" },
    { label: "Potato Recipes", type: "ing", id: "potato" },
    { label: "Rice Recipes", type: "ing", id: "rice" },
    { label: "Pasta Recipes", type: "ing", id: "pasta" }
  ]},
  { label: "Seasonal Hubs", items: [
    { label: "Summer Recipes", type: "season", id: "summer" },
    { label: "Fall Recipes", type: "season", id: "fall" },
    { label: "Thanksgiving Recipes", type: "season", id: "thanksgiving" },
    { label: "Christmas Recipes", type: "season", id: "christmas" },
    { label: "Easter Recipes", type: "season", id: "easter" }
  ]}
];

function tagMatch(rec, type, id) {
  switch (type) {
    case "course": return rec.course === id;
    case "meal": return rec.mealTags.includes(id);
    case "appliance": return rec.applianceTags.includes(id);
    case "diet": return rec.dietTags.includes(id);
    case "ing": return rec.ingredientTags.includes(id);
    case "season": return rec.seasonTags.includes(id);
    default: return false;
  }
}

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

const SWEET_PANTRY = ["all-purpose flour", "granulated sugar", "unsalted butter", "large eggs", "whole milk or cream", "a pinch of salt"];
const SWEET_FINISHERS = ["a dusting of powdered sugar", "fresh fruit or berries", "toasted nuts", "a drizzle of syrup or honey", "whipped cream", "a scoop of ice cream"];

function buildDessertDetail(rec) {
  const r = rng(rec.seed ^ 0x9e3779b9);
  const ingredients = [
    `${rint(r, 1, 2)} cup${r() > 0.5 ? "s" : ""} ${SWEET_PANTRY[0]} (or the traditional base for ${rec.dish.toLowerCase()})`,
    `${rint(r, 1, 2)}/2 cup ${SWEET_PANTRY[1]}`,
    `${rint(r, 4, 8)} tbsp ${SWEET_PANTRY[2]}`,
    `${rint(r, 2, 4)} ${SWEET_PANTRY[3]}`,
    `1 cup ${SWEET_PANTRY[4]}`,
    `${SWEET_PANTRY[5]}`,
    `Signature flavor: ${rec.aromatic}`,
    `${pick(r, SWEET_FINISHERS)}, to serve`
  ];
  let steps;
  if (rec.method === "chilled") {
    steps = [
      `Whisk together the base ingredients with the ${rec.aromatic} until smooth.`,
      `Assemble in the traditional shape of ${rec.dish.toLowerCase()} — layered, molded, or portioned into cups.`,
      `Cover and chill for at least 2 hours (or overnight) until fully set.`,
      `Just before serving, add the finishing touch and a little extra ${rec.aromatic}.`,
      `Serve cold — this one is even better made a day ahead.`
    ];
  } else if (rec.method === "stovetop") {
    steps = [
      `Combine the base ingredients in a saucepan or skillet with the ${rec.aromatic}.`,
      `Cook over medium heat, stirring often, until thickened, golden, or cooked through as ${rec.dish.toLowerCase()} requires.`,
      `Work quickly to shape or portion while warm.`,
      `Finish with the topping and serve within ${rec.time} minutes of starting — this is the fast version.`
    ];
  } else {
    steps = [
      `Preheat the oven to ${pick(r, [325, 350, 375])}°F (${pick(r, [165, 175, 190])}°C). Prepare your pan${rec.styleLabel === "Mini" ? "s — use a muffin tin or small ramekins for individual portions" : ""}.`,
      `Cream the butter and sugar, then beat in the eggs. Fold in the dry ingredients and the ${rec.aromatic}.`,
      `Assemble in the traditional style of ${rec.dish.toLowerCase()}.`,
      `Bake for ${rec.time - 15}–${rec.time - 5} minutes, until set and fragrant.`,
      `Cool before finishing with the topping${rec.styleLabel === "Holiday" ? " — decorate generously, this is the celebration version" : ""}.`,
      `Serve and enjoy.`
    ];
  }
  return { ingredients, steps };
}

function buildRecipeDetail(rec) {
  if (rec.course === "dessert") return buildDessertDetail(rec);
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
let state = { scope: null, page: 0, search: "", quick: null, nav: null };

const $ = (id) => document.getElementById(id);
const columnsEl = $("cuisineColumns");
const browserEl = $("browser");
const gridEl = $("recipeGrid");
const mainNav = $("mainNav");

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
        <button class="col-desserts" data-desserts="${c.id}">🍰 ${CUISINE_INDEX[c.id].recipes.filter((x) => x.course === "dessert").length} ${c.name} desserts</button>
        <button class="col-all" data-cuisine="${c.id}">View all ${total.toLocaleString()} ${c.name} recipes →</button>
      </div>`;
  }).join("");
}

/* ---------- Recipe scope resolution ---------- */
function currentRecipes() {
  let list;
  if (state.nav) list = RECIPES.filter((x) => tagMatch(x, state.nav.type, state.nav.id));
  else if (state.quick === "quick30") list = RECIPES.filter((x) => x.time <= 30 && x.course !== "dessert");
  else if (state.quick === "crockpot") list = RECIPES.filter((x) => x.method === "crockpot");
  else if (state.quick === "desserts") list = RECIPES.filter((x) => x.course === "dessert");
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
  if ($("filterDessert").checked) list = list.filter((x) => x.course === "dessert");

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
  else if (state.nav) { title = state.nav.label; sub = state.nav.sub || ""; }
  else if (state.quick === "quick30") { title = "⏱️ 30-Minute Meals"; sub = "On the table in half an hour or less."; }
  else if (state.quick === "crockpot") { title = "🍲 Crock Pot Meals"; sub = "Set it in the morning, eat well tonight."; }
  else if (state.quick === "desserts") { title = "🍰 Desserts"; sub = "Traditional sweets from every cuisine."; }
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
          ${x.course === "dessert" ? '<span class="badge badge-dessert">🍰 Dessert</span>' : ""}
          ${x.time <= 30 ? '<span class="badge badge-quick">⏱️ 30 min</span>' : ""}
          ${x.method === "crockpot" ? '<span class="badge badge-crock">🍲 Crock Pot</span>' : ""}
          ${x.vegetarian && x.course !== "dessert" ? '<span class="badge badge-veg">🥦 Veg</span>' : ""}
        </div>
      </div>
      <h3>${x.name}</h3>
      <p class="card-meta">${x.subName} · ${fmtTime(x.time)} · ${DIFF[x.difficulty]} · Serves ${x.servings}</p>
      <p class="card-flavor">${x.course === "dessert" ? `A traditional sweet with ${x.aromatic}.` : `Featuring ${x.aromatic}, served with ${x.staple}.`}</p>
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
  state = { scope: null, page: 0, search: "", quick: null, nav: null };
  closeNavMenus();
  $("searchInput").value = "";
  $("filter30").checked = $("filterCrock").checked = $("filterVeg").checked = $("filterDessert").checked = false;
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
      <span>${rec.method === "crockpot" ? "🍲 Crock pot" : rec.method === "grill" ? "🔥 Grill" : rec.method === "oven" ? "♨️ Oven" : rec.method === "chilled" ? "🧊 Chilled" : "🍳 Stovetop"}</span>
      ${rec.course === "dessert" ? "<span>🍰 Dessert</span>" : rec.vegetarian ? "<span>🥦 Vegetarian</span>" : ""}
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

/* ---------- Top nav rendering & handlers ---------- */
function closeNavMenus() {
  mainNav.querySelectorAll(".nav-group.open").forEach((g) => g.classList.remove("open"));
}
function renderNav() {
  const home = `<button class="nav-home" data-home="1">🏠 Home</button>`;
  const groups = NAV.map((g, gi) => `
    <div class="nav-group">
      <button class="nav-trigger" data-group="${gi}">${g.label} <span class="caret">▾</span></button>
      <div class="nav-menu">
        ${g.items.map((it) => {
          const count = RECIPES.filter((x) => tagMatch(x, it.type, it.id)).length;
          return `<button class="nav-item" data-type="${it.type}" data-id="${it.id}" data-label="${it.label}">
            ${it.label} <span class="nav-count">${count.toLocaleString()}</span></button>`;
        }).join("")}
      </div>
    </div>`).join("");
  mainNav.innerHTML = home + groups;
}
renderNav();

mainNav.addEventListener("click", (e) => {
  const trigger = e.target.closest(".nav-trigger");
  const item = e.target.closest(".nav-item");
  const home = e.target.closest("[data-home]");
  if (home) { goHome(); return; }
  if (trigger) {
    const group = trigger.parentElement;
    const wasOpen = group.classList.contains("open");
    closeNavMenus();
    if (!wasOpen) group.classList.add("open");
    e.stopPropagation();
    return;
  }
  if (item) {
    state = { scope: null, page: 0, search: "", quick: null,
      nav: { type: item.dataset.type, id: item.dataset.id, label: item.dataset.label } };
    $("searchInput").value = "";
    $("filter30").checked = $("filterCrock").checked = $("filterVeg").checked = $("filterDessert").checked = false;
    closeNavMenus();
    renderBrowser();
  }
});
document.addEventListener("click", (e) => { if (!e.target.closest(".nav-group")) closeNavMenus(); });

/* ---------- Wire up events ---------- */
renderColumns();
$("totalCount").textContent = `${RECIPES.length.toLocaleString()} recipes`;
$("heroCount").textContent = RECIPES.length.toLocaleString();

columnsEl.addEventListener("click", (e) => {
  const subBtn = e.target.closest("[data-sub]");
  const dessertBtn = e.target.closest("[data-desserts]");
  const allBtn = e.target.closest("[data-cuisine]");
  if (subBtn) { state = { ...state, nav: null, scope: { type: "sub", id: subBtn.dataset.sub }, quick: null, page: 0 }; renderBrowser(); }
  else if (dessertBtn) {
    state = { ...state, nav: null, scope: { type: "cuisine", id: dessertBtn.dataset.desserts }, quick: null, page: 0 };
    $("filterDessert").checked = true;
    renderBrowser();
  }
  else if (allBtn) { state = { ...state, nav: null, scope: { type: "cuisine", id: allBtn.dataset.cuisine }, quick: null, page: 0 }; renderBrowser(); }
});

document.querySelectorAll("[data-quick]").forEach((b) =>
  b.addEventListener("click", () => { state = { scope: null, page: 0, search: "", quick: b.dataset.quick, nav: null }; renderBrowser(); }));

$("backBtn").addEventListener("click", goHome);
$("brandHome").addEventListener("click", (e) => { e.preventDefault(); goHome(); });

let searchTimer;
$("searchInput").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = e.target.value.trim();
    state.page = 0;
    if (state.search) renderBrowser();
    else if (!state.scope && !state.quick && !state.nav) goHome();
    else renderBrowser();
  }, 200);
});

["filter30", "filterCrock", "filterVeg", "filterDessert", "sortSelect"].forEach((id) =>
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
