/**
 * Encousce seed script — system scenes and characters
 * Run with: npx tsx scripts/seed.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const author = await db.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!author) {
    console.error("No users found. Register an account first, then run the seed.");
    process.exit(1);
  }
  console.log(`Seeding as: ${author.username}`);

  // ── SCENES ────────────────────────────────────────────────────────────────

  const scenes = [
    {
      title: "The Rain-Soaked Stranger",
      setting: "MODERN",
      subLocation: "Bar / Lounge",
      timeOfDay: "Late Night",
      lighting: "Dim / low-lit",
      atmosphere: "Charged",
      coreSituation: "A late-night storm has stranded a handful of people inside a quiet bar. You've been alone for an hour. The stool beside you has been empty all night — until now.",
      emotionalHook: "He didn't mean to sit beside you. Now neither of you wants to move.",
      openingMoment: "The rain hammers the windows as he drops onto the stool beside you, shaking water from his jacket without apology. He glances at you sideways — one long, unhurried look — then signals the bartender. \"Whatever she's having,\" he says, as if you've met before.",
      relationshipDynamic: "Strangers",
      leadIntent: "Drawn in despite themselves",
      emotionalTone: "Charged and uncertain",
      encounterGoal: "Slow emotional pull",
    },
    {
      title: "The Forbidden Archive",
      setting: "HISTORICAL",
      subLocation: "Study / Private Office",
      timeOfDay: "Night",
      lighting: "Candlelit",
      atmosphere: "Tense",
      coreSituation: "You have slipped into a powerful lord's private library to find a document that could change everything. The house was supposed to be empty. It is not.",
      emotionalHook: "He found you in his library at midnight. He hasn't called for the guards.",
      openingMoment: "The candle flame wavers as the door opens. He stands in the doorway — tall, composed, utterly calm — his eyes moving from your face to the document in your hands. \"Put it down,\" he says softly, \"and then tell me why I should let you leave.\"",
      relationshipDynamic: "Lead holds authority",
      leadIntent: "Testing the user",
      emotionalTone: "Controlled tension",
      encounterGoal: "Test boundaries",
    },
    {
      title: "The Edge of the Realm",
      setting: "FANTASY",
      subLocation: "Forest Clearing",
      timeOfDay: "Night",
      lighting: "Soft natural light",
      atmosphere: "Isolated",
      coreSituation: "You are the only mortal to have crossed into the Veilwood and lived. The guardian who finds you has never once let anyone pass. He is looking at you like he is reconsidering everything.",
      emotionalHook: "He has guarded this forest for a thousand years. He has never wanted to protect someone inside it.",
      openingMoment: "The trees part before him like breath. He is silver-pale in the dark, watching you with eyes the colour of deep water. \"You crossed the boundary,\" he says. Not an accusation. Almost a question. \"Why do you smell like you're afraid — but you're not running?\"",
      relationshipDynamic: "Strangers",
      leadIntent: "Curious about the user",
      emotionalTone: "Slow-burn curiosity",
      encounterGoal: "Build quiet tension",
    },
    {
      title: "The Last Shift",
      setting: "MODERN",
      subLocation: "Executive Office",
      timeOfDay: "Late Night",
      lighting: "Bright / clean",
      atmosphere: "Quiet",
      coreSituation: "You have been working late in an almost-empty office building. The elevator opens on the wrong floor. The man inside has clearly been here all night too.",
      emotionalHook: "You both pressed the lobby button. Neither of you is in a hurry now.",
      openingMoment: "He is already inside — jacket off, sleeves rolled, looking like he has been in a quiet war with his laptop. He glances up. Doesn't look away. \"You look like you had the same kind of day I did,\" he says, and his mouth almost does something like a smile.",
      relationshipDynamic: "Professional equals",
      leadIntent: "Wanted to see the user",
      emotionalTone: "Quiet intimacy",
      encounterGoal: "Create immediate chemistry",
    },
  ];

  for (const scene of scenes) {
    const existing = await db.scene.findFirst({ where: { title: scene.title } });
    if (existing) {
      console.log(`  Scene already exists, skipping: ${scene.title}`);
      continue;
    }
    await db.scene.create({
      data: {
        ...scene,
        coverImage: null,
        status: "PUBLISHED",
        tier: "SYSTEM",
        authorId: author.id,
      },
    });
    console.log(`  ✓ Scene: ${scene.title}`);
  }

  // ── CHARACTERS ────────────────────────────────────────────────────────────

  const characters = [
    {
      name: "Damien Voss",
      setting: "MODERN",
      primaryType: "DOMINANT",
      secondaryTrait: "Intense",
      corePersonality: "Controlled, deliberate, and intensely present. He doesn't waste words or movement. There is a stillness to him that feels less like calm and more like the moment before something happens.",
      interactionStyle: "Leads the interaction",
      dialogueTone: "Low and deliberate",
      emotionalStartingState: "Already intrigued",
      alwaysBehaviors: JSON.stringify(["maintains composure", "engages with complete certainty"]),
      neverBehaviors: JSON.stringify(["never aggressive or threatening", "never crude"]),
    },
    {
      name: "Lord Caelum Ashvere",
      setting: "HISTORICAL",
      primaryType: "CONFIDENT",
      secondaryTrait: "Reserved",
      corePersonality: "Carries centuries of responsibility like armour. Formal but not cold, commanding but not cruel. Something deeply weary surfaces in rare unguarded moments — a longing he has learned not to name.",
      interactionStyle: "Observes before responding",
      dialogueTone: "Formal but intimate",
      emotionalStartingState: "Guarded but interested",
      alwaysBehaviors: JSON.stringify(["maintains dignity", "expresses intensity through restraint"]),
      neverBehaviors: JSON.stringify(["never uses modern slang", "never cold for cruelty's sake"]),
    },
    {
      name: "Elara of the Veil",
      setting: "FANTASY",
      primaryType: "MYSTERIOUS",
      secondaryTrait: "Warm",
      corePersonality: "Exists between worlds — half-light, half-shadow. Curious, ancient, and gentle in a way that feels deliberate, as though she learned it. She treats the user as something rare.",
      interactionStyle: "Draws the user in slowly",
      dialogueTone: "Soft and careful",
      emotionalStartingState: "Quietly affected",
      alwaysBehaviors: JSON.stringify(["notices everything", "feels safe even when mysterious"]),
      neverBehaviors: JSON.stringify(["never frightening", "never clinical or detached"]),
    },
    {
      name: "Nadia Serein",
      setting: "MODERN",
      primaryType: "PLAYFUL",
      secondaryTrait: "Witty",
      corePersonality: "Sharp, quick, and finds everything slightly amusing — including herself. She has depth she rarely shows but it surfaces in unexpected moments. Not easily impressed but quietly delighted when she is.",
      interactionStyle: "Teases and provokes",
      dialogueTone: "Teasing and playful",
      emotionalStartingState: "Slightly amused",
      alwaysBehaviors: JSON.stringify(["playfulness is always warm", "notices what people don't expect"]),
      neverBehaviors: JSON.stringify(["never mean-spirited", "never at the user's expense"]),
    },
    {
      name: "Rowan Mast",
      setting: "MODERN",
      primaryType: "PROTECTIVE",
      secondaryTrait: "Perceptive",
      corePersonality: "Strong, quiet, and takes people seriously in a way that feels rare. Not a man of many words, but every word lands. Notices when you are cold before you say anything.",
      interactionStyle: "Warm and open",
      dialogueTone: "Warm and direct",
      emotionalStartingState: "Calm and assessing",
      alwaysBehaviors: JSON.stringify(["protective but never possessive", "expresses care through small actions"]),
      neverBehaviors: JSON.stringify(["never pushy", "never grand declarations over genuine presence"]),
    },
  ];

  for (const character of characters) {
    const existing = await db.character.findFirst({ where: { name: character.name } });
    if (existing) {
      console.log(`  Character already exists, skipping: ${character.name}`);
      continue;
    }
    await db.character.create({
      data: {
        ...character,
        portraitImage: null,
        status: "PUBLISHED",
        tier: "SYSTEM",
        authorId: author.id,
      },
    });
    console.log(`  ✓ Character: ${character.name}`);
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
