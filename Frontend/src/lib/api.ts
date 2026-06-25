export const API_BASE = "http://localhost:8000";

export type ScoreColor = "red" | "amber" | "green";
export type ItemStatus = "critical" | "low" | "healthy";

export interface FarmSummary {
  id: string;
  name: string;
  farmer_name: string;
  location: string;
  crop: string;
  area_acres: number;
  soil_type?: string;
  health_score: number;
  score_color: ScoreColor | "amber";
  status_label: string;
  deficiency_count: number;
}

export interface ScoreBreakdownItem {
  group: string;
  pts_earned: number;
  max_pts: number;
  status: ItemStatus;
  actual: number;
  baseline: number;
}

export interface Recommendation {
  deficiency: string;
  severity: "critical" | "low";
  product: string;
  microbial: string;
  dose: string;
  timing: string;
  cost_per_acre: number;
  total_cost_inr: number;
  note: string;
  mechanism: string;
}

export interface SeasonalPoint {
  season: string;
  score: number;
  type: "actual" | "projected";
  note?: string;
}

export interface TopFactor {
  factor: string;
  impact: number;
  direction: "positive" | "negative";
}

export interface HarvestFeedbackInput {
  farm_id: string;
  yield_kg_per_acre: number;
  followed_recommendation: boolean;
  farmer_rating: number;
  notes: string;
}

export interface HarvestFeedbackResponse {
  success: boolean;
  message: string;
  feedback_stored: {
    farm_id: string;
    farm_name: string;
    farmer_name: string;
    location: string;
    crop: string;
    season: string;
    health_score_at_time: number;
    deficiencies_at_time: string[];
    recommendations_given: string[];
    yield_kg_per_acre: number;
    followed_recommendation: boolean;
    farmer_rating: number;
    notes: string;
  };
  model_impact: {
    your_data_contributes_to: string;
    next_training_cycle: string;
    projected_score_next_season: number;
    projected_score_improvement: string;
    network_effect: string;
    retraining_note: string;
  };
}

export interface FarmDetail extends FarmSummary {
  season?: string;
  deficiency_keys: string[];
  score_breakdown: ScoreBreakdownItem[];
  recommendations: Recommendation[];
  chemical_products: string;
  chemical_total_inr: number;
  biofert_total_inr: number;
  saving_inr: number;
  saving_pct: number;
  per_acre_saving_inr: number;
  seasonal_trend: SeasonalPoint[];
  top_factors: TopFactor[];
}

export function colorForScore(score: number): ScoreColor {
  if (score >= 70) return "green";
  if (score >= 50) return "amber";
  return "red";
}

export const HEX: Record<ScoreColor, string> = {
  red: "#EF4444",
  amber: "#F59E0B",
  green: "#4EA72E",
};

export const STATUS_HEX: Record<ItemStatus, string> = {
  critical: "#EF4444",
  low: "#F59E0B",
  healthy: "#4EA72E",
};

/* ---- Normalizers: map raw backend JSON into our typed shapes safely ---- */

const num = (v: unknown, fallback = 0): number => {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? (n as number) : fallback;
};

const str = (v: unknown, fallback = ""): string => (v == null ? fallback : String(v));

