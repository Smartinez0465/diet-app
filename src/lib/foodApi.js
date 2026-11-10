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
  return (data.products || [])
    .filter((p) => p.product_name && p.nutriments)
    .map((p) => normalizeProduct(p))
    .filter((f) => f.caloriesPer100g > 0);
}

export async function getFoodByBarcode(barcode) {
  const res = await fetch(`${BARCODE_URL}/${encodeURIComponent(barcode)}.json`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== 1) return null;
  const food = normalizeProduct(data.product);
  return food.caloriesPer100g > 0 ? food : null;
}

function normalizeProduct(p) {
  const n = p.nutriments || {};
  // Fall back to kJ (1 kcal = 4.184 kJ) when kcal is missing.
  const kcal = n["energy-kcal_100g"] ?? (n["energy_100g"] ? n["energy_100g"] / 4.184 : 0);
  return {
    id: p.code || p._id || p.id,
    name: String(p.product_name).trim().replace(/\s+/g, " "),
    brand: p.brands || "",
    caloriesPer100g: Math.round(Number(kcal) || 0),
    proteinPer100g: Math.round(n["proteins_100g"] || 0),
    carbsPer100g: Math.round(n["carbohydrates_100g"] || 0),
    fatPer100g: Math.round(n["fat_100g"] || 0)
  };
}
