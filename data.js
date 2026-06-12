/* =========================================================================
   Global Kitchen — cuisine & dish template data
   Recipes are generated deterministically in app.js from these templates:
   each sub-cuisine defines base dishes and variation axes, and the
   combinations yield 5,000+ unique recipes site-wide.
   ========================================================================= */

const CUISINE_DATA = [
  {
    id: "asian",
    name: "Asian",
    icon: "🥢",
    color: "#c0392b",
    blurb: "Chinese, Japanese, Korean, Thai, Vietnamese, and Indian classics.",
    subcuisines: [
      {
        id: "chinese", name: "Chinese", flag: "🇨🇳",
        dishes: ["Fried Rice", "Lo Mein", "Sweet and Sour Stir-Fry", "Dumplings", "Egg Drop Soup", "Kung Pao Stir-Fry", "Spring Rolls", "Char Siu", "Congee", "Hot Pot", "Scallion Pancakes", "Chow Fun", "General Tso's", "Wonton Soup"],
        proteins: ["Chicken", "Pork", "Beef", "Shrimp", "Tofu", "Duck", "Mushroom", "Vegetable"],
        aromatics: ["ginger and garlic", "scallion and white pepper", "five-spice", "black bean sauce", "oyster sauce glaze"],
        staples: ["jasmine rice", "egg noodles", "rice noodles", "steamed buns"]
      },
      {
        id: "japanese", name: "Japanese", flag: "🇯🇵",
        dishes: ["Teriyaki", "Ramen", "Udon", "Donburi Rice Bowl", "Katsu", "Yakisoba", "Miso Soup", "Onigiri", "Gyoza", "Tempura", "Okonomiyaki", "Sushi Rolls", "Curry Rice", "Yakitori"],
        proteins: ["Chicken", "Salmon", "Pork", "Beef", "Tofu", "Shrimp", "Eggplant", "Mushroom"],
        aromatics: ["soy-mirin glaze", "miso butter", "sesame ginger", "ponzu citrus", "shichimi spice"],
        staples: ["short-grain rice", "udon noodles", "soba noodles", "panko crust"]
      },
      {
        id: "korean", name: "Korean", flag: "🇰🇷",
        dishes: ["Bibimbap", "Bulgogi", "Kimchi Fried Rice", "Japchae", "Tteokbokki", "Kimchi Jjigae", "Galbi", "Korean Fried Chicken", "Sundubu Jjigae", "Kimbap", "Dakgalbi", "Pajeon"],
        proteins: ["Beef", "Pork", "Chicken", "Tofu", "Shrimp", "Mushroom", "Vegetable"],
        aromatics: ["gochujang glaze", "gochugaru and sesame", "soy-garlic", "doenjang broth", "ginger-scallion"],
        staples: ["short-grain rice", "glass noodles", "rice cakes", "perilla leaves"]
      },
      {
        id: "thai", name: "Thai", flag: "🇹🇭",
        dishes: ["Pad Thai", "Green Curry", "Red Curry", "Tom Yum Soup", "Basil Stir-Fry (Pad Krapow)", "Massaman Curry", "Papaya Salad", "Tom Kha Soup", "Drunken Noodles", "Larb", "Satay", "Panang Curry"],
        proteins: ["Chicken", "Shrimp", "Beef", "Tofu", "Pork", "Duck", "Vegetable"],
        aromatics: ["lemongrass and galangal", "Thai basil and chili", "tamarind-fish sauce", "coconut and kaffir lime", "roasted chili jam"],
        staples: ["jasmine rice", "rice noodles", "sticky rice", "coconut rice"]
      },
      {
        id: "vietnamese", name: "Vietnamese", flag: "🇻🇳",
        dishes: ["Pho", "Banh Mi", "Bun (Vermicelli Bowl)", "Spring Rolls (Goi Cuon)", "Caramelized Clay Pot", "Lemongrass Grill", "Com Tam (Broken Rice)", "Banh Xeo", "Cha Gio", "Bo Kho Stew", "Ga Roti", "Canh Chua Soup"],
        proteins: ["Beef", "Chicken", "Pork", "Shrimp", "Tofu", "Fish", "Vegetable"],
        aromatics: ["fish sauce caramel", "lemongrass-chili", "nuoc cham dressing", "star anise broth", "pickled daikon and herbs"],
        staples: ["rice noodles", "broken rice", "baguette", "rice paper"]
      },
      {
        id: "indian", name: "Indian", flag: "🇮🇳",
        dishes: ["Tikka Masala", "Korma", "Vindaloo", "Biryani", "Dal Tadka", "Saag", "Butter Masala", "Jalfrezi", "Samosas", "Chana Masala", "Tandoori Grill", "Kofta Curry"],
        proteins: ["Chicken", "Lamb", "Paneer", "Chickpea", "Vegetable", "Shrimp", "Lentil"],
        aromatics: ["garam masala", "cumin-coriander-turmeric", "ginger-garlic paste", "curry leaf tempering", "kashmiri chili"],
        staples: ["basmati rice", "naan", "roti", "saffron rice"]
      }
    ]
  },
  {
    id: "european",
    name: "European",
    icon: "🍷",
    color: "#2e6b9e",
    blurb: "French, Italian, Spanish, Greek, and German favorites.",
    subcuisines: [
      {
        id: "french", name: "French", flag: "🇫🇷",
        dishes: ["Coq au Vin", "Ratatouille", "Quiche", "Bourguignon", "Cassoulet", "Provençal Roast", "French Onion Soup", "Crêpes", "Niçoise Salad", "Gratin", "Blanquette", "Steak Frites"],
        proteins: ["Chicken", "Beef", "Duck", "Salmon", "Pork", "Mushroom", "Vegetable"],
        aromatics: ["herbes de Provence", "white wine and shallot", "dijon-tarragon", "garlic-thyme butter", "red wine reduction"],
        staples: ["baguette", "buttered potatoes", "haricots verts", "crusty bread"]
      },
      {
        id: "italian", name: "Italian", flag: "🇮🇹",
        dishes: ["Pasta Pomodoro", "Risotto", "Lasagna", "Piccata", "Parmigiana", "Osso Buco", "Minestrone", "Gnocchi", "Carbonara", "Cacciatore", "Bruschetta Platter", "Polenta Bake", "Marsala", "Arrabbiata"],
        proteins: ["Chicken", "Beef", "Pork", "Shrimp", "Eggplant", "Mushroom", "Sausage", "Vegetable"],
        aromatics: ["basil and san marzano tomato", "garlic and olive oil", "lemon-caper", "rosemary-balsamic", "parmesan cream"],
        staples: ["spaghetti", "penne", "arborio rice", "ciabatta"]
      },
      {
        id: "spanish", name: "Spanish", flag: "🇪🇸",
        dishes: ["Paella", "Tortilla Española", "Gambas al Ajillo", "Patatas Bravas", "Albondigas", "Gazpacho", "Pisto", "Fabada Stew", "Pollo al Ajillo", "Empanadas", "Croquetas", "Romesco Grill"],
        proteins: ["Chicken", "Shrimp", "Chorizo", "Pork", "Mussels", "Vegetable", "White Bean"],
        aromatics: ["smoked paprika and saffron", "garlic and sherry", "romesco pepper", "olive and tomato sofrito", "manchego and herbs"],
        staples: ["bomba rice", "crusty bread", "fried potatoes", "saffron rice"]
      },
      {
        id: "greek", name: "Greek", flag: "🇬🇷",
        dishes: ["Souvlaki", "Moussaka", "Gyro Platter", "Spanakopita", "Avgolemono Soup", "Greek Salad Bowl", "Pastitsio", "Lemon Roast", "Dolmades", "Briam", "Keftedes", "Fasolada"],
        proteins: ["Chicken", "Lamb", "Pork", "Feta", "Chickpea", "Eggplant", "White Bean"],
        aromatics: ["lemon-oregano", "garlic-yogurt tzatziki", "dill and mint", "kalamata olive and tomato", "cinnamon-spiced tomato"],
        staples: ["pita bread", "lemon potatoes", "orzo", "rice pilaf"]
      },
      {
        id: "german", name: "German", flag: "🇩🇪",
        dishes: ["Schnitzel", "Bratwurst Skillet", "Sauerbraten", "Spätzle", "Rouladen", "Kartoffelsuppe", "Jägerschnitzel", "Currywurst", "Goulash", "Käsespätzle", "Frikadellen", "Sauerkraut Bake"],
        proteins: ["Pork", "Chicken", "Beef", "Sausage", "Mushroom", "Vegetable"],
        aromatics: ["mustard and caraway", "mushroom-cream", "onion gravy", "apple and sauerkraut", "paprika-marjoram"],
        staples: ["spätzle", "boiled potatoes", "rye bread", "potato dumplings"]
      }
    ]
  },
  {
    id: "latin",
    name: "Latin American",
    icon: "🌶️",
    color: "#27ae60",
    blurb: "Highlighted by Mexican, Brazilian, and Peruvian cooking.",
    subcuisines: [
      {
        id: "mexican", name: "Mexican", flag: "🇲🇽",
        dishes: ["Tacos", "Enchiladas", "Fajitas", "Quesadillas", "Pozole", "Tamales", "Chilaquiles", "Burrito Bowl", "Tostadas", "Mole", "Carnitas", "Elote Bowl", "Tinga", "Sopes"],
        proteins: ["Chicken", "Beef", "Pork", "Shrimp", "Black Bean", "Vegetable", "Chorizo", "Fish"],
        aromatics: ["chipotle-adobo", "salsa verde", "ancho chili and cumin", "lime-cilantro", "roasted tomato salsa roja"],
        staples: ["corn tortillas", "flour tortillas", "cilantro-lime rice", "refried beans"]
      },
      {
        id: "brazilian", name: "Brazilian", flag: "🇧🇷",
        dishes: ["Feijoada", "Moqueca", "Stroganoff Brasileiro", "Churrasco Grill", "Coxinha", "Escondidinho", "Galinhada", "Farofa Bowl", "Bobó", "Picadinho", "Pão de Queijo Plate", "Vatapá"],
        proteins: ["Beef", "Chicken", "Pork", "Shrimp", "Black Bean", "Fish", "Vegetable"],
        aromatics: ["coconut-dendê", "lime and garlic marinade", "malagueta pepper", "tomato-palm oil", "smoky black bean"],
        staples: ["white rice", "farofa", "cassava", "collard greens"]
      },
      {
        id: "peruvian", name: "Peruvian", flag: "🇵🇪",
        dishes: ["Lomo Saltado", "Ceviche", "Aji de Gallina", "Arroz con Pollo", "Pollo a la Brasa", "Causa", "Anticuchos", "Tacu Tacu", "Seco", "Papa a la Huancaína", "Chaufa Fried Rice", "Sopa Criolla"],
        proteins: ["Beef", "Chicken", "Fish", "Shrimp", "Potato", "Quinoa", "Vegetable"],
        aromatics: ["aji amarillo", "aji panca and garlic", "leche de tigre citrus", "huacatay herb sauce", "red onion and lime"],
        staples: ["white rice", "quinoa", "yellow potatoes", "choclo corn"]
      }
    ]
  },
  {
    id: "mea",
    name: "Middle Eastern & African",
    icon: "🫒",
    color: "#b9770e",
    blurb: "Lebanese, Turkish, and North African (Moroccan) traditions.",
    subcuisines: [
      {
        id: "lebanese", name: "Lebanese", flag: "🇱🇧",
        dishes: ["Shawarma", "Kafta", "Mujadara", "Fattoush Bowl", "Hummus Platter", "Kibbeh", "Shish Tawook", "Stuffed Grape Leaves", "Fatteh", "Manakish", "Lentil Soup (Shorbat Adas)", "Batata Harra"],
        proteins: ["Chicken", "Lamb", "Beef", "Chickpea", "Lentil", "Halloumi", "Vegetable"],
        aromatics: ["sumac and za'atar", "garlic toum", "tahini-lemon", "seven-spice (baharat)", "pomegranate molasses"],
        staples: ["pita bread", "vermicelli rice", "bulgur", "tabbouleh"]
      },
      {
        id: "turkish", name: "Turkish", flag: "🇹🇷",
        dishes: ["Kebab", "Köfte", "Pide", "Menemen", "Iskender", "Manti", "Imam Bayildi", "Lahmacun", "Güveç Stew", "Börek", "Mercimek Soup", "Pilav Bowl"],
        proteins: ["Lamb", "Beef", "Chicken", "Eggplant", "Lentil", "Feta", "Vegetable"],
        aromatics: ["aleppo pepper and yogurt", "tomato-pepper paste", "mint and sumac", "garlic-yogurt sauce", "urfa chili butter"],
        staples: ["bulgur pilaf", "flatbread", "rice pilav", "fresh simit"]
      },
      {
        id: "moroccan", name: "North African (Moroccan)", flag: "🇲🇦",
        dishes: ["Tagine", "Couscous Royale", "Harira Soup", "Kefta Tagine", "Chermoula Grill", "Bastilla", "Zaalouk", "Rfissa", "Shakshuka", "Mechoui Roast", "Loubia Stew", "Berber Omelette"],
        proteins: ["Chicken", "Lamb", "Beef", "Chickpea", "Fish", "Vegetable", "Lentil"],
        aromatics: ["ras el hanout", "preserved lemon and olive", "chermoula herbs", "cinnamon-apricot", "harissa and cumin"],
        staples: ["couscous", "khobz bread", "saffron rice", "semolina flatbread"]
      }
    ]
  },
  {
    id: "regchinese",
    name: "Regional Chinese",
    icon: "🏮",
    color: "#8e44ad",
    blurb: "Distinct regional styles: Sichuan, Cantonese, and Hunan.",
    subcuisines: [
      {
        id: "sichuan", name: "Sichuan", flag: "🌶️",
        dishes: ["Mapo Tofu", "Dan Dan Noodles", "Kung Pao", "Twice-Cooked Pork Style", "Dry-Fried Green Beans", "Shui Zhu (Water-Boiled)", "Fish-Fragrant (Yu Xiang)", "Chongqing Chicken Style", "Hot and Sour Soup", "Mala Hot Pot", "Zhong Dumplings", "Bang Bang Salad"],
        proteins: ["Pork", "Chicken", "Beef", "Tofu", "Shrimp", "Fish", "Vegetable"],
        aromatics: ["mala chili oil and peppercorn", "doubanjiang bean paste", "black vinegar and garlic", "dried chili and sesame", "pickled mustard greens"],
        staples: ["steamed rice", "wheat noodles", "sweet potato noodles", "flatbread"]
      },
      {
        id: "cantonese", name: "Cantonese", flag: "🦐",
        dishes: ["Steamed Fish Style", "Char Siu Roast", "Dim Sum Dumplings", "Clay Pot Rice", "Beef Chow Fun Style", "White Cut Chicken Style", "Stir-Fried Greens", "Wonton Noodle Soup", "Salt and Pepper Fry", "Congee", "Lemon Glazed", "Black Bean Stir-Fry"],
        proteins: ["Chicken", "Pork", "Shrimp", "Fish", "Beef", "Tofu", "Scallop"],
        aromatics: ["ginger-scallion oil", "light soy and rock sugar", "fermented black bean", "oyster sauce", "shaoxing wine glaze"],
        staples: ["jasmine rice", "ho fun noodles", "egg noodles", "rice rolls"]
      },
      {
        id: "hunan", name: "Hunan", flag: "🔥",
        dishes: ["Steamed with Chopped Chili", "Hunan Beef Style", "Smoked Bacon Stir-Fry Style", "Dry Pot (Gan Guo)", "Chairman Mao's Red-Braised Style", "Pickled Chili Stir-Fry", "Hunan Eggplant", "Fiery Tofu", "Cumin Ribs Style", "Sour Bean Mince", "Duo Jiao Fish Style", "Hand-Torn Cabbage"],
        proteins: ["Pork", "Beef", "Chicken", "Fish", "Tofu", "Eggplant", "Vegetable"],
        aromatics: ["fresh and pickled chili (duo jiao)", "smoked chili and garlic", "fermented black bean and chili", "chili-cumin crust", "sour pickled long beans"],
        staples: ["steamed rice", "rice noodles", "scallion flatbread", "sticky rice"]
      }
    ]
  },
  {
    id: "regindian",
    name: "Regional Indian",
    icon: "🪔",
    color: "#d35400",
    blurb: "North, South, East, and West Indian traditions — each with distinct spices and staples.",
    subcuisines: [
      {
        id: "northindian", name: "North Indian", flag: "🏔️",
        dishes: ["Butter Masala", "Rogan Josh", "Dal Makhani", "Chole", "Paneer Tikka", "Rajma", "Tandoori Grill", "Korma", "Aloo Gobi", "Palak Paneer Style", "Kadhai Stir-Fry", "Amritsari Fry"],
        proteins: ["Chicken", "Paneer", "Lamb", "Chickpea", "Kidney Bean", "Potato", "Vegetable"],
        aromatics: ["garam masala and cream", "kasuri methi (dried fenugreek)", "ginger-garlic and tomato", "whole spice tempering", "yogurt-saffron marinade"],
        staples: ["naan", "basmati rice", "roti", "jeera rice"]
      },
      {
        id: "southindian", name: "South Indian", flag: "🥥",
        dishes: ["Dosa with Filling", "Sambar", "Chettinad Curry", "Coconut Stew (Ishtu)", "Rasam", "Uttapam", "Kerala Fry", "Hyderabadi Biryani Style", "Avial", "Pepper Fry (Milagu)", "Upma Bowl", "Curd Rice Plate"],
        proteins: ["Chicken", "Lentil", "Fish", "Shrimp", "Vegetable", "Egg", "Potato"],
        aromatics: ["curry leaf and mustard seed", "coconut and tamarind", "black pepper and fennel", "red chili and asafoetida", "roasted gun-powder spice"],
        staples: ["idli rice", "dosa", "coconut rice", "lemon rice"]
      },
      {
        id: "eastindian", name: "East Indian", flag: "🐟",
        dishes: ["Macher Jhol (Fish Curry Style)", "Shorshe (Mustard Curry)", "Kosha (Slow-Braised)", "Chingri Malai Style", "Aloo Posto", "Ghugni", "Dalma", "Jhalmuri Bowl", "Doi (Yogurt Curry)", "Labra Mixed Vegetable", "Momos", "Thukpa Noodle Soup"],
        proteins: ["Fish", "Shrimp", "Chicken", "Potato", "Chickpea", "Vegetable", "Egg"],
        aromatics: ["mustard oil and nigella (kalonji)", "panch phoron five-spice", "mustard paste and green chili", "poppy seed paste", "ginger and bay leaf"],
        staples: ["steamed rice", "luchi (fried bread)", "khichuri", "flattened rice (chira)"]
      },
      {
        id: "westindian", name: "West Indian", flag: "🌊",
        dishes: ["Goan Vindaloo Style", "Dhansak", "Pav Bhaji", "Goan Coconut Curry", "Misal", "Undhiyu", "Kolhapuri", "Dhokla Plate", "Bombay Frankie Roll", "Sol Kadhi Bowl", "Patra ni Machhi Style", "Vada Pav Plate"],
        proteins: ["Chicken", "Fish", "Shrimp", "Vegetable", "Sprouted Bean", "Potato", "Lentil"],
        aromatics: ["kokum and coconut", "goan vinegar-chili masala", "goda masala", "peanut and sesame", "green chutney and pav spice"],
        staples: ["pav bread", "steamed rice", "bhakri flatbread", "coconut rice"]
      }
    ]
  },
  {
    id: "regamerican",
    name: "Regional American",
    icon: "🇺🇸",
    color: "#16a085",
    blurb: "American sub-cuisines: Tex-Mex, Cajun/Creole, and Pacific Northwestern.",
    subcuisines: [
      {
        id: "texmex", name: "Tex-Mex", flag: "🤠",
        dishes: ["Chili con Carne", "Fajita Skillet", "Enchilada Bake", "Queso Smothered", "Crispy Tacos", "Nacho Platter", "Burrito Supreme", "King Ranch Casserole Style", "Migas", "Taco Soup", "Quesadilla Stack", "Frito Pie"],
        proteins: ["Beef", "Chicken", "Pork", "Black Bean", "Shrimp", "Chorizo", "Vegetable"],
        aromatics: ["chili powder and cumin", "smoked jalapeño", "pepper jack queso", "lime and pickled jalapeño", "fire-roasted tomato and green chile"],
        staples: ["flour tortillas", "tortilla chips", "spanish rice", "charro beans"]
      },
      {
        id: "cajun", name: "Cajun / Creole", flag: "🎷",
        dishes: ["Gumbo", "Jambalaya", "Étouffée", "Red Beans and Rice", "Blackened Skillet", "Po' Boy", "Dirty Rice", "Shrimp Creole Style", "Maque Choux", "Boudin-Style Rice", "Court Bouillon", "Cajun Pasta"],
        proteins: ["Shrimp", "Chicken", "Andouille Sausage", "Crawfish", "Catfish", "Red Bean", "Vegetable"],
        aromatics: ["cajun holy trinity (onion, celery, bell pepper)", "dark roux", "blackening spice", "creole tomato base", "hot sauce and butter"],
        staples: ["long-grain rice", "french bread", "cornbread", "grits"]
      },
      {
        id: "pnw", name: "Pacific Northwestern", flag: "🌲",
        dishes: ["Cedar-Plank Salmon Style", "Dungeness Crab Cakes Style", "Wild Mushroom Risotto", "Clam Chowder", "Hazelnut-Crusted Roast", "Berry-Glazed Grill", "Foraged Mushroom Toast", "Salmon Chowder", "Oyster Pan Roast Style", "Apple-Cider Braise", "Smoked Fish Bowl", "Marionberry Salad Plate"],
        proteins: ["Salmon", "Crab", "Halibut", "Chicken", "Mushroom", "Oyster", "Vegetable"],
        aromatics: ["hazelnut and brown butter", "marionberry glaze", "cider and sage", "dill and lemon", "smoked sea salt and fir tips"],
        staples: ["roasted fingerling potatoes", "sourdough bread", "wild rice", "grilled asparagus"]
      }
    ]
  }
];

