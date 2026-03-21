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
        coreSituation: scene.coreSituation,
        emotionalHook: scene.emotionalHook,
        openingMoment: scene.openingMoment,
        toneTags: scene.toneTags,
        allowedType1: scene.allowedType1,
        allowedType2: scene.allowedType2 ?? "",
        coverImage: scene.coverImage ?? "",
        imagePrompt: scene.imagePrompt ?? "",
        status: scene.status,
        tier: scene.tier,
      }} />
    </div>
  );
}
