import React, { useState } from "react";
import { Car, Defect, fmtL, fmtRs } from "../data/cars";
import { CarMedia } from "../components/CarMedia";
import { CarPhoto } from "../components/CarPhoto";
import { Icon, IconName } from "../components/Icon";
import { Button, FulfillmentStamp, GradeBadge, SpecChip, Tag, SectionTitle } from "../components/ui";
import { useNav } from "../state/nav";
import { useStore } from "../state/store";
import { useAgents } from "../agents/useAgents";
import { useBid } from "../components/BidFlow";

const MEDIA_TABS: { id: string; label: string; icon: IconName }[] = [
  { id: "photos", label: "Photos", icon: "photo" },
  { id: "360", label: "360°", icon: "rotate" },
  { id: "video", label: "Video", icon: "video" },
  { id: "audio", label: "Engine", icon: "audio" },
  { id: "under", label: "Underbody", icon: "car" },
];

export function CarDetail({ car }: { car: Car }) {
  const { pop, push, setTab } = useNav();
  const { state } = useStore();
  const agents = useAgents();
  const { openBid } = useBid();
  const [selDefect, setSelDefect] = useState<Defect | null>(null);
  const won = state.won.includes(car.id);
  const highest = state.highest[car.id] ?? car.currentHighest;

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col" style={{ zIndex: 30 }}>
      {/* header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-primary" style={{ flexShrink: 0, borderBottom: "1px solid var(--border-secondary)" }}>
        <button className="press flex items-center gap-1 text-primary" onClick={pop} style={{ border: "none", background: "transparent" }}>
          <Icon name="back" size={22} />
        </button>
        <div className="text-heading-h5-bold text-primary">
          {car.year} {car.make} {car.model}
        </div>
        <div style={{ width: 22 }} />
      </div>

      <div className="scroll-area" style={{ flex: 1 }}>
        {/* media */}
        <div style={{ height: 240, background: "#15131c", position: "relative" }}>
          <CarMedia car={car} />
          {car.type === "owned" && (
            <div style={{ position: "absolute", top: 12, right: 12, filter: "drop-shadow(0 4px 10px rgba(10,92,73,0.4))" }}>
              <FulfillmentStamp size={62} />
            </div>
          )}
        </div>
        {/* media tabs */}
        <div className="hscroll bg-primary px-4 py-2.5" style={{ borderBottom: "1px solid var(--border-secondary)" }}>
          {MEDIA_TABS.filter((t) => (t.id === "360" ? car.has360 : t.id === "audio" ? car.hasAudio : true)).map((t, i) => (
            <button
              key={t.id}
              className="press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ border: "none", background: i === 0 ? "var(--bg-brand-base)" : "var(--bg-secondary)", color: i === 0 ? "#fff" : "var(--text-secondary)", flexShrink: 0 }}
            >
              <Icon name={t.icon} size={14} />
              <span className="text-label-3-semibold">{t.label}</span>
            </button>
          ))}
        </div>

        {/* title block */}
        <div className="bg-primary px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            {car.type === "owned" ? <Tag tone="success">Fulfillment guaranteed</Tag> : <Tag tone="ocb">OCB · Consumer lot</Tag>}
            {car.demand === "High" && <Tag tone="purple">High demand</Tag>}
          </div>
          <div className="text-heading-h2-bold text-primary">
            {car.make} {car.model}
          </div>
          <div className="text-label-1-regular text-secondary mb-3">
            {car.variant} · {car.year}
          </div>
          <div className="hscroll">
            <SpecChip icon="gauge" label={`${car.km.toLocaleString("en-IN")} km`} />
            <SpecChip icon="fuel" label={car.fuel} />
            <SpecChip icon="gear" label={car.transmission} />
          </div>

          <div className="divider my-4" />

          <div className="flex items-end justify-between">
            <div>
              <div className="text-label-3-medium text-secondary">Min bid · predicted</div>
              <div className="text-display-2-bold text-brand-base">{fmtL(car.minBid)}</div>
              <div className="text-label-4-regular text-secondary">
                from market {car.type === "ocb" ? "+ seller quote" : ""} · highest {fmtL(highest)}
              </div>
            </div>
            <GradeBadge grade={car.conditionGrade} label={car.conditionLabel} />
          </div>
        </div>

        {/* Condition report */}
        <Section icon="doc" title="Condition report" subtitle="Approved by Inspect360 · contractual source of truth">
          <DefectMap car={car} selected={selDefect} onSelect={setSelDefect} />
          {selDefect ? (
            <DefectDetail car={car} defect={selDefect} />
          ) : (
            <div className="text-label-3-regular text-secondary mt-3">
              Tap a marker to see the photo, severity and inspector note. {car.defects.length} marked
              point{car.defects.length === 1 ? "" : "s"}.
            </div>
          )}

          <button
            onClick={() =>
              agents.say(
                "Condition",
                `${car.make} ${car.model} is Grade ${car.conditionGrade}/5 (${car.conditionLabel}). ${car.defects.length} marked defects, all documented with photos. OBD2 ${car.obd2.status}. ${car.paintMeter}. My take: solid buy at the min bid.`
              )
            }
            className="press w-full flex items-center justify-center gap-2 rounded-xl bg-brand-subtle text-brand-base mt-4 py-3"
            style={{ border: "none" }}
          >
            <Icon name="sparkle" size={16} />
            <span className="text-label-2-semibold">Ask the Condition agent: “Is this car ok?”</span>
          </button>
        </Section>

        {/* Inspection media — underbody mandatory capture */}
        <Section icon="car" title="Inspection media" subtitle="Underbody examples, engine bay & tyres">
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <UnderbodyExample title="Front underbody" note="Crossmember, sump guard" hue={car.hue} />
            <UnderbodyExample title="Rear floor pan" note="Rails, corrosion check" hue={(car.hue + 28) % 360} />
          </div>
          <div className="hscroll" style={{ paddingBottom: 4 }}>
            <InspectionTile kind="engine" label="Engine bay" hue={car.hue} />
            <InspectionTile kind="tyre" label="Tyre tread" hue={car.hue} />
            <InspectionTile kind="obd" label="OBD2 readout" hue={car.hue} />
          </div>
          <div className="flex items-start gap-2 mt-3">
            <Icon name="info" size={15} className="text-secondary" style={{ marginTop: 1 }} />
            <span className="text-label-4-regular text-secondary">
              Underbody is captured for every car — frame, weld lines, leaks and corrosion checked before listing.
            </span>
          </div>
        </Section>

        {/* Diagnostics */}
        <Section icon="gauge" title="Diagnostics">
          <Row label="OBD2 scan" value={car.obd2.status === "Pass" ? "Pass · no fault codes" : `Fault: ${car.obd2.codes.join(", ")}`} good={car.obd2.status === "Pass"} />
          <Row label="Paint meter" value={car.paintMeter} />
          <Row label="Tyre tread" value={car.tyreTread} />
          {car.hasAudio && (
            <button className="press flex items-center gap-2 rounded-xl bg-secondary px-3.5 py-3 mt-2 w-full" style={{ border: "none" }}>
              <div className="flex items-center justify-center rounded-full bg-brand-base" style={{ width: 30, height: 30 }}>
                <Icon name="play" size={14} className="text-primary-inverse" />
              </div>
              <span className="text-label-2-semibold text-primary">Play engine / cold-start audio</span>
            </button>
          )}
        </Section>

        {/* History & transparency */}
        <Section icon="shield" title="History & transparency">
          <Row label="Challan" value={car.history.challan} good={car.history.challan === "None"} />
          <Row label="Loan / lien" value={car.history.loan} good={!car.history.loan.toLowerCase().includes("active lien") || car.history.loan.includes("No")} />
          <Row label="Accident history" value={car.history.accident} good={car.history.accident.toLowerCase().includes("no")} />
          <Row label="Service history" value={car.history.service} good={car.history.service.toLowerCase().includes("full")} />
          <Row label="Vaahan" value={car.history.vaahan} good />
          <div className="flex items-center justify-between rounded-xl bg-brand-subtle px-3.5 py-3 mt-2">
            <span className="text-label-2-semibold text-primary">Net landed cost</span>
            <span className="text-heading-h4-bold text-brand-base">{fmtL(car.netLandedCost)}</span>
          </div>
        </Section>

        {/* Price intelligence */}
        <PriceIntel car={car} />

        {/* OCB seller communication — unlocks only after winning the bid */}
        {car.type === "ocb" && won && (
          <Section icon="phone" title="Seller communication" subtitle="Chat, audio & video call — unlocks after you win">
            <button
              onClick={() => push({ name: "seller-chat", params: { id: car.id } })}
              className="press flex items-center gap-3 w-full rounded-2xl px-4 py-3.5"
              style={{
                border: "none",
                background: "linear-gradient(135deg,#1A153F 0%,#4736FE 52%,#7A3DF2 100%)",
                boxShadow: "0 12px 24px rgba(71,54,254,0.28)",
              }}
            >
              <Icon name="send" size={20} className="text-primary-inverse" />
              <div className="text-left" style={{ flex: 1 }}>
                <div className="text-label-1-semibold text-primary-inverse">Open seller chat</div>
                <div className="text-label-4-regular" style={{ color: "rgba(255,255,255,0.8)" }}>Audio & video call live inside chat</div>
              </div>
              <Icon name="chevron" size={18} className="text-primary-inverse" />
            </button>
            <div className="flex items-start gap-2 mt-3">
              <Icon name="lock" size={15} className="text-secondary" style={{ marginTop: 1 }} />
              <span className="text-label-4-regular text-secondary">
                Masked identities · no number sharing · calls recorded & monitored. Ask for a guided underbody, engine bay or interior walkthrough.
              </span>
            </div>
          </Section>
        )}

        <div style={{ height: 96 }} />
      </div>

      {/* sticky bid bar */}
      <div className="bg-primary px-4 py-3 flex items-center gap-3" style={{ flexShrink: 0, borderTop: "1px solid var(--border-secondary)" }}>
        <div>
          <div className="text-label-4-regular text-secondary">Min bid</div>
          <div className="text-heading-h3-bold text-primary">{fmtL(car.minBid)}</div>
        </div>
        <div style={{ flex: 1 }}>
          {won ? (
            <Button full variant="secondary" leftIcon="check" onClick={() => setTab("purchased")}>
              Won — view in Purchased
            </Button>
          ) : (
            <Button full leftIcon="bolt" onClick={() => openBid(car.id)}>
              Place bid
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, subtitle, children }: { icon: IconName; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div
      className="bg-primary px-4 py-4"
      style={{
        margin: "10px 10px 0",
        borderRadius: 22,
        border: "1px solid rgba(148,163,184,0.22)",
        boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
      }}
    >
      <div className="flex items-start gap-2 mb-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 34,
            height: 34,
            flexShrink: 0,
            background: "linear-gradient(135deg,#E8E5FF,#F7F5FF)",
            color: "#4736FE",
          }}
        >
          <Icon name={icon} size={16} className="text-brand-base" />
        </div>
        <div>
          <div className="text-heading-h4-bold text-primary">{title}</div>
          {subtitle && <div className="text-label-4-regular text-secondary">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function UnderbodyExample({ title, note, hue }: { title: string; note: string; hue: number }) {
  const gradientId = `metal-${title.replace(/\s/g, "")}`;
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: 18,
        border: "1px solid rgba(148,163,184,0.28)",
        background: "#0D1424",
        boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
      }}
    >
      <div
        style={{
          height: 102,
          position: "relative",
          background: `radial-gradient(90% 80% at 50% 20%, hsla(${hue} 55% 72% / 0.28), transparent 62%), linear-gradient(155deg,#293244 0%,#101723 58%,#080C14 100%)`,
        }}
      >
        <svg viewBox="0 0 180 112" width="100%" height="100%" aria-label={title}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(226,232,240,0.9)" />
              <stop offset="100%" stopColor="rgba(100,116,139,0.45)" />
            </linearGradient>
          </defs>
          <rect x="20" y="14" width="140" height="84" rx="18" fill="rgba(15,23,42,0.72)" stroke="rgba(226,232,240,0.18)" />
          <path d="M46 18v78M134 18v78" stroke={`url(#${gradientId})`} strokeWidth="4" strokeLinecap="round" />
          <path d="M48 35h84M48 56h84M48 78h84" stroke="rgba(203,213,225,0.42)" strokeWidth="3" strokeLinecap="round" />
          <path d="M94 18c8 24 8 54 0 78" stroke="rgba(241,245,249,0.7)" strokeWidth="4" strokeLinecap="round" />
          <g fill="rgba(8,12,20,0.95)" stroke="rgba(148,163,184,0.42)" strokeWidth="2">
            <rect x="12" y="24" width="20" height="28" rx="7" />
            <rect x="148" y="24" width="20" height="28" rx="7" />
            <rect x="12" y="62" width="20" height="28" rx="7" />
            <rect x="148" y="62" width="20" height="28" rx="7" />
          </g>
          <circle cx="64" cy="55" r="4" fill="#22C55E" />
          <circle cx="117" cy="75" r="4" fill="#F59E0B" />
        </svg>
        <span
          className="text-label-4-semibold"
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            color: "#BFF7D0",
            background: "rgba(20,83,45,0.72)",
            border: "1px solid rgba(187,247,208,0.28)",
            borderRadius: 999,
            padding: "3px 8px",
          }}
        >
          Captured
        </span>
      </div>
      <div className="px-3 py-2 bg-primary">
        <div className="text-label-3-semibold text-primary">{title}</div>
        <div className="text-label-4-regular text-secondary">{note}</div>
      </div>
    </div>
  );
}

