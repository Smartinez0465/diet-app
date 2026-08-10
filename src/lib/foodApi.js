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
  const data = await res.json();

  return (data.products || [])
    .filter((p) => p.product_name && p.nutriments)
    .map((p) => normalizeProduct(p));
}

export async function getFoodByBarcode(barcode) {
  const res = await fetch(`${BARCODE_URL}/${barcode}.json`);
  const data = await res.json();
  if (data.status !== 1) return null;
  return normalizeProduct(data.product);
}

function normalizeProduct(p) {
  const n = p.nutriments || {};
  return {
    id: p.code || p._id || p.id,
    name: p.product_name,
    brand: p.brands || "",
    caloriesPer100g: Math.round(n["energy-kcal_100g"] || 0),
    proteinPer100g: Math.round(n["proteins_100g"] || 0),
    carbsPer100g: Math.round(n["carbohydrates_100g"] || 0),
    fatPer100g: Math.round(n["fat_100g"] || 0)
  };
}
