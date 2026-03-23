export const propertyTypes = [
  { key: "house", label: "House", icon: "🏠" },
  { key: "condo", label: "Condo", icon: "🏢" },
  { key: "townhouse", label: "Townhouse", icon: "🏘️" },
  { key: "apartment", label: "Apartment", icon: "🏬" },
] as const;

export const homeAgeOptions = [
  { label: "New (0-5 yrs)", value: 2 },
  { label: "6-15 yrs", value: 10 },
  { label: "16-30 yrs", value: 23 },
  { label: "30+ yrs", value: 40 },
];

export const sqftOptions = [
  { label: "Under 1,000", value: 800 },
  { label: "1,000-1,500", value: 1250 },
  { label: "1,500-2,500", value: 2000 },
  { label: "2,500-4,000", value: 3250 },
  { label: "4,000+", value: 5000 },
];

export const systems = [
  { key: "central_ac", label: "Central AC", icon: "❄️" },
  { key: "forced_air_heat", label: "Forced Air Heat", icon: "🔥" },
  { key: "radiant_heat", label: "Radiant Heat", icon: "♨️" },
  { key: "fireplace", label: "Fireplace / Wood Stove", icon: "🪵" },
  { key: "basement", label: "Basement", icon: "🏗️" },
  { key: "crawl_space", label: "Crawl Space", icon: "🔦" },
  { key: "sprinkler", label: "Sprinkler System", icon: "💦" },
  { key: "pool", label: "Pool", icon: "🏊" },
  { key: "hot_tub", label: "Hot Tub", icon: "🛁" },
  { key: "solar_panels", label: "Solar Panels", icon: "☀️" },
  { key: "septic", label: "Septic System", icon: "🚰" },
  { key: "well_water", label: "Well Water", icon: "🪣" },
];
