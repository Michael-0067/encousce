"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HEARTS_PER_MESSAGE } from "@/lib/constants";

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string | Date;
}

interface Props {
  encounterId: string;
  initialMessages: Message[];
  initialBalance: number;
  characterName: string;
  isAdmin: boolean;
  onBalanceChange: (balance: number) => void;
  onRequestReset: () => void;
}

export default function ChatWindow({
  encounterId,
  initialMessages,
  initialBalance,
  characterName,
  isAdmin,
  onBalanceChange,
  onRequestReset,
}: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [balance, setBalance] = useState(initialBalance);
  const [error, setError] = useState("");
  const [insufficientHearts, setInsufficientHearts] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    if (!isAdmin && balance < HEARTS_PER_MESSAGE) {
      setInsufficientHearts(true);
      return;
    }

    setError("");
    setInsufficientHearts(false);
    setSending(true);

    const content = input.trim();
    setInput("");

    // Optimistic user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "USER",
      content,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    const res = await fetch(`/api/encounters/${encounterId}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setSending(false);

    if (!res.ok) {
      // Remove optimistic message
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));

      if (res.status === 402) {
        setInsufficientHearts(true);
        setBalance(data.balance ?? 0);
        onBalanceChange(data.balance ?? 0);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setInput(content);
      }
      return;
    }

    // Replace temp message with real ones
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== tempUserMsg.id),
      data.userMessage,
      data.aiMessage,
    ]);

    setBalance(data.balance);
    onBalanceChange(data.balance);
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
          >
            {msg.role !== "USER" && (
              <div className="w-6 h-6 rounded-full bg-enc-plum-dark flex items-center justify-center text-enc-rose text-[10px] font-serif shrink-0 mt-1 mr-2">
                {characterName[0]}
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "USER"
                  ? "bg-enc-plum/25 border border-enc-plum/30 text-enc-cream rounded-br-sm"
                  : "bg-enc-surface-2 border border-enc-border text-enc-cream-muted rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-enc-plum-dark flex items-center justify-center text-enc-rose text-[10px] font-serif shrink-0 mt-1 mr-2">
              {characterName[0]}
            </div>
            <div className="bg-enc-surface-2 border border-enc-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-enc-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-enc-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-enc-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Insufficient hearts banner */}
      {insufficientHearts && (
        <div className="mx-4 mb-2 p-3 rounded-lg bg-enc-surface border border-enc-rose/30 flex items-center justify-between">
          <p className="text-enc-rose text-xs">You need Hearts to continue this encounter.</p>
          <a href="/account/hearts" className="text-enc-rose text-xs underline hover:no-underline">
            Get Hearts
          </a>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mx-4 mb-2 p-3 rounded-lg bg-enc-surface border border-enc-border">
          <p className="text-enc-rose text-xs">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 border-t border-enc-border px-4 py-4">
        <form onSubmit={handleSend} className="flex gap-3 items-end">
          <textarea
            className="flex-1 bg-enc-surface border border-enc-border rounded-xl px-4 py-3 text-enc-text placeholder-enc-muted text-sm resize-none focus:outline-none focus:border-enc-plum focus:ring-1 focus:ring-enc-plum transition-colors"
            placeholder={`Say something…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="shrink-0 bg-enc-plum hover:bg-enc-plum-light disabled:opacity-40 disabled:cursor-not-allowed text-enc-cream px-4 py-3 rounded-xl transition-colors flex flex-col items-center gap-0.5"
          >
            <span className="text-sm">→</span>
            {!isAdmin && (
              <span className="text-[9px] text-enc-cream/70">♥ {HEARTS_PER_MESSAGE}</span>
            )}
          </button>
        </form>
        {!isAdmin && (
          <p className="text-enc-dim text-[10px] mt-2 text-right">
            Balance: ♥ {balance.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
