import React, { useEffect, useRef, useState } from "react";
import { Car } from "../data/cars";
import { Icon } from "../components/Icon";
import { useNav } from "../state/nav";

interface Msg {
  id: number;
  from: "seller" | "you" | "system";
  text: string;
}

const SCRIPT: Msg[] = [
  { id: 1, from: "system", text: "Identities are masked. Calls & chat are recorded and monitored for your safety — no contact numbers are shared." },
  { id: 2, from: "seller", text: "Hi! Congrats on winning the bid. Happy to show you anything on the car before pickup." },
  { id: 3, from: "you", text: "Thanks! Can you show me the underbody and engine bay on a quick video call?" },
  { id: 4, from: "seller", text: "Sure — starting a video call now. I'll walk you around the car." },
];

const SELLER_REPLIES = [
  "Sure, one moment — let me check.",
  "Yes, that's all original. No repaints there.",
  "Service records are in the glovebox, I'll show you.",
  "Happy to do a guided video walkthrough whenever you like.",
];

export function SellerChat({ car, initialCall = null }: { car: Car; initialCall?: "audio" | "video" | null }) {
  const { pop } = useNav();
  const [msgs, setMsgs] = useState<Msg[]>(SCRIPT);
  const [draft, setDraft] = useState("");
  const [call, setCall] = useState<null | "audio" | "video">(initialCall);
  const idRef = useRef(100);
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyIdx = useRef(0);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    const id = idRef.current++;
    setMsgs((m) => [...m, { id, from: "you", text: t }]);
    setDraft("");
    setTimeout(() => {
      setMsgs((m) => [...m, { id: idRef.current++, from: "seller", text: SELLER_REPLIES[replyIdx.current++ % SELLER_REPLIES.length] }]);
    }, 900);
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ zIndex: 40, background: "var(--bg-secondary)" }}>
      {/* header */}
      <div className="flex items-center gap-3 px-3 py-2.5 bg-primary" style={{ flexShrink: 0, borderBottom: "1px solid var(--border-secondary)" }}>
        <button className="press text-primary" onClick={pop} style={{ border: "none", background: "transparent" }}>
          <Icon name="back" size={22} />
        </button>
        <div className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, background: "linear-gradient(135deg,#5A4BFF,#3326C4)", flexShrink: 0 }}>
          <Icon name="user" size={20} className="text-primary-inverse" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="text-label-1-semibold text-primary">Verified Seller</div>
          <div className="flex items-center gap-1">
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A" }} />
            <span className="text-label-4-regular text-secondary">Online · identity masked</span>
          </div>
        </div>
        <button onClick={() => setCall("audio")} className="press flex items-center justify-center rounded-full bg-secondary" style={{ width: 38, height: 38, border: "none" }}>
          <Icon name="phone" size={18} className="text-brand-base" />
        </button>
        <button onClick={() => setCall("video")} className="press flex items-center justify-center rounded-full bg-brand-base" style={{ width: 38, height: 38, border: "none" }}>
          <Icon name="video" size={18} className="text-primary-inverse" />
        </button>
      </div>

      {/* car context strip */}
      <div className="flex items-center gap-2 px-4 py-2" style={{ flexShrink: 0, background: "var(--bg-brand-subtle)" }}>
        <Icon name="car" size={15} className="text-brand-base" />
        <span className="text-label-3-medium text-primary">{car.year} {car.make} {car.model} · {car.variant}</span>
      </div>

      <div className="px-4 py-3 bg-primary" style={{ borderBottom: "1px solid var(--border-secondary)" }}>
        <div
          className="flex items-center gap-2.5"
          style={{
            borderRadius: 18,
            padding: 10,
            background: "linear-gradient(135deg,#F8FAFF,#EEF4FF)",
            border: "1px solid rgba(148,163,184,0.24)",
          }}
        >
          <div className="flex items-center justify-center rounded-full bg-brand-base" style={{ width: 34, height: 34, flexShrink: 0 }}>
            <Icon name="video" size={17} className="text-primary-inverse" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="text-label-3-semibold text-primary">Guided seller inspection</div>
            <div className="text-label-4-regular text-secondary">Ask for underbody, engine bay or interior live.</div>
          </div>
          <button onClick={() => setCall("audio")} className="press flex items-center justify-center rounded-full bg-primary" style={{ width: 34, height: 34, border: "1px solid var(--border-secondary)" }}>
            <Icon name="phone" size={16} className="text-brand-base" />
          </button>
          <button onClick={() => setCall("video")} className="press flex items-center justify-center rounded-full bg-brand-base" style={{ width: 34, height: 34, border: "none" }}>
            <Icon name="video" size={16} className="text-primary-inverse" />
          </button>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="scroll-area px-4 py-4 flex flex-col gap-2.5" style={{ flex: 1 }}>
        {msgs.map((m) =>
          m.from === "system" ? (
            <div key={m.id} className="flex items-start gap-2 rounded-xl bg-secondary px-3 py-2.5 mx-auto" style={{ maxWidth: "92%" }}>
              <Icon name="lock" size={14} className="text-secondary" style={{ marginTop: 1, flexShrink: 0 }} />
              <span className="text-label-4-regular text-secondary text-center">{m.text}</span>
            </div>
          ) : (
            <div key={m.id} style={{ alignSelf: m.from === "you" ? "flex-end" : "flex-start", maxWidth: "78%" }}>
              <div
                className={`px-3.5 py-2.5 text-label-2-regular ${m.from === "you" ? "text-primary-inverse" : "text-primary bg-primary"}`}
                style={{
                  borderRadius: 18,
                  borderBottomRightRadius: m.from === "you" ? 4 : 18,
                  borderBottomLeftRadius: m.from === "you" ? 18 : 4,
                  background: m.from === "you" ? "linear-gradient(135deg,#5A4BFF,#3B2BDB)" : undefined,
                  border: m.from === "seller" ? "1px solid var(--border-secondary)" : "none",
                }}
              >
                {m.text}
              </div>
            </div>
          )
        )}
      </div>

      {/* input */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-primary" style={{ flexShrink: 0, borderTop: "1px solid var(--border-secondary)" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message the seller…"
          className="flex-1 text-label-2-regular text-primary"
          style={{ border: "1px solid var(--border-secondary)", outline: "none", background: "var(--bg-secondary)", borderRadius: 22, padding: "10px 16px", minWidth: 0 }}
        />
        <button onClick={send} className="press flex items-center justify-center rounded-full bg-brand-base" style={{ width: 42, height: 42, border: "none", flexShrink: 0 }}>
          <Icon name="send" size={18} className="text-primary-inverse" />
        </button>
      </div>

      {call && <CallModal mode={call} car={car} onEnd={() => setCall(null)} />}
    </div>
  );
}

