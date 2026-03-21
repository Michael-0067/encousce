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
        primaryType: character.primaryType,
        secondaryType: character.secondaryType ?? "",
        compatibleSettings: character.compatibleSettings,
        corePersonality: character.corePersonality,
        interactionStyle: character.interactionStyle,
        dialogueTone: character.dialogueTone,
        behaviorRules: character.behaviorRules,
        portraitImage: character.portraitImage ?? "",
        imagePrompt: character.imagePrompt ?? "",
        status: character.status,
        tier: character.tier,
      }} />
    </div>
  );
}