function InspectionTile({ kind, label, tag, hue }: { kind: "underbody" | "engine" | "tyre" | "obd"; label: string; tag?: string; hue: number }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ width: 168, flexShrink: 0, position: "relative", border: "1px solid var(--border-secondary)" }}>
      <div style={{ height: 112, position: "relative", background: "linear-gradient(160deg,#2a2f45,#11151f)" }}>
        <svg viewBox="0 0 168 112" width="100%" height="100%" aria-label={label}>
          {kind === "underbody" && (
            <g fill="none" stroke="rgba(180,200,230,0.6)" strokeWidth="2" strokeLinecap="round">
              <rect x="34" y="14" width="100" height="84" rx="16" stroke="rgba(180,200,230,0.35)" />
              <line x1="60" y1="16" x2="60" y2="96" />
              <line x1="108" y1="16" x2="108" y2="96" />
              <line x1="60" y1="34" x2="108" y2="34" />
              <line x1="60" y1="56" x2="108" y2="56" strokeWidth="3" stroke="rgba(150,170,200,0.5)" />
              <line x1="60" y1="78" x2="108" y2="78" />
              {/* exhaust */}
              <path d="M96 18 C100 40 100 70 96 96" stroke="rgba(210,220,235,0.75)" strokeWidth="3" />
              {/* wheels */}
              <rect x="24" y="20" width="14" height="22" rx="5" fill="rgba(20,24,34,0.9)" stroke="rgba(150,170,200,0.4)" />
              <rect x="130" y="20" width="14" height="22" rx="5" fill="rgba(20,24,34,0.9)" stroke="rgba(150,170,200,0.4)" />
              <rect x="24" y="70" width="14" height="22" rx="5" fill="rgba(20,24,34,0.9)" stroke="rgba(150,170,200,0.4)" />
              <rect x="130" y="70" width="14" height="22" rx="5" fill="rgba(20,24,34,0.9)" stroke="rgba(150,170,200,0.4)" />
            </g>
          )}
          {kind === "engine" && (
            <g fill="none" stroke="rgba(180,200,230,0.6)" strokeWidth="2" strokeLinecap="round">
              <rect x="40" y="34" width="88" height="50" rx="8" fill="rgba(40,46,66,0.8)" />
              <rect x="52" y="24" width="20" height="12" rx="3" />
              <rect x="92" y="44" width="28" height="20" rx="3" fill="rgba(60,68,92,0.9)" />
              <path d="M48 44 C40 50 40 64 52 70" />
              <path d="M120 40 C134 46 134 62 122 70" />
              <circle cx="58" cy="60" r="6" />
            </g>
          )}
          {kind === "tyre" && (
            <g fill="none" stroke="rgba(180,200,230,0.6)" strokeWidth="2">
              <circle cx="84" cy="56" r="42" stroke="rgba(150,170,200,0.4)" />
              <circle cx="84" cy="56" r="20" fill="rgba(40,46,66,0.9)" stroke="rgba(180,200,230,0.6)" />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <line key={i} x1={84 + Math.cos(a) * 24} y1={56 + Math.sin(a) * 24} x2={84 + Math.cos(a) * 40} y2={56 + Math.sin(a) * 40} />;
              })}
            </g>
          )}
          {kind === "obd" && (
            <g>
              <rect x="38" y="26" width="92" height="60" rx="8" fill="rgba(15,40,30,0.95)" stroke="rgba(34,197,94,0.5)" strokeWidth="2" />
              <text x="84" y="50" fill="#22D38A" textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>PASS</text>
              <text x="84" y="66" fill="rgba(180,230,200,0.8)" textAnchor="middle" style={{ fontSize: 8 }}>0 fault codes</text>
            </g>
          )}
        </svg>
        {tag && (
          <span className="rounded-md px-1.5 py-0.5 text-label-4-semibold" style={{ position: "absolute", top: 8, left: 8, background: "#E11D48", color: "#fff" }}>
            {tag}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 bg-primary px-3 py-2">
        <Icon name="photo" size={13} className="text-secondary" />
        <span className="text-label-3-semibold text-primary">{label}</span>
      </div>
    </div>
  );
}

