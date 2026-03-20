export const SETTINGS = ["MODERN", "FANTASY", "HISTORICAL"] as const;
export type Setting = typeof SETTINGS[number];

export const LEAD_TYPES = [
  "DOMINANT",
  "MYSTERIOUS",
  "PROTECTIVE",
  "PLAYFUL",
  "SHY",
  "AUTHORITATIVE",
] as const;
export type LeadType = typeof LEAD_TYPES[number];

export const CONTENT_TIERS = ["SYSTEM", "FEATURED", "COMMUNITY"] as const;
export type ContentTier = typeof CONTENT_TIERS[number];

export const TIER_LABELS: Record<string, string> = {
  SYSTEM: "Curated",
  FEATURED: "Featured",
  COMMUNITY: "Community",
};

export const SETTING_LABELS: Record<string, string> = {
  MODERN: "Modern",
  FANTASY: "Fantasy",
  HISTORICAL: "Historical",
};

export const LEAD_TYPE_LABELS: Record<string, string> = {
  DOMINANT: "Dominant",
  MYSTERIOUS: "Mysterious",
  PROTECTIVE: "Protective",
  PLAYFUL: "Playful",
  SHY: "Shy",
  AUTHORITATIVE: "Authoritative",
};

export const CHARS_PER_HEART = 1000; // 1000 characters = 1 Heart = $0.01
