/*
 * Seed script for homebase task_templates table.
 *
 * SETUP INSTRUCTIONS:
 * -------------------
 * 1. Install the Turso CLI:
 *      curl -sSfL https://get.tur.so/install.sh | bash    (macOS/Linux)
 *      irm https://get.tur.so/install.ps1 | iex            (Windows PowerShell)
 *
 * 2. Sign up / log in:
 *      turso auth signup   OR   turso auth login
 *
 * 3. Create a database:
 *      turso db create homebase
 *
 * 4. Get the database URL:
 *      turso db show homebase --url
 *    Copy the libsql:// URL into your .env file as TURSO_DATABASE_URL.
 *
 * 5. Create an auth token:
 *      turso db tokens create homebase
 *    Copy the token into your .env file as TURSO_AUTH_TOKEN.
 *
 * 6. Run migrations:
 *      npx drizzle-kit push
 *
 * 7. Run this seed script:
 *      npx tsx src/db/seed.ts
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { taskTemplates } from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

const allPropertyTypes = ["house", "condo", "townhouse", "apartment"];
const housesOnly = ["house", "townhouse"];
const withYard = ["house", "townhouse"];

const templates: (typeof taskTemplates.$inferInsert)[] = [
  // ── SPRING (months 3-5) ──────────────────────────────────────────
  {
    title: "Clean gutters and downspouts",
    description:
      "Remove debris from gutters and flush downspouts to prevent water damage.",
    category: "exterior",
    frequency: "semi-annually",
    monthDue: 4,
    appliesTo: housesOnly,
    priority: "high",
  },
  {
    title: "Service air conditioning",
    description:
      "Schedule professional AC tune-up: clean coils, check refrigerant, replace filter.",
    category: "hvac",
    frequency: "annually",
    monthDue: 4,
    appliesTo: allPropertyTypes,
    priority: "high",
  },
  {
    title: "Power wash siding and deck",
    description:
      "Pressure wash exterior siding, deck, patio, and walkways to remove winter grime.",
    category: "exterior",
    frequency: "annually",
    monthDue: 4,
    appliesTo: housesOnly,
    priority: "medium",
  },
  {
    title: "Inspect roof for damage",
    description:
      "Check for missing/damaged shingles, flashing issues, and signs of leaks after winter.",
    category: "exterior",
    frequency: "annually",
    monthDue: 4,
    appliesTo: housesOnly,
    priority: "high",
  },
  {
    title: "Fertilize lawn (spring application)",
    description:
      "Apply spring fertilizer to promote healthy grass growth after dormancy.",
    category: "yard",
    frequency: "annually",
    monthDue: 4,
    appliesTo: withYard,
    priority: "medium",
  },
  {
    title: "Test outdoor spigots and irrigation",
    description:
      "Turn on outdoor faucets, check for leaks or freeze damage, test sprinkler system.",
    category: "plumbing",
    frequency: "annually",
    monthDue: 3,
    appliesTo: housesOnly,
    priority: "medium",
  },

  // ── SUMMER (months 6-8) ──────────────────────────────────────────
  {
    title: "Inspect and clean dryer vent",
    description:
      "Clear lint buildup from dryer vent duct and exterior flap. Fire hazard if neglected.",
    category: "appliances",
    frequency: "annually",
    monthDue: 6,
    appliesTo: allPropertyTypes,
    priority: "high",
  },
  {
    title: "Deep clean kitchen exhaust hood",
    description:
      "Remove and degrease hood filters, wipe down interior. Improves ventilation and reduces fire risk.",
    category: "appliances",
    frequency: "semi-annually",
    monthDue: 6,
    appliesTo: allPropertyTypes,
    priority: "medium",
  },
  {
    title: "Check caulking around windows and doors",
    description:
      "Inspect and replace deteriorated caulk to maintain weatherproofing and energy efficiency.",
    category: "exterior",
    frequency: "annually",
    monthDue: 7,
    appliesTo: allPropertyTypes,
    priority: "medium",
  },
  {
    title: "Inspect deck/patio for damage",
    description:
      "Check for loose boards, popped nails, rot, and re-seal or stain if needed.",
    category: "exterior",
    frequency: "annually",
    monthDue: 6,
    appliesTo: housesOnly,
    priority: "medium",
  },
  {
    title: "Trim trees and shrubs away from house",
    description:
      "Cut back branches that are within 3 feet of siding/roof to prevent damage and pest entry.",
    category: "yard",
    frequency: "annually",
    monthDue: 7,
    appliesTo: housesOnly,
    priority: "medium",
  },

  // ── FALL (months 9-11) ───────────────────────────────────────────
  {
    title: "Winterize outdoor faucets",
    description:
      "Disconnect hoses, shut off interior valves, and drain outdoor spigots to prevent freeze damage.",
    category: "plumbing",
    frequency: "annually",
    monthDue: 10,
    appliesTo: housesOnly,
    priority: "high",
  },
  {
    title: "Clean chimney and inspect flue",
    description:
      "Schedule professional chimney sweep to remove creosote buildup before heating season.",
    category: "interior",
    frequency: "annually",
    monthDue: 9,
    appliesTo: housesOnly,
    priority: "high",
    requiresFeature: "fireplace",
  },
  {
    title: "Overseed and fertilize lawn (fall)",
    description:
      "Apply fall fertilizer and overseed thin/bare spots for spring recovery.",
    category: "yard",
    frequency: "annually",
    monthDue: 9,
    appliesTo: withYard,
    priority: "medium",
  },
  {
    title: "Check weather stripping on doors",
    description:
      "Inspect and replace worn weather stripping to keep cold drafts out and reduce heating costs.",
    category: "exterior",
    frequency: "annually",
    monthDue: 10,
    appliesTo: allPropertyTypes,
    priority: "medium",
  },
  {
    title: "Schedule furnace/heating tune-up",
    description:
      "Professional HVAC service: inspect heat exchanger, clean burners, check thermostat calibration.",
    category: "hvac",
    frequency: "annually",
    monthDue: 9,
    appliesTo: allPropertyTypes,
    priority: "high",
  },
  {
    title: "Clean gutters (fall)",
    description:
      "Remove fallen leaves and debris from gutters before winter freeze.",
    category: "exterior",
    frequency: "semi-annually",
    monthDue: 11,
    appliesTo: housesOnly,
    priority: "high",
  },
  {
    title: "Drain and winterize sprinkler system",
    description:
      "Blow out irrigation lines and shut down system to prevent pipe freezing.",
    category: "yard",
    frequency: "annually",
    monthDue: 10,
    appliesTo: housesOnly,
    priority: "high",
    requiresFeature: "sprinkler",
  },

  // ── WINTER (months 12, 1-2) ──────────────────────────────────────
  {
    title: "Test smoke and CO detectors",
    description:
      "Press test button on all smoke and carbon monoxide detectors, replace batteries if needed.",
    category: "safety",
    frequency: "semi-annually",
    monthDue: 1,
    appliesTo: allPropertyTypes,
    priority: "high",
  },
  {
    title: "Inspect water heater",
    description:
      "Check for leaks, corrosion, and sediment. Flush tank to remove buildup and improve efficiency.",
    category: "plumbing",
    frequency: "annually",
    monthDue: 1,
    appliesTo: allPropertyTypes,
    priority: "medium",
  },
  {
    title: "Check for ice dams",
    description:
      "After heavy snow, inspect roof edges and gutters for ice dam formation that can cause leaks.",
    category: "exterior",
    frequency: "annually",
    monthDue: 1,
    appliesTo: housesOnly,
    priority: "high",
  },
  {
    title: "Inspect attic insulation",
    description:
      "Check insulation depth and condition, look for moisture, pests, or gaps around penetrations.",
    category: "interior",
    frequency: "annually",
    monthDue: 12,
    appliesTo: housesOnly,
    priority: "medium",
  },
  {
    title: "Check pipe insulation",
    description:
      "Verify exposed pipes in unheated areas (garage, crawlspace, attic) are properly insulated.",
    category: "plumbing",
    frequency: "annually",
    monthDue: 12,
    appliesTo: housesOnly,
    priority: "high",
  },

  // ── YEAR-ROUND / RECURRING ───────────────────────────────────────
  {
    title: "Change HVAC filters",
    description:
      "Replace or clean HVAC air filters for better air quality and system efficiency.",
    category: "hvac",
    frequency: "quarterly",
    monthDue: null,
    appliesTo: allPropertyTypes,
    priority: "high",
  },
  {
    title: "Check water softener salt level",
    description:
      "Inspect brine tank and refill salt as needed. Clean tank if salt bridge has formed.",
    category: "plumbing",
    frequency: "quarterly",
    monthDue: null,
    appliesTo: housesOnly,
    priority: "low",
    requiresFeature: "water_softener",
  },
  {
    title: "Inspect fire extinguishers",
    description:
      "Check pressure gauge is in green zone, verify inspection tag date, ensure clear access.",
    category: "safety",
    frequency: "annually",
    monthDue: 1,
    appliesTo: allPropertyTypes,
    priority: "high",
  },
  {
    title: "Test sump pump",
    description:
      "Pour water into pit to trigger pump, verify it drains correctly and check valve works.",
    category: "plumbing",
    frequency: "quarterly",
    monthDue: null,
    appliesTo: housesOnly,
    priority: "high",
  },
  {
    title: "Clean refrigerator coils",
    description:
      "Vacuum dust from condenser coils (under or behind fridge) to maintain efficiency.",
    category: "appliances",
    frequency: "semi-annually",
    monthDue: null,
    appliesTo: allPropertyTypes,
    priority: "low",
  },
  {
    title: "Test GFCI outlets",
    description:
      "Press test/reset buttons on GFCI outlets in kitchen, bathrooms, garage, and exterior.",
    category: "electrical",
    frequency: "quarterly",
    monthDue: null,
    appliesTo: allPropertyTypes,
    priority: "medium",
  },
  {
    title: "Flush water heater tank",
    description:
      "Drain several gallons to remove sediment buildup that reduces efficiency and tank life.",
    category: "plumbing",
    frequency: "annually",
    monthDue: null,
    appliesTo: allPropertyTypes,
    priority: "medium",
  },
  {
    title: "Deep clean dishwasher",
    description:
      "Clean filter, spray arms, and door gasket. Run empty cycle with dishwasher cleaner.",
    category: "appliances",
    frequency: "quarterly",
    monthDue: null,
    appliesTo: allPropertyTypes,
    priority: "low",
  },
  {
    title: "Inspect caulk in bathrooms",
    description:
      "Check and replace deteriorated caulk around tubs, showers, and sinks to prevent water damage.",
    category: "interior",
    frequency: "annually",
    monthDue: null,
    appliesTo: allPropertyTypes,
    priority: "medium",
  },
  {
    title: "Clean washing machine",
    description:
      "Run cleaning cycle or hot wash with vinegar/cleaner. Wipe door gasket to prevent mold.",
    category: "appliances",
    frequency: "quarterly",
    monthDue: null,
    appliesTo: allPropertyTypes,
    priority: "low",
  },

  // ── FEATURE-GATED TEMPLATES ─────────────────────────────────────
  {
    title: "Open and balance pool chemicals",
    description:
      "Remove pool cover, test water chemistry, and balance pH, alkalinity, and chlorine levels.",
    category: "yard",
    frequency: "annually",
    monthDue: 5,
    appliesTo: allPropertyTypes,
    priority: "high",
    requiresFeature: "pool",
  },
  {
    title: "Close and winterize pool",
    description:
      "Lower water level, add winterizing chemicals, cover pool, and disconnect pump.",
    category: "yard",
    frequency: "annually",
    monthDue: 10,
    appliesTo: allPropertyTypes,
    priority: "high",
    requiresFeature: "pool",
  },
  {
    title: "Drain and clean hot tub",
    description:
      "Drain hot tub, scrub shell, clean filters, refill and balance water chemistry.",
    category: "yard",
    frequency: "quarterly",
    monthDue: 3,
    appliesTo: allPropertyTypes,
    priority: "medium",
    requiresFeature: "hot_tub",
  },
  {
    title: "Replace hot tub filter",
    description:
      "Remove, inspect, and replace hot tub filter cartridge for proper water circulation.",
    category: "appliances",
    frequency: "quarterly",
    monthDue: 3,
    appliesTo: allPropertyTypes,
    priority: "medium",
    requiresFeature: "hot_tub",
  },
  {
    title: "Schedule septic tank pumping",
    description:
      "Have septic tank professionally pumped and inspected every 1-3 years depending on household size.",
    category: "plumbing",
    frequency: "annually",
    monthDue: 6,
    appliesTo: allPropertyTypes,
    priority: "high",
    requiresFeature: "septic",
  },
  {
    title: "Test well water quality",
    description:
      "Collect water samples and test for bacteria, nitrates, pH, and other contaminants.",
    category: "plumbing",
    frequency: "annually",
    monthDue: 3,
    appliesTo: allPropertyTypes,
    priority: "high",
    requiresFeature: "well_water",
  },
  {
    title: "Inspect fireplace gaskets and seals",
    description:
      "Check door gaskets and damper seals on fireplace or wood stove for proper draft and safety.",
    category: "interior",
    frequency: "annually",
    monthDue: 10,
    appliesTo: allPropertyTypes,
    priority: "medium",
    requiresFeature: "fireplace",
  },
  {
    title: "Clean solar panels",
    description:
      "Remove dirt, pollen, and debris from solar panels to maintain optimal energy production.",
    category: "exterior",
    frequency: "semi-annually",
    monthDue: 4,
    appliesTo: allPropertyTypes,
    priority: "medium",
    requiresFeature: "solar_panels",
  },
  {
    title: "Inspect solar inverter and connections",
    description:
      "Check inverter status lights, review energy production data, inspect wiring connections.",
    category: "electrical",
    frequency: "annually",
    monthDue: 6,
    appliesTo: allPropertyTypes,
    priority: "medium",
    requiresFeature: "solar_panels",
  },
  {
    title: "Start up and test sprinkler zones",
    description:
      "Turn on sprinkler system, test each zone, check for broken heads and leaks.",
    category: "yard",
    frequency: "annually",
    monthDue: 4,
    appliesTo: allPropertyTypes,
    priority: "medium",
    requiresFeature: "sprinkler",
  },
  {
    title: "Schedule professional AC tune-up",
    description:
      "Have HVAC technician inspect refrigerant levels, clean evaporator coils, and test thermostat.",
    category: "hvac",
    frequency: "annually",
    monthDue: 4,
    appliesTo: allPropertyTypes,
    priority: "high",
    requiresFeature: "central_ac",
  },
  {
    title: "Bleed radiant heat system",
    description:
      "Release trapped air from radiant heating lines to restore even heat distribution.",
    category: "hvac",
    frequency: "annually",
    monthDue: 10,
    appliesTo: allPropertyTypes,
    priority: "medium",
    requiresFeature: "radiant_heat",
  },
  {
    title: "Inspect basement for moisture and cracks",
    description:
      "Check basement walls and floor for new cracks, water stains, or signs of moisture intrusion.",
    category: "interior",
    frequency: "semi-annually",
    monthDue: 4,
    appliesTo: allPropertyTypes,
    priority: "medium",
    requiresFeature: "basement",
  },
  {
    title: "Inspect crawl space moisture barrier",
    description:
      "Check vapor barrier for tears or displacement, look for standing water or pest activity.",
    category: "interior",
    frequency: "annually",
    monthDue: 4,
    appliesTo: allPropertyTypes,
    priority: "high",
    requiresFeature: "crawl_space",
  },
];

async function seed() {
  console.log("Seeding task_templates...");
  console.log(`Inserting ${templates.length} templates...`);

  for (const template of templates) {
    await db.insert(taskTemplates).values(template);
  }

  console.log(`Done! ${templates.length} task templates seeded.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