function Row({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border-secondary)" }}>
      <span className="text-label-3-regular text-secondary">{label}</span>
      <span className={`text-label-3-semibold flex items-center gap-1 ${good ? "text-success-bold" : "text-primary"}`}>
        {good && <Icon name="check" size={13} strokeWidth={2.6} />}
        {value}
      </span>
    </div>
  );
}

function DefectMap({ car, selected, onSelect }: { car: Car; selected: Defect | null; onSelect: (d: Defect) => void }) {
  return (
    <div className="relative rounded-2xl bg-secondary" style={{ padding: "18px 12px" }}>
      <svg viewBox="0 0 300 150" width="100%" aria-hidden>
        {/* top-view car outline · front at left */}
        <g fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          {/* wheels */}
          <rect x="74" y="22" width="30" height="13" rx="5" fill="var(--text-tertiary)" stroke="none" opacity="0.55" />
          <rect x="196" y="22" width="30" height="13" rx="5" fill="var(--text-tertiary)" stroke="none" opacity="0.55" />
          <rect x="74" y="115" width="30" height="13" rx="5" fill="var(--text-tertiary)" stroke="none" opacity="0.55" />
          <rect x="196" y="115" width="30" height="13" rx="5" fill="var(--text-tertiary)" stroke="none" opacity="0.55" />
          {/* body */}
          <path d="M40 75 C40 52 52 40 78 38 L210 36 C246 36 268 50 270 75 C268 100 246 114 210 114 L78 112 C52 110 40 98 40 75 Z" fill="var(--bg-primary)" />
          {/* windshield (front, left) */}
          <path d="M108 50 L150 52 L150 98 L108 100 C100 86 100 64 108 50 Z" strokeWidth="1.6" />
          {/* roof */}
          <rect x="150" y="54" width="56" height="42" rx="9" strokeWidth="1.6" />
          {/* rear window */}
          <path d="M206 56 L226 60 C232 70 232 80 226 90 L206 94 Z" strokeWidth="1.6" />
          {/* bonnet crease + centre line */}
          <line x1="56" y1="75" x2="100" y2="75" strokeWidth="1.4" />
          <line x1="150" y1="40" x2="150" y2="110" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
          {/* mirrors */}
          <path d="M104 52 l-9 -5" strokeWidth="2.4" />
          <path d="M104 98 l-9 5" strokeWidth="2.4" />
        </g>
        <text x="64" y="78" fontSize="8" fill="var(--text-tertiary)" textAnchor="middle">FRONT</text>
      </svg>
      {car.defects.map((d) => {
        const sel = selected?.id === d.id;
        const color = d.severity === "major" ? "#E11D48" : "#F59E0B";
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d)}
            className="press"
            style={{
              position: "absolute",
              left: `${d.x}%`,
              top: `${d.y}%`,
              transform: "translate(-50%,-50%)",
              width: sel ? 30 : 24,
              height: sel ? 30 : 24,
              borderRadius: "50%",
              background: color,
              color: "#fff",
              border: sel ? "3px solid #fff" : "2px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              fontWeight: 700,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {d.id}
          </button>
        );
      })}
      {/* legend */}
      <div className="flex items-center gap-4 mt-1">
        <Legend color="#F59E0B" label="Minor" />
        <Legend color="#E11D48" label="Major" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
      <span className="text-label-4-medium text-secondary">{label}</span>
    </div>
  );
}

