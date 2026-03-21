import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import AdminCharacterEditForm from "@/components/admin/AdminCharacterEditForm";

export default async function AdminCharacterEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await db.character.findUnique({ where: { id } });
  if (!character) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-2xl text-enc-cream">Edit Character</h1>
      <AdminCharacterEditForm character={{
        id: character.id,
        name: character.name,
        visualSex: character.visualSex,
        genderExpression: character.genderExpression,
        raceEthnicity: character.raceEthnicity ?? "",
        apparentAge: character.apparentAge,
        build: character.build,
        presence: character.presence,
        hairStyle: character.hairStyle,
        hairColor: character.hairColor,
        eyeColor: character.eyeColor,
        distinguishingFeature: character.distinguishingFeature ?? "",
        setting: character.setting,
        primaryType: character.primaryType,
        secondaryTrait: character.secondaryTrait ?? "",
        corePersonality: character.corePersonality,
        interactionStyle: character.interactionStyle,
        dialogueTone: character.dialogueTone,
        emotionalStartingState: character.emotionalStartingState,
        alwaysBehaviors: character.alwaysBehaviors,
        neverBehaviors: character.neverBehaviors,
        generatedPrompt: character.generatedPrompt ?? "",
        imagePrompt: character.imagePrompt ?? "",
        teaserText: character.teaserText ?? "",
        portraitImage: character.portraitImage ?? "",
        status: character.status,
        tier: character.tier,
      }} />
    </div>
  );
}
