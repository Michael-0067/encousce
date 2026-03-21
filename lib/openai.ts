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
    generatedPrompt?: string | null;
    // Legacy fallback fields
    corePersonality?: string;
    interactionStyle?: string;
    dialogueTone?: string;
    alwaysBehaviors?: string;
    neverBehaviors?: string;
  }
): string {
  const base = character.generatedPrompt
    ? character.generatedPrompt
    : buildFallbackPrompt(character);

  return `${base}

Scene: ${scene.coreSituation}
Setting: ${scene.setting}

You are in an intimate, romantic encounter with the user. Stay in character at all times. Keep responses personal and emotionally present — typically 2-5 sentences. Do not break character. Do not use asterisks for actions. Speak directly to the user as ${character.name}.`.trim();
}

function buildFallbackPrompt(character: {
  name?: string;
  corePersonality?: string;
  interactionStyle?: string;
  dialogueTone?: string;
  alwaysBehaviors?: string;
  neverBehaviors?: string;
}): string {
  let prompt = `You are ${character.name}.`;
  if (character.corePersonality) prompt += `\n\nPersonality: ${character.corePersonality}`;
  if (character.interactionStyle) prompt += `\n\nHow you engage: ${character.interactionStyle}`;
  if (character.dialogueTone) prompt += `\n\nHow you speak: ${character.dialogueTone}`;
  return prompt;
}
