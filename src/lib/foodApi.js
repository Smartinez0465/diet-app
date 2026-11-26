// Open Food Facts is free, no API key required, and supports barcode + text search.
const SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const BARCODE_URL = "https://world.openfoodfacts.org/api/v2/product";

export async function searchFoods(query) {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "20"
  });

  const res = await fetch(`${SEARCH_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Food search failed (${res.status})`);
  const data = await res.json();

  // Drop products with no usable calorie data so they can't be logged as 0 kcal.
  // A declared 0 (water, diet soda) is real data and stays.
  return (data.products || [])
    .filter((p) => p.product_name && p.nutriments)
    .map((p) => normalizeProduct(p))
    .filter((f) => f.caloriesPer100g !== null);
}

export async function getFoodByBarcode(barcode) {
  const res = await fetch(`${BARCODE_URL}/${encodeURIComponent(barcode)}.json`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== 1) return null;
  const food = normalizeProduct(data.product);
  return food.caloriesPer100g !== null ? food : null;
}

// Open Food Facts values can be numbers, numeric strings, blank or absent.
function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

// kcal per 100 g, or null when the product has no usable energy data.
function energyKcal(n, macroKcal) {
  // Fall back to kJ (1 kcal = 4.184 kJ) when kcal is missing.
  const kj = toNumber(n["energy_100g"]);
  const kcal = toNumber(n["energy-kcal_100g"]) ?? (kj === null ? null : kj / 4.184);
  if (kcal === null) return null;
  // 0 kcal next to real macros is bad data, not a zero-calorie food.
  if (kcal === 0 && macroKcal > 5) return null;
  return Math.round(kcal);
}

function normalizeProduct(p) {
  const n = p.nutriments || {};
  // Macros stay unrounded; AddFoodScreen rounds after scaling by grams.
  const protein = toNumber(n["proteins_100g"]) ?? 0;
  const carbs = toNumber(n["carbohydrates_100g"]) ?? 0;
  const fat = toNumber(n["fat_100g"]) ?? 0;
  return {
    id: p.code || p._id || p.id,
    name: String(p.product_name).trim().replace(/\s+/g, " "),
    brand: p.brands || "",
    caloriesPer100g: energyKcal(n, protein * 4 + carbs * 4 + fat * 9),
    proteinPer100g: protein,
    carbsPer100g: carbs,
    fatPer100g: fat
  };
}