/** Always returns an array, never crashes if the field is an object/null/undefined. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asArray = (v: unknown): any[] => (Array.isArray(v) ? v : []);

function normalizeStatus(v: unknown, actual = 0, baseline = 0): ItemStatus {
  const s = str(v).toLowerCase();
  if (s === "critical" || s === "low" || s === "healthy") return s as ItemStatus;
  if (baseline > 0) {
    const ratio = actual / baseline;
    if (ratio < 0.4) return "critical";
    if (ratio < 0.85) return "low";
  }
  return "healthy";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSummary(raw: any): FarmSummary {
  const score = num(raw?.health_score);
  return {
    id: str(raw?.id),
    name: str(raw?.name, "Unnamed Farm"),
    farmer_name: str(raw?.farmer_name),
    location: str(raw?.location),
    crop: str(raw?.crop),
    area_acres: num(raw?.area_acres),
    soil_type: raw?.soil_type ? str(raw.soil_type) : undefined,
    health_score: score,
    score_color: (str(raw?.score_color) || colorForScore(score)) as ScoreColor,
    status_label: str(raw?.status_label, "—"),
    deficiency_count: num(raw?.deficiency_count ?? asArray(raw?.deficiency_keys).length),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeBreakdown(raw: any): ScoreBreakdownItem {
  const actual = num(raw?.actual ?? raw?.value);
  const baseline = num(raw?.baseline ?? raw?.expected);
  return {
    group: str(raw?.group ?? raw?.name ?? raw?.label, "—"),
    pts_earned: num(raw?.pts_earned ?? raw?.points ?? raw?.earned),
    max_pts: num(raw?.max_pts ?? raw?.max_points ?? raw?.max, 20),
    status: normalizeStatus(raw?.status, actual, baseline),
    actual,
    baseline,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeRecommendation(raw: any): Recommendation {
  const sev = str(raw?.severity).toLowerCase();
  return {
    deficiency: str(raw?.deficiency ?? raw?.group ?? raw?.key, "—"),
    severity: sev === "critical" ? "critical" : "low",
    product: str(raw?.product ?? raw?.product_name, "—"),
    microbial: str(raw?.microbial ?? raw?.organism ?? raw?.microbe),
    dose: str(raw?.dose ?? raw?.dosage),
    timing: str(raw?.timing ?? raw?.when),
    cost_per_acre: num(raw?.cost_per_acre ?? raw?.cost_per_acre_inr),
    total_cost_inr: num(raw?.total_cost_inr ?? raw?.total_cost),
    note: str(raw?.note ?? raw?.notes),
    mechanism: str(raw?.mechanism ?? raw?.how_it_works),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeFactor(raw: any): TopFactor {
  const impact = num(raw?.impact ?? raw?.value ?? raw?.shap);
  const dir = str(raw?.direction).toLowerCase();
  const direction: "positive" | "negative" =
    dir === "positive" || dir === "negative"
      ? (dir as "positive" | "negative")
      : impact >= 0
        ? "positive"
        : "negative";
  return {
    factor: str(raw?.factor ?? raw?.name ?? raw?.feature, "—"),
    impact,
    direction,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeTrend(raw: any): SeasonalPoint {
  const type = str(raw?.type).toLowerCase() === "projected" ? "projected" : "actual";
  return {
    season: str(raw?.season ?? raw?.label ?? raw?.period, "—"),
    score: num(raw?.score ?? raw?.value),
    type,
    note: raw?.note ? str(raw.note) : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDetail(raw: any): FarmDetail {
  const summary = normalizeSummary(raw);
  const deficiency_keys = asArray(raw?.deficiency_keys).map((k) => str(k));
  const cost = raw?.cost_summary ?? {};

  const chemical_total_inr = num(cost.chemical_total_inr ?? cost.chemical_total ?? cost.chemical);
  const biofert_total_inr = num(
    cost.biofert_total_inr ?? cost.biofertilizer_total_inr ?? cost.biofert_total,
  );
  const saving_inr = num(
    cost.saving_inr ?? cost.savings_inr ?? chemical_total_inr - biofert_total_inr,
  );
  const saving_pct = num(
    cost.saving_pct ??
      cost.savings_pct ??
      (chemical_total_inr > 0 ? Math.round((saving_inr / chemical_total_inr) * 100) : 0),
  );
  const acres = summary.area_acres > 0 ? summary.area_acres : 1;
  const per_acre_saving_inr = num(
    cost.per_acre_saving_inr ?? cost.saving_per_acre_inr ?? saving_inr / acres,
  );

  return {
    ...summary,
    season: raw?.season ? str(raw.season) : undefined,
    deficiency_keys,
    deficiency_count: num(raw?.deficiency_count ?? deficiency_keys.length),
    score_breakdown: asArray(raw?.score_breakdown).map(normalizeBreakdown),
    recommendations: asArray(raw?.recommendations).map(normalizeRecommendation),
    top_factors: asArray(raw?.top_factors).map(normalizeFactor),
    seasonal_trend: asArray(raw?.seasonal_trend).map(normalizeTrend),
    chemical_products: str(
      cost.chemical_products ?? cost.products ?? "Chemical inputs",
      "Chemical inputs",
    ),
    chemical_total_inr,
    biofert_total_inr,
    saving_inr,
    saving_pct,
    per_acre_saving_inr,
  };
}

export async function fetchFarms(): Promise<FarmSummary[]> {
  const res = await fetch(`${API_BASE}/farms`);
  if (!res.ok) throw new Error(`Failed to load farms: ${res.status}`);
  const json = await res.json();
  // Backend returns { total, farms: [...] }; also tolerate a bare array.
  const list = Array.isArray(json) ? json : asArray(json?.farms);
  return list.map(normalizeSummary);
}

export async function fetchFarm(id: string): Promise<FarmDetail> {
  const res = await fetch(`${API_BASE}/farm/${id}`);
  if (!res.ok) throw new Error(`Failed to load farm: ${res.status}`);
  const json = await res.json();
  return normalizeDetail(json);
}

export async function submitHarvestFeedback(
  feedback: HarvestFeedbackInput,
): Promise<HarvestFeedbackResponse> {
  const params = new URLSearchParams({
    yield_kg_per_acre: String(feedback.yield_kg_per_acre),
    followed_recommendation: String(feedback.followed_recommendation),
    farmer_rating: String(feedback.farmer_rating),
    notes: feedback.notes,
  });
  const res = await fetch(`${API_BASE}/farm/${feedback.farm_id}/feedback?${params}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to submit feedback: ${res.status}`);
  return res.json();
}

/* ---- Fallback demo data (used when backend is unreachable) ---- */

