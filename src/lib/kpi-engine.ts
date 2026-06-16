import { KpiCalculationType, EmployeeKpiItem } from "@prisma/client";

/**
 * Calculates the score for a single KPI item based on its calculation type.
 * @param type The type of KPI calculation
 * @param target The target value
 * @param actual The actual achieved value
 * @param weight The weight of the indicator (0-100)
 * @returns The calculated score (out of 100), or null if inputs are invalid/missing
 */
export function calculateKpiScore(
  type: KpiCalculationType,
  target: number | null | undefined,
  actual: number | null | undefined,
  weight: number = 100
): number | null {
  if (actual === null || actual === undefined) return null;

  let rawScore = 0;

  switch (type) {
    case "HIGHER_BETTER":
      if (!target || target === 0) return 0; // Avoid division by zero
      rawScore = (actual / target) * 100;
      break;

    case "LOWER_BETTER":
      if (!target || target === 0) return 0;
      // If actual is 0 and target > 0, it's perfect (100% or more depending on logic).
      // standard logic: score = (target / actual) * 100.
      // If actual = 0, score = 100% (or capped at max). Let's use 100% if actual <= 0 and lower is better.
      if (actual <= 0) {
        rawScore = 100;
      } else {
        // Varian: 200 - (actual/target)*100
        // e.g. target 10, actual 5 -> 200 - (5/10)*100 = 150
        // target 10, actual 10 -> 200 - 100 = 100
        // target 10, actual 20 -> 200 - 200 = 0
        rawScore = Math.max(0, 200 - (actual / target) * 100);
      }
      break;

    case "PERCENTAGE":
      rawScore = actual; // Actual is already a percentage (e.g. 85 for 85%)
      break;

    case "BOOLEAN":
      rawScore = actual > 0 ? 100 : 0;
      break;

    case "MANUAL_SCORE":
      rawScore = actual;
      break;

    default:
      return 0;
  }

  // Cap raw score at 120% to prevent extreme outliers skewing the total
  const cappedScore = Math.min(120, Math.max(0, rawScore));

  // Return weighted score (e.g., if weight is 20%, max contribution is 24)
  return Number(((cappedScore * weight) / 100).toFixed(2));
}

/**
 * Calculates the final score for an assignment given its items, category weights, and penalties.
 */
export function calculateFinalScore(
  items: {
    actual: number | null;
    target: number;
    indicator: {
      type: KpiCalculationType;
      weight: number;
      category: { weight: number };
    };
  }[],
  totalPenaltyScore: number = 0
): number {
  let totalScore = 0;

  for (const item of items) {
    if (item.actual === null || item.actual === undefined) continue;

    // 1. Calculate the raw score out of 100 for this indicator
    const rawScore = calculateKpiScore(
      item.indicator.type,
      item.target,
      item.actual,
      100 // raw score out of 100
    );

    if (rawScore !== null) {
      // 2. Apply indicator weight (relative to category) and category weight (relative to template)
      // Example: rawScore = 80, indWeight = 50%, catWeight = 40%
      // Final contribution = 80 * 0.5 * 0.4 = 16
      const indWeight = Number(item.indicator.weight) / 100;
      const catWeight = Number(item.indicator.category.weight) / 100;

      totalScore += rawScore * indWeight * catWeight;
    }
  }

  const finalScore = totalScore - totalPenaltyScore;
  return Number(Math.max(0, finalScore).toFixed(2));
}
