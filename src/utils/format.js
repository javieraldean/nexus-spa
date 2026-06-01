/**
 * Formatea un valor numérico como moneda en euros con 2 decimales.
 * Ejemplo: formatPrice(29.9) → "€29.90"
 */
export function formatPrice(value) {
  const n = Number(value);
  if (isNaN(n)) return "€0.00";
  return `€${n.toFixed(2)}`;
}
