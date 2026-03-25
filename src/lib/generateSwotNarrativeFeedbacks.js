/**
 * Builds four coaching-style paragraphs from SWOT questionnaire answers (Yes / No / Unsure).
 * Questions are grouped into four sequential bands (quarters of the assessment) so each
 * feedback reflects that slice of the business topics you ask about.
 */

function classifySelected(raw) {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (s === "yes") return "yes";
  if (s === "no") return "no";
  if (s === "unsure" || s === "not sure") return "unsure";
  return "missing";
}

function bucketBounds(total) {
  if (total <= 0) return [];
  const size = Math.ceil(total / 4);
  return [
    { start: 0, end: Math.min(size, total) },
    { start: Math.min(size, total), end: Math.min(size * 2, total) },
    { start: Math.min(size * 2, total), end: Math.min(size * 3, total) },
    { start: Math.min(size * 3, total), end: total },
  ];
}

function bucketStats(profile, start, end) {
  let yes = 0;
  let no = 0;
  let unsure = 0;
  let missing = 0;
  for (let i = start; i < end; i++) {
    const c = classifySelected(profile[i]?.selected);
    if (c === "yes") yes++;
    else if (c === "no") no++;
    else if (c === "unsure") unsure++;
    else missing++;
  }
  const answered = yes + no + unsure;
  const total = end - start;
  const yesRatio = answered ? yes / answered : 0;
  const unsureRatio = answered ? unsure / answered : 0;
  const missingRatio = total ? missing / total : 0;
  return { yes, no, unsure, missing, answered, total, yesRatio, unsureRatio, missingRatio };
}

function pickTier(stats) {
  if (stats.answered === 0) return "empty";
  if (stats.unsureRatio >= 0.45 && stats.unsure >= stats.yes && stats.unsure >= stats.no) {
    return "unsure";
  }
  if (stats.yesRatio >= 0.52) return "high";
  if (stats.yesRatio <= 0.28) return "low";
  return "mid";
}

