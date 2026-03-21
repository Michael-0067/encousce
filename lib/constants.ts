export const SETTINGS = ["MODERN", "FANTASY", "HISTORICAL"] as const;
export type Setting = typeof SETTINGS[number];

export const SETTING_LABELS: Record<string, string> = {
  MODERN: "Modern",
  FANTASY: "Fantasy",
  HISTORICAL: "Historical",
};

// Primary archetypes — stored as primaryType in DB, used for scene matching
export const LEAD_TYPES = [
  "DOMINANT",
  "PROTECTIVE",
  "MYSTERIOUS",
  "CHARMING",
  "PLAYFUL",
  "STOIC",
  "DANGEROUS",
  "GENTLE",
  "CONFIDENT",
  "GUARDED",
] as const;
export type LeadType = typeof LEAD_TYPES[number];

export const LEAD_TYPE_LABELS: Record<string, string> = {
  DOMINANT:    "Dominant",
  PROTECTIVE:  "Protective",
  MYSTERIOUS:  "Mysterious",
  CHARMING:    "Charming",
  PLAYFUL:     "Playful",
  STOIC:       "Stoic",
  DANGEROUS:   "Dangerous",
  GENTLE:      "Gentle",
  CONFIDENT:   "Confident",
  GUARDED:     "Guarded",
};

export const CONTENT_TIERS = ["SYSTEM", "FEATURED", "COMMUNITY"] as const;
export type ContentTier = typeof CONTENT_TIERS[number];

export const TIER_LABELS: Record<string, string> = {
  SYSTEM: "Curated",
  FEATURED: "Featured",
  COMMUNITY: "Community",
};

// ── Character creator dropdowns ─────────────────────────────────────────────

export const VISUAL_SEX = ["Male", "Female", "Unspecified"] as const;

export const GENDER_EXPRESSION = [
  "Masculine",
  "Feminine",
  "Androgynous",
  "Nonbinary",
  "Unspecified",
] as const;

export const RACE_ETHNICITY = [
  "Black / African",
  "East Asian",
  "South Asian",
  "Southeast Asian",
  "Middle Eastern",
  "Latino / Hispanic",
  "White / European",
  "Mixed / Multiracial",
  "Unspecified",
] as const;

export const APPARENT_AGE = ["20s", "30s", "40s", "50+"] as const;

export const BUILD = ["Slim", "Lean", "Athletic", "Muscular", "Broad", "Soft"] as const;

export const PRESENCE = [
  "Controlled",
  "Commanding",
  "Relaxed",
  "Intense",
  "Elegant",
  "Quiet",
] as const;

export const HAIR_STYLE = [
  "Short",
  "Long",
  "Curly",
  "Straight",
  "Wavy",
  "Shaved",
  "Bald",
] as const;

export const HAIR_COLOR = [
  "Black",
  "Dark Brown",
  "Brown",
  "Auburn",
  "Red",
  "Blonde",
  "Silver",
  "White",
  "Grey",
] as const;

export const EYE_COLOR = [
  "Brown",
  "Dark Brown",
  "Blue",
  "Green",
  "Grey",
  "Hazel",
  "Amber",
] as const;

export const SECONDARY_TRAITS = [
  "Perceptive",
  "Teasing",
  "Intense",
  "Warm",
  "Reserved",
  "Witty",
] as const;

export const INTERACTION_STYLES = [
  "Leads the interaction",
  "Challenges the user",
  "Draws the user in slowly",
  "Observes before responding",
  "Engages directly",
  "Teases and provokes",
  "Keeps distance at first",
  "Warm and open",
] as const;

export const DIALOGUE_TONES = [
  "Measured and controlled",
  "Low and deliberate",
  "Teasing and playful",
  "Warm and direct",
  "Formal but intimate",
  "Dry and restrained",
  "Soft and careful",
  "Sharp and confident",
] as const;

export const EMOTIONAL_STARTING_STATES = [
  "Already intrigued",
  "Calm and assessing",
  "Guarded but interested",
  "Slightly amused",
  "Quietly affected",
  "Focused and composed",
  "Curious and attentive",
] as const;

// ── Scene creator dropdowns ──────────────────────────────────────────────────

export const SUB_LOCATIONS: Record<string, string[]> = {
  MODERN: [
    "Luxury Hotel Suite",
    "Private Residence",
    "Executive Office",
    "Fine Dining Restaurant",
    "Bar / Lounge",
    "Airport / Transit Space",
  ],
  HISTORICAL: [
    "Manor Room",
    "Tavern / Inn",
    "Ballroom",
    "Study / Private Office",
    "Carriage / Cabin",
    "Garden / Courtyard",
  ],
  FANTASY: [
    "Castle Chamber",
    "Throne Room",
    "Tavern / Hall",
    "Forest Clearing",
    "War Tent",
    "Magical Study",
  ],
};

export const TIME_OF_DAY = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
  "Late Night",
] as const;

export const LIGHTING = [
  "Soft natural light",
  "Warm ambient",
  "Dim / low-lit",
  "Bright / clean",
  "Candlelit",
  "Golden hour",
  "Neon / artificial",
] as const;

export const ATMOSPHERE = [
  "Calm",
  "Intimate",
  "Tense",
  "Quiet",
  "Lively",
  "Luxurious",
  "Isolated",
  "Charged",
] as const;

export const RELATIONSHIP_DYNAMICS = [
  "Professional equals",
  "Lead holds authority",
  "User holds authority",
  "Strangers",
  "Distant acquaintances",
  "Rivals",
  "Forced proximity",
  "Returning connection",
] as const;

export const LEAD_INTENTS = [
  "Wanted to see the user",
  "Curious about the user",
  "Testing the user",
  "Needed privacy",
  "Reluctant but present",
  "Drawn in despite themselves",
  "Has something to say",
] as const;

export const EMOTIONAL_TONES = [
  "Controlled tension",
  "Quiet intimacy",
  "Charged and uncertain",
  "Playful tension",
  "Slow-burn curiosity",
  "Guarded restraint",
  "Immediate pull",
] as const;

export const ENCOUNTER_GOALS = [
  "Build quiet tension",
  "Create immediate chemistry",
  "Slow emotional pull",
  "Test boundaries",
  "Develop trust",
  "Rekindle something",
  "Keep things controlled but charged",
] as const;

// Hearts economy
export const CHARS_PER_HEART = 1000; // 1000 characters = 1 Heart = $0.01
export const CHARACTER_GENERATION_COST = 5; // Hearts to generate a character
export const SCENE_GENERATION_COST = 5; // Hearts to generate a scene
