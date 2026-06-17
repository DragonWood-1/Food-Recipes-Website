# Global Kitchen — Food Recipes Website

A fast, dependency-free recipe website with **6,900+ recipes** organized into
seven cuisine columns, plus dedicated collections for **30-minute meals**,
**crock pot meals**, and **desserts**.

## Cuisine columns

| Column | Sub-cuisines |
| --- | --- |
| 🥢 Asian | Chinese, Japanese, Korean, Thai, Vietnamese, Indian |
| 🍷 European | French, Italian, Spanish, Greek, German |
| 🌶️ Latin American | Mexican, Brazilian, Peruvian |
| 🫒 Middle Eastern & African | Lebanese, Turkish, North African (Moroccan) |
| 🏮 Regional Chinese | Sichuan, Cantonese, Hunan |
| 🪔 Regional Indian | North, South, East, and West Indian |
| 🇺🇸 Regional American | Tex-Mex, Cajun/Creole, Pacific Northwestern |

## Features

- **6,900+ recipes** generated deterministically from per-cuisine dish
  templates (`data.js`), so the site stays a few hundred KB instead of
  shipping a multi-megabyte database.
- **⏱️ 30-Minute Meals** — 1,500+ recipes ready in half an hour or less.
- **🍲 Crock Pot Meals** — 1,100+ slow-cooker recipes.
- **🍰 Desserts** — 1,080 traditional sweets, 40 from each of the 27
  sub-cuisines (gulab jamun, tiramisu, knafeh, mochi, beignets, marionberry
  cobbler…), each in Classic, 30-Minute, Make-Ahead, Mini, and Holiday
  versions.
- Search across all recipes, plus filters for quick meals, crock pot,
  and vegetarian, with sorting by name, time, or difficulty.
- Full recipe detail view with ingredients and step-by-step instructions
  tailored to the cooking method (stovetop, oven, grill, or crock pot).
- Responsive layout — columns collapse gracefully on mobile.

## Browse hubs (top navigation)

Beyond cuisine, every recipe is cross-tagged so the same library can be
browsed three more ways from the top nav:

- **Categories** — Breakfast, Lunch, Dinner, Dessert, Slow Cooker, Air Fryer,
  Vegan, Keto, Gluten-Free, Mediterranean.
- **Ingredients Hub** — Chicken, Ground Beef, Salmon, Shrimp, Potato, Rice, Pasta.
- **Seasonal Hubs** — Summer, Fall, Thanksgiving, Christmas, Easter.

Tags are derived in `app.js` (`applyTags`) from each recipe's dish, protein,
cooking method, and flavors, so every menu item routes to a live, filtered
result set with its own count.

## Running locally

It's a static site — no build step. Either open `index.html` directly, or:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
index.html   # page shell: header, hero, cuisine columns, browser, modal
styles.css   # all styling
data.js      # cuisine/sub-cuisine definitions and dish templates
app.js       # deterministic recipe generator + UI logic
```