function CallModal({ mode, car, onEnd }: { mode: "audio" | "video"; car: Car; onEnd: () => void }) {
  const [secs, setSecs] = useState(0);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setConnected(true), 1600);
    const iv = setInterval(() => setConnected((c) => (c ? (setSecs((s) => s + 1), true) : c)), 1000);
    return () => { clearTimeout(t1); clearInterval(iv); };
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div className="absolute inset-0 flex flex-col items-center" style={{ zIndex: 60, background: mode === "video" ? "#0b0e18" : "linear-gradient(160deg,#1b1f3a,#0b0e18)" }}>
      {mode === "video" && (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 50% at 50% 35%, hsl(${car.hue} 30% 28%), #0b0e18)` }} />
      )}
      <div className="flex flex-col items-center" style={{ marginTop: 90, zIndex: 1 }}>
        <div className="flex items-center justify-center rounded-full" style={{ width: 96, height: 96, background: "linear-gradient(135deg,#5A4BFF,#3326C4)", boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}>
          <Icon name="user" size={46} className="text-primary-inverse" />
        </div>
        <div className="text-heading-h3-bold mt-4" style={{ color: "#fff" }}>Verified Seller</div>
        <div className="text-label-2-regular mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
          {connected ? `${mode === "video" ? "Video" : "Audio"} call · ${mm}:${ss}` : "Connecting… identity masked"}
        </div>
        {mode === "video" && connected && (
          <div className="rounded-2xl mt-6 flex items-center justify-center" style={{ width: 150, height: 100, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <span className="text-label-4-regular" style={{ color: "rgba(255,255,255,0.6)" }}>Guided walkthrough</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 rounded-full px-3 py-2 mt-7" style={{ background: "rgba(255,255,255,0.08)", zIndex: 1 }}>
        <Icon name="lock" size={13} style={{ color: "rgba(255,255,255,0.7)" }} />
        <span className="text-label-4-regular" style={{ color: "rgba(255,255,255,0.7)" }}>Recorded & monitored · no numbers shared</span>
      </div>
      <button
        onClick={onEnd}
        className="press flex items-center justify-center rounded-full"
        style={{ position: "absolute", bottom: 48, width: 64, height: 64, background: "#E11D48", border: "none", color: "#fff", zIndex: 1, boxShadow: "0 10px 30px rgba(225,29,72,0.5)" }}
      >
        <Icon name="phone" size={26} />
      </button>
    </div>
  );
}
