// Fuel efficiency calculation with guards
// Formula: (distance * fuelPricePerLitre) / cost
export function computeFuelEfficiency(
  distance?: number,
  cost?: number,
  fuelPricePerLitre?: number
): number | undefined {
  // Check for null/undefined values
  if (!distance || !cost || !fuelPricePerLitre) {
    return undefined;
  }
  
  // Check for zero values to avoid division errors
  if (distance <= 0 || cost <= 0 || fuelPricePerLitre <= 0) {
    return undefined;
  }
  
  // Calculate fuel efficiency and round to 2 decimal places
  const efficiency = (distance * fuelPricePerLitre) / cost;
  return Math.round(efficiency * 100) / 100;
}