const THEMES = [
  {
    name: "foundation",
    high:
      "Across the early themes in your assessment—structure, financial visibility, and how clearly the business is organized—you answered “Yes” frequently. That pattern suggests you value clarity, repeatable ways of working, and knowing where the business stands. Your practical strengths show up in how you approach accountability, cash and planning basics, and turning intent into something the team can execute.",
    mid: "On foundational topics—how the business is structured, how money flows, and how clearly roles and plans are defined—your answers mix “Yes,” “No,” and “Unsure.” That usually means some pillars are solid while others still need definition or consistency. The opportunity is to tighten a few core systems (visibility, cadence, and documentation) so decisions get easier and the team spends less time guessing.",
    low: "On the foundational slice of this questionnaire, “No” and “Unsure” showed up more often than “Yes.” That is not unusual for growing businesses; it usually signals that structure, financial clarity, or standard ways of working are still catching up to the pace of the operation. Prioritize a short list of basics—who owns what, what good looks like, and what numbers you review weekly—so the business can scale without constant firefighting.",
    unsure:
      "On foundational areas, “Unsure” was a strong pattern. That often reflects limited visibility into processes, numbers, or ownership—not a lack of care. Make it a priority to shine light on a few key questions (cash, roles, and top metrics) so you can answer confidently next time and steer with facts instead of assumptions.",
    empty:
      "We did not have enough answered items in this portion of the assessment to profile your operational foundation. Complete the full questionnaire next time for a sharper read on structure, cash, and clarity.",
  },
  {
    name: "growth",
    high:
      "In the growth- and strategy-oriented portion of your answers, “Yes” responses were common. That points to an orientation toward expansion, innovation, and improving how you compete—whether through planning, new markets, products, or technology. You appear willing to invest attention in what comes next, not only what is working today.",
    mid: "Where the questions turn toward growth—markets, offerings, R&D, and modernization—your responses were mixed. You likely have real wins in some areas while others are still aspirational or inconsistent. The most productive path is to sequence a few bold moves: pick one growth lever, define a 90-day outcome, and align resources so progress is visible.",
    low: "On growth-related topics, “No” and “Unsure” dominated relative to “Yes.” That can mean the business is intentionally focused elsewhere, or that growth activities have not yet been formalized. Either way, there is room to choose one concrete growth experiment (segment, channel, or offer) and run it with a clear metric so momentum becomes easier to repeat.",
    unsure:
      "On growth questions, many “Unsure” answers suggest opportunities are not yet fully visible on paper—even if activity is happening informally. Capture what you are already testing, pick one priority horizon (e.g. next two quarters), and translate it into a simple plan the team can track.",
    empty:
      "We did not have enough responses in this segment to summarize your growth and strategy posture. Finishing every question will produce a clearer narrative here.",
  },
  {
    name: "people",
    high:
      "On people, culture, and customer-facing capabilities, your “Yes” answers were frequent. That pattern aligns with attention to talent, retention, communication tools, and how customers experience your brand. Strengths here compound: engaged teams and clear customer touchpoints usually show up in repeat business and smoother delivery.",
    mid: "Across people- and customer-centric items, your answers were split. You may excel in some human or service dimensions while others (onboarding, feedback loops, or retention programs) are still maturing. Pick one people priority and one customer journey moment to improve; small upgrades there often lift both morale and revenue.",
    low: "In this portion—team practices, communication, CRM, and customer experience—“No” and “Unsure” appeared more than “Yes.” That often correlates with growth stretching people systems faster than they were designed for. Focus on fundamentals: clear expectations, simple tools for collaboration, and a repeatable way to hear and act on customer input.",
    unsure:
      "Here, “Unsure” suggests some people and customer practices may exist informally or vary by individual. Standardizing one or two rituals—how you onboard, how you collect feedback, how you recognize good work—can turn ambiguity into leverage without heavy bureaucracy.",
    empty:
      "Not enough data in this band to describe people and customer dynamics. Complete the questionnaire for a fuller picture.",
  },
  {
    name: "resilience",
    high:
      "On external risk, compliance, and resilience topics, “Yes” showed up often. That indicates awareness of threats and preparedness—insurance, continuity, cybersecurity, supply chain, and the wider environment. Businesses that score here tend to absorb shocks better and recover faster when conditions shift.",
    mid: "Your answers on risk and the external environment were mixed. Some safeguards are likely in place; others may need review or documentation. Use a simple risk register: top five exposures, owner, and next action date—so nothing important depends on memory alone.",
    low: "On resilience-oriented questions, “No” and “Unsure” were more common. That is a prompt to close gaps before they become expensive: continuity, coverage, cyber hygiene, and monitoring competitive or regulatory change. Even lean teams can make meaningful progress with a short quarterly risk review.",
    unsure:
      "Frequent “Unsure” on risk items usually means exposure is unclear rather than absent. Schedule a focused review with your advisors or leadership team to convert “don’t know” into documented decisions and owners.",
    empty:
      "Insufficient answers in this segment to summarize resilience and external risk. Complete all items for targeted feedback here.",
  },
];

function paragraphForBucket(bucketIndex, stats) {
  const theme = THEMES[bucketIndex] || THEMES[0];
  const tier = pickTier(stats);
  if (tier === "empty" || stats.total === 0) return theme.empty;
  let body = theme.mid;
  if (tier === "high") body = theme.high;
  else if (tier === "low") body = theme.low;
  else if (tier === "unsure") body = theme.unsure;

  if (stats.missingRatio > 0.2 && stats.answered > 0) {
    body += ` Note: part of this section had no recorded answer; completing those items will sharpen this summary.`;
  }
  return body;
}

/**
 * @param {Record<number, { selected?: string }>} answers - state keyed by question index
 * @param {number} totalQuestions
 * @returns {{ feedback1: string, feedback2: string, feedback3: string, feedback4: string, swotifyResultsJson: string }}
 */
export function buildNarrativeFeedbacksFromAnswers(answers, totalQuestions) {
  const profile = Array.from({ length: totalQuestions }, (_, i) => answers[i] ?? null);
  const bounds = bucketBounds(totalQuestions);
  const keys = ["feedback1", "feedback2", "feedback3", "feedback4"];

  const parts = {};
  for (let b = 0; b < 4; b++) {
    const { start, end } = bounds[b] || { start: 0, end: 0 };
    const stats = bucketStats(profile, start, end);
    const text = paragraphForBucket(b, stats);
    parts[keys[b]] = `Feedback ${b + 1}: ${text}`;
  }

  const swotifyResultsJson = [
    parts.feedback1,
    parts.feedback2,
    parts.feedback3,
    parts.feedback4,
  ].join("\n\n");

  return { ...parts, swotifyResultsJson };
}