export const FALLBACK_FARMS: FarmSummary[] = [
  {
    id: "farm_001",
    name: "Ravi Kumar's Tomato Farm",
    farmer_name: "Ravi Kumar",
    location: "Dindigul, Tamil Nadu",
    crop: "Tomato",
    area_acres: 2,
    soil_type: "Red Loam",
    health_score: 61.3,
    score_color: "amber",
    status_label: "Needs Attention",
    deficiency_count: 3,
  },
  {
    id: "farm_002",
    name: "Lakshmi's Paddy Field",
    farmer_name: "Lakshmi Devi",
    location: "Thanjavur, Tamil Nadu",
    crop: "Rice",
    area_acres: 4.5,
    soil_type: "Alluvial",
    health_score: 78.5,
    score_color: "green",
    status_label: "Healthy",
    deficiency_count: 0,
  },
  {
    id: "farm_003",
    name: "Arjun's Cotton Plot",
    farmer_name: "Arjun Patel",
    location: "Warangal, Telangana",
    crop: "Cotton",
    area_acres: 6,
    soil_type: "Black Cotton",
    health_score: 42.1,
    score_color: "red",
    status_label: "Critical",
    deficiency_count: 5,
  },
];

export const FALLBACK_FARM: FarmDetail = {
  ...FALLBACK_FARMS[0],
  season: "Kharif '25",
  deficiency_keys: ["Nitrogen Fixers", "Phosphate Solubilizers", "Decomposers"],
  score_breakdown: [
    {
      group: "Nitrogen Fixers",
      pts_earned: 8,
      max_pts: 20,
      status: "critical",
      actual: 1.2,
      baseline: 4.5,
    },
    {
      group: "Phosphate Solubilizers",
      pts_earned: 11,
      max_pts: 20,
      status: "low",
      actual: 2.8,
      baseline: 5.0,
    },
    {
      group: "Mycorrhizal Fungi",
      pts_earned: 18,
      max_pts: 20,
      status: "healthy",
      actual: 6.1,
      baseline: 6.0,
    },
    {
      group: "Decomposers",
      pts_earned: 12,
      max_pts: 20,
      status: "low",
      actual: 3.4,
      baseline: 5.5,
    },
    {
      group: "Plant Growth Promoters",
      pts_earned: 12.3,
      max_pts: 20,
      status: "low",
      actual: 3.0,
      baseline: 4.8,
    },
  ],
  recommendations: [
    {
      deficiency: "Nitrogen Fixers",
      severity: "critical",
      product: "Azospirillum Bio-Inoculant",
      microbial: "Azospirillum brasilense",
      dose: "2 kg per acre",
      timing: "At sowing / transplanting",
      cost_per_acre: 250,
      total_cost_inr: 500,
      note: "Mix with farmyard manure before application.",
      mechanism:
        "Fixes atmospheric nitrogen in the root zone, reducing urea dependency and improving early vigour.",
    },
    {
      deficiency: "Phosphate Solubilizers",
      severity: "low",
      product: "PSB Granules",
      microbial: "Bacillus megaterium",
      dose: "4 kg per acre",
      timing: "Within 15 days of transplanting",
      cost_per_acre: 180,
      total_cost_inr: 360,
      note: "Apply to moist soil, avoid direct sunlight.",
      mechanism:
        "Solubilizes locked soil phosphorus into plant-available form, boosting root and flower development.",
    },
    {
      deficiency: "Decomposers",
      severity: "low",
      product: "Trichoderma Compost Mix",
      microbial: "Trichoderma viride",
      dose: "2.5 kg per acre",
      timing: "During land preparation",
      cost_per_acre: 200,
      total_cost_inr: 400,
      note: "Combine with crop residue for faster breakdown.",
      mechanism:
        "Accelerates organic matter decomposition and suppresses soil-borne pathogens around the root zone.",
    },
  ],
  chemical_products: "Urea, DAP, Complex NPK 19:19:19",
  chemical_total_inr: 8400,
  biofert_total_inr: 1260,
  saving_inr: 7140,
  saving_pct: 85,
  per_acre_saving_inr: 3570,
  seasonal_trend: [
    { season: "Kharif '24", score: 48, type: "actual" },
    { season: "Rabi '24", score: 53, type: "actual" },
    { season: "Summer '25", score: 57, type: "actual" },
    { season: "Kharif '25", score: 61.3, type: "actual" },
    {
      season: "Rabi '25",
      score: 74,
      type: "projected",
      note: "Projected score if recommended biofertilizers are applied this season.",
    },
  ],
  top_factors: [
    { factor: "Low Nitrogen Fixers", impact: -9.2, direction: "negative" },
    { factor: "Healthy Mycorrhizae", impact: 6.8, direction: "positive" },
    { factor: "Weak Phosphate Solubilizers", impact: -5.4, direction: "negative" },
    { factor: "Good Soil Moisture", impact: 4.1, direction: "positive" },
    { factor: "Low Decomposer Activity", impact: -3.3, direction: "negative" },
  ],
};
