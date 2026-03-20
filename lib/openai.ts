import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function buildSystemPrompt(
  scene: {
    setting: string;
    coreSituation: string;
    openingMoment: string;
  },
  character: {
    name: string;
    corePersonality: string;
    interactionStyle: string;
    dialogueTone: string;
    behaviorRules: string;
  }
): string {
  return `You are ${character.name}.

Personality: ${character.corePersonality}

How you engage: ${character.interactionStyle}

How you speak: ${character.dialogueTone}

Rules: ${character.behaviorRules}

Scene: ${scene.coreSituation}

Setting: ${scene.setting}

You are in an intimate, romantic encounter with the user. Stay in character at all times. Keep responses personal and emotionally present — typically 2-5 sentences. Do not break character. Do not use asterisks for actions. Speak directly to the user as ${character.name}.`.trim();
}
