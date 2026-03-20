"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EncounterSidebar from "./EncounterSidebar";
import ChatWindow from "./ChatWindow";
import ContextPanel from "./ContextPanel";
import ResetModal from "./ResetModal";
import DeleteModal from "./DeleteModal";

interface EncounterData {
  id: string;
  scene: {
    title: string;
    coverImage: string | null;
    emotionalHook: string;
    setting: string;
    openingMoment: string;
  };
  character: {
    name: string;
    portraitImage: string | null;
    primaryType: string;
    interactionStyle: string;
  };
  messages: {
    id: string;
    role: string;
    content: string;
    createdAt: string;
  }[];
}

interface SidebarEncounter {
  id: string;
  scene: { title: string };
  character: { name: string };
  lastAccessedAt: string;
}

interface Props {
  encounter: EncounterData;
  encounters: SidebarEncounter[];
  balance: number;
  isAdmin: boolean;
}

export default function EncounterScreen({ encounter, encounters, balance: initialBalance, isAdmin }: Props) {
  const router = useRouter();
  const [balance, setBalance] = useState(initialBalance);
  const [showReset, setShowReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [initialMessages, setInitialMessages] = useState(encounter.messages);

  async function handleResetConfirm() {
    setResetting(true);
    const res = await fetch(`/api/encounters/${encounter.id}/reset`, { method: "POST" });
    setResetting(false);
    if (res.ok) {
      const data = await fetch(`/api/encounters/${encounter.id}`).then((r) => r.json());
      setInitialMessages(data.encounter.messages);
      setResetKey((k) => k + 1);
      setShowReset(false);
    }
  }

  async function handleDeleteConfirm() {
    setDeleting(true);
    const res = await fetch(`/api/encounters/${encounter.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      // /encounters redirects to most recent remaining encounter, or shows empty state
      router.push("/encounters");
    }
  }

  return (
    <>
      <div className="flex h-full overflow-hidden">
        {/* Left sidebar */}
        <div className="w-56 shrink-0 border-r border-enc-border hidden md:flex flex-col">
          <EncounterSidebar encounters={encounters} currentId={encounter.id} />
        </div>

        {/* Center chat */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <ChatWindow
            key={resetKey}
            encounterId={encounter.id}
            initialMessages={initialMessages}
            initialBalance={balance}
            characterName={encounter.character.name}
            isAdmin={isAdmin}
            onBalanceChange={setBalance}
            onRequestReset={() => setShowReset(true)}
          />
        </div>

        {/* Right context panel */}
        <div className="w-64 shrink-0 border-l border-enc-border hidden lg:flex flex-col">
          <ContextPanel
            scene={encounter.scene}
            character={encounter.character}
            isAdmin={isAdmin}
            onReset={() => setShowReset(true)}
            onDelete={() => setShowDelete(true)}
          />
        </div>
      </div>

      {showReset && (
        <ResetModal
          characterName={encounter.character.name}
          onConfirm={handleResetConfirm}
          onCancel={() => setShowReset(false)}
          loading={resetting}
        />
      )}

      {showDelete && (
        <DeleteModal
          sceneName={encounter.scene.title}
          characterName={encounter.character.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}
    </>
  );
}