function DefectDetail({ car, defect }: { car: Car; defect: Defect }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-secondary p-3 mt-3 pop">
      <div style={{ width: 92, height: 70, flexShrink: 0, borderRadius: 10, overflow: "hidden" }}>
        <CarPhoto car={car} frame={defect.id + 2} height="100%" showSilhouette={false} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="rounded-md px-2 py-0.5 text-label-4-semibold"
            style={{ background: defect.severity === "major" ? "#FDE7EC" : "#FEF3C7", color: defect.severity === "major" ? "#E11D48" : "#B45309" }}
          >
            {defect.severity === "major" ? "Major" : "Minor"} · #{defect.id}
          </span>
          <span className="text-label-3-semibold text-primary">{defect.area}</span>
        </div>
        <div className="text-label-3-regular text-secondary">{defect.note}</div>
      </div>
    </div>
  );
}

function PriceIntel({ car }: { car: Car }) {
  // position min bid / fair value / resale on a scale
  const lo = car.minBid * 0.95;
  const hi = car.estResale * 1.03;
  const pct = (v: number) => Math.max(2, Math.min(98, ((v - lo) / (hi - lo)) * 100));
  const margin = car.estResale - car.netLandedCost;
  const markers = [
    { label: "Min bid", value: car.minBid, color: "#4736FE" },
    { label: "Fair value", value: car.fairValue, color: "#7A3DF2" },
    { label: "Est. resale", value: car.estResale, color: "#0E7C66" },
  ];

  return (
    <Section icon="trend" title="Price intelligence" subtitle="Bid with confidence">
      {/* fair value + resale */}
      <div className="grid mb-4" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
        <Stat label="Fair market value" value={fmtL(car.fairValue)} />
        <Stat label="Est. resale" value={fmtL(car.estResale)} />
        <Stat label="Est. margin" value={fmtL(margin)} tone="success" />
      </div>

      {/* scale */}
      <div
        className="mb-4"
        style={{
          borderRadius: 20,
          background: "linear-gradient(180deg,#F8FAFF 0%,#EDF3FA 100%)",
          border: "1px solid rgba(148,163,184,0.24)",
          padding: "16px 14px 14px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-label-2-semibold text-primary">Min bid vs market</div>
            <div className="text-label-4-regular text-secondary">Opening bid, fair value and resale spread</div>
          </div>
          <Tag tone="success">Margin {fmtL(margin)}</Tag>
        </div>
        <div style={{ position: "relative", height: 72, padding: "26px 8px 0" }}>
          <div style={{ position: "absolute", left: 8, right: 8, top: 31, height: 12, borderRadius: 999, background: "#DDE6F0" }} />
          <div
            style={{
              position: "absolute",
              left: `calc(${pct(car.minBid)}% + 0px)`,
              right: `${100 - pct(car.estResale)}%`,
              top: 31,
              height: 12,
              borderRadius: 999,
              background: "linear-gradient(90deg,#4736FE 0%,#7A3DF2 54%,#0E7C66 100%)",
            }}
          />
          {markers.map((d) => (
            <span key={d.label} style={{ position: "absolute", left: `${pct(d.value)}%`, top: 24, transform: "translateX(-50%)" }}>
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: d.color,
                  border: "4px solid #fff",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.24)",
                }}
              />
            </span>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {markers.map((d) => (
            <div key={d.label} className="bg-primary" style={{ borderRadius: 14, padding: "9px 8px", border: "1px solid rgba(148,163,184,0.22)" }}>
              <div className="flex items-center gap-1.5">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                <span className="text-label-4-medium text-secondary" style={{ whiteSpace: "nowrap" }}>{d.label}</span>
              </div>
              <div className="text-label-2-semibold text-primary mt-0.5">{fmtL(d.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* comps */}
      <div className="text-label-3-semibold text-primary mb-2 mt-2">Recent comparable sales</div>
      <div className="flex flex-col gap-2">
        {car.comps.map((c, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5">
            <div>
              <div className="text-label-3-semibold text-primary">{c.variant} · {c.km}</div>
              <div className="text-label-4-regular text-secondary">{c.city} · {c.date}</div>
            </div>
            <div className="text-label-2-semibold text-primary">{fmtL(c.price)}</div>
          </div>
        ))}
      </div>

      {car.type === "ocb" && car.sellerQuote && (
        <div className="flex items-center justify-between rounded-xl bg-warning-subtle px-3.5 py-3 mt-3">
          <span className="text-label-3-medium text-warning-bold">Seller quote</span>
          <span className="text-label-2-semibold text-warning-bold">{fmtL(car.sellerQuote)} · reserve {fmtL(car.reserve)}</span>
        </div>
      )}
    </Section>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div
      className="px-3 py-3"
      style={{
        minWidth: 0,
        borderRadius: 18,
        background: tone === "success" ? "linear-gradient(180deg,#ECFDF3,#DFF7EA)" : "linear-gradient(180deg,#F8FAFC,#EEF3F8)",
        border: "1px solid rgba(148,163,184,0.22)",
      }}
    >
      <div className="text-label-4-medium text-secondary mb-1" style={{ lineHeight: 1.15 }}>{label}</div>
      <div className={`text-heading-h3-bold ${tone === "success" ? "text-success-bold" : "text-primary"}`}>{value}</div>
    </div>
  );
}
