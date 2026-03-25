/** Normalize quadrant labels from data / APIs so filtering stays consistent. */
export function normalizeSwotQuadrant(raw) {
  const lower = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!lower) return "";
  if (lower === "strength" || lower === "strengths") return "Strength";
  if (lower === "weakness" || lower === "weaknesses") return "Weakness";
  if (lower === "opportunity" || lower === "opportunities") return "Opportunity";
  if (lower === "threat" || lower === "threats") return "Threat";
  return String(raw).trim();
}