/* Variation axes shared by the generator. Each (dish × protein × style)
   combination becomes one recipe, so per sub-cuisine:
   ~12 dishes × ~7 proteins × sampled styles ≫ 190 recipes. */
const STYLE_VARIANTS = [
  { id: "classic",  label: "Classic",            time: [35, 60],  method: "stovetop" },
  { id: "quick",    label: "30-Minute",          time: [15, 30],  method: "stovetop" },
  { id: "crockpot", label: "Slow Cooker",        time: [240, 480], method: "crockpot" },
  { id: "family",   label: "Family-Style",       time: [40, 75],  method: "oven" },
  { id: "weeknight",label: "Easy Weeknight",     time: [20, 30],  method: "stovetop" },
  { id: "spicy",    label: "Extra-Spicy",        time: [30, 55],  method: "stovetop" },
  { id: "healthy",  label: "Lighter",            time: [25, 45],  method: "stovetop" },
  { id: "grilled",  label: "Grilled",            time: [25, 50],  method: "grill" },
  { id: "onepot",   label: "One-Pot",            time: [30, 50],  method: "stovetop" },
  { id: "crockpot2",label: "Set-and-Forget Crock Pot", time: [300, 540], method: "crockpot" }
];

const VEG_PROTEINS = new Set([
  "Tofu", "Vegetable", "Mushroom", "Paneer", "Chickpea", "Lentil", "Eggplant",
  "Black Bean", "White Bean", "Kidney Bean", "Red Bean", "Potato", "Quinoa",
  "Feta", "Halloumi", "Sprouted Bean", "Egg"
]);
