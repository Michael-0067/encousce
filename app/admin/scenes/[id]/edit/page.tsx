import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import AdminSceneEditForm from "@/components/admin/AdminSceneEditForm";

export default async function AdminSceneEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scene = await db.scene.findUnique({ where: { id } });
  if (!scene) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-2xl text-enc-cream">Edit Scene</h1>
      <AdminSceneEditForm scene={{
        id: scene.id,
        title: scene.title,
        setting: scene.setting,
        subLocation: scene.subLocation,
        timeOfDay: scene.timeOfDay,
        lighting: scene.lighting,
        atmosphere: scene.atmosphere,
        environmentDetails: scene.environmentDetails ?? "",
        coreSituation: scene.coreSituation,
        relationshipDynamic: scene.relationshipDynamic,
        leadIntent: scene.leadIntent,
        openingMoment: scene.openingMoment,
        emotionalTone: scene.emotionalTone,
        emotionalHook: scene.emotionalHook,
        encounterGoal: scene.encounterGoal,
        generatedPrompt: scene.generatedPrompt ?? "",
        imagePrompt: scene.imagePrompt ?? "",
        teaserText: scene.teaserText ?? "",
        coverImage: scene.coverImage ?? "",
        toneTags: scene.toneTags,
        status: scene.status,
        tier: scene.tier,
      }} />
    </div>
  );
}
