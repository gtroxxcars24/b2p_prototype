import React, { useState } from "react";
import { AUCTIONS, CANDIDATES, Auction, Candidate, auctionCars, auctionById } from "../data/auctions";
import { Car, fmtL } from "../data/cars";
import { CarPhoto } from "../components/CarPhoto";
import { Icon, IconName } from "../components/Icon";
import { Button, Tag, SectionTitle } from "../components/ui";
import { Sheet } from "../components/ui";
import { useNav } from "../state/nav";
import { useStore } from "../state/store";
import { useAgents } from "../agents/useAgents";

/** Hero showing a real auction-lot feel: many cars staged together, not a thumbnail grid. */
function CarLotHero({ cars, height, cells = 10 }: { cars: Car[]; height: number; cells?: number }) {
  const items = cars.slice(0, Math.min(cells, cars.length));
  const more = cars.length - items.length;
  const slots = [
    { left: 1, top: 14, width: 34, opacity: 0.72 },
    { left: 22, top: 8, width: 38, opacity: 0.86 },
    { left: 52, top: 12, width: 36, opacity: 0.76 },
    { left: 5, top: 43, width: 42, opacity: 0.96 },
    { left: 34, top: 35, width: 45, opacity: 1 },
    { left: 65, top: 42, width: 39, opacity: 0.94 },
    { left: -7, top: 70, width: 45, opacity: 0.82 },
    { left: 25, top: 67, width: 48, opacity: 0.9 },
    { left: 58, top: 70, width: 45, opacity: 0.84 },
    { left: 77, top: 18, width: 29, opacity: 0.62 },
    { left: 43, top: 3, width: 30, opacity: 0.58 },
    { left: 74, top: 66, width: 34, opacity: 0.7 },
  ];
  return (
    <div
      style={{
        height,
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(90% 85% at 50% 16%, rgba(116,103,255,0.34), transparent 60%), linear-gradient(160deg,#111A31 0%,#10151F 54%,#070A10 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          bottom: -30,
          height: "58%",
          background:
            "radial-gradient(65% 65% at 50% 45%, rgba(255,255,255,0.18), transparent 70%), linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))",
          transform: "perspective(260px) rotateX(58deg)",
          borderRadius: "50%",
        }}
      />
      {items.map((c, i) => {
        const slot = slots[i % slots.length];
        return (
          <LotCar
            key={c.id}
            hue={c.hue}
            opacity={slot.opacity}
            style={{
              position: "absolute",
              left: `${slot.left}%`,
              top: `${slot.top}%`,
              width: `${slot.width}%`,
              filter: "drop-shadow(0 12px 12px rgba(0,0,0,0.48))",
            }}
          />
        );
      })}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,9,16,0.76), transparent 52%)" }} />
      {more > 0 && (
        <div
          className="rounded-full px-2.5 py-1 text-label-4-semibold"
          style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(10,12,24,0.7)", color: "#fff", backdropFilter: "blur(4px)" }}
        >
          +{more} more
        </div>
      )}
    </div>
  );
}

function LotCar({ hue, opacity, style }: { hue: number; opacity: number; style: React.CSSProperties }) {
  const uid = React.useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 240 110" aria-hidden style={{ ...style, opacity }}>
      <defs>
        <linearGradient id={`lot-car-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 38% 92%)`} />
          <stop offset="55%" stopColor={`hsl(${hue} 22% 74%)`} />
          <stop offset="100%" stopColor="hsl(222 18% 48%)" />
        </linearGradient>
      </defs>
      <ellipse cx="124" cy="92" rx="90" ry="11" fill="rgba(0,0,0,0.34)" />
      <path
        d="M18 77 C22 58 32 52 50 49 L73 34 C84 27 99 25 122 25 C153 25 176 31 190 43 L213 51 C228 56 233 64 232 78 L229 86 L21 86 Z"
        fill={`url(#lot-car-${uid})`}
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="2"
      />
      <path d="M76 37 C87 31 101 30 121 30 C144 30 161 34 176 43 L66 46 Z" fill="rgba(15,23,42,0.38)" />
      <path d="M130 34 L152 45 L103 45 L108 34 Z" fill="rgba(15,23,42,0.34)" />
      <circle cx="70" cy="86" r="16" fill="#0A0F1A" />
      <circle cx="185" cy="86" r="16" fill="#0A0F1A" />
      <circle cx="70" cy="86" r="7" fill="rgba(226,232,240,0.75)" />
      <circle cx="185" cy="86" r="7" fill="rgba(226,232,240,0.75)" />
      <path d="M28 76 H52" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
      <path d="M202 76 H226" stroke="rgba(255,255,255,0.32)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ───────────────────────── Offline tab: discovery ───────────────────────── */
export function Offline() {
  const { push } = useNav();
  const { state } = useStore();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ near: false, inspected: true, type: "All" });
  const [query, setQuery] = useState("");

  return (
    <div className="offline-screen flex flex-col" style={{ flex: 1, minHeight: 0 }}>
      <div className="feed-search-overlay">
        <div className="flex items-center gap-2 flex-1 rounded-full px-3 feed-search-pill">
          <Icon name="search" size={17} className="text-secondary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search auctions or area"
            className="flex-1 text-label-2-regular text-primary"
            style={{ border: "none", outline: "none", background: "transparent", minWidth: 0 }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="press text-tertiary" style={{ border: "none", background: "transparent" }}>
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="press relative flex items-center justify-center rounded-full feed-filter-button"
          style={{ border: "1px solid rgba(255,255,255,0.7)" }}
        >
          <Icon name="filter" size={18} className="text-primary" />
        </button>
      </div>
      <div className="scroll-area" style={{ flex: 1 }}>
        <div className="offline-overview">
          <div className="offline-overview-head">
            <div>
              <div className="offline-eyebrow">Offline auction desk</div>
              <div className="offline-title">Venue-ready lots near you</div>
              <div className="offline-subtitle">Inspect on-site, bid live, stock-out the same day.</div>
            </div>
            <span className="offline-live-badge">
              <Icon name="bolt" size={13} />
              Instant delivery
            </span>
          </div>
          <div className="offline-kpi-grid">
            <OfflineKpi value={`${AUCTIONS.reduce((sum, a) => sum + auctionCars(a).length, 0)}`} label="cars across lots" />
            <OfflineKpi value={`${AUCTIONS.length}`} label="confirmed events" />
            <OfflineKpi value="₹2k" label="refundable visit hold" />
          </div>
          <div className="offline-flow-strip">
            <span>Visit</span>
            <i />
            <span>Bid</span>
            <i />
            <span>Gate pass</span>
            <i />
            <span>Drive out</span>
          </div>
        </div>
        {/* filter row */}
        <div className="offline-filter-strip no-scrollbar">
          <button onClick={() => setFiltersOpen(true)} className="press offline-filter-control">
            <Icon name="filter" size={15} className="text-primary" />
            Filters
          </button>
          <FilterChip label="Near me" active={filters.near} onClick={() => setFilters((f) => ({ ...f, near: !f.near }))} />
          <FilterChip label="Inspected" active={filters.inspected} onClick={() => setFilters((f) => ({ ...f, inspected: !f.inspected }))} />
          <FilterChip label="This week" active />
        </div>

        {/* upcoming auctions */}
        <div className="offline-section-head">
          <div>
            <div className="offline-section-title">Confirmed auctions</div>
            <div className="offline-section-subtitle">Prioritized by visit distance and stock-out speed</div>
          </div>
          <span>{AUCTIONS.length}</span>
        </div>
        <div className="offline-auction-list">
          {AUCTIONS.map((a) => (
            <AuctionCard key={a.id} auction={a} booked={state.bookedVisits.includes(a.id)} onClick={() => push({ name: "auction-detail", params: { id: a.id } })} />
          ))}
        </div>

        {/* intent-gated candidates */}
        <div className="px-4 pt-5 pb-2 offline-candidate-head">
          <SectionTitle right={<button onClick={() => push({ name: "candidates" })} className="press text-label-3-semibold text-brand-base" style={{ border: "none", background: "transparent" }}>View all</button>}>
            Help us stock these
          </SectionTitle>
          <div className="text-label-4-regular text-secondary mt-0.5">
            Register interest — we acquire & schedule the auction once enough dealers are in (§8.2).
          </div>
        </div>
        <div className="hscroll px-4 pb-4">
          {CANDIDATES.map((c) => (
            <CandidateMini key={c.id} cand={c} onClick={() => push({ name: "candidates" })} />
          ))}
        </div>
        <div className="px-4 pb-4">
          <RequestCarForm />
        </div>
        <div style={{ height: 80 }} />
      </div>

      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <FilterGroup title="Date & time" options={["Today", "This week", "This month"]} />
        <FilterGroup title="Location" options={["Near me (10km)", "Delhi NCR", "All cities"]} />
        <FilterGroup title="Car type" options={["All", "SUV", "Sedan", "Hatchback"]} />
        <FilterGroup title="Minimum bid" options={["Any", "Under ₹10L", "₹10–20L", "₹20L+"]} />
        <div className="mt-4">
          <Button full onClick={() => setFiltersOpen(false)}>Show results</Button>
        </div>
        <div className="text-label-4-regular text-secondary text-center mt-2">Filters persist across sessions.</div>
      </Sheet>
    </div>
  );
}

function OfflineKpi({ value, label }: { value: string; label: string }) {
  return (
    <div className="offline-kpi">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`press offline-filter-chip ${active ? "offline-filter-chip--active" : ""}`}>
      {label}
    </button>
  );
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="mb-4">
      <div className="text-label-2-semibold text-primary mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <button key={o} onClick={() => setSel(i)} className="press rounded-full px-3.5 py-2 text-label-3-medium" style={{ border: sel === i ? "none" : "1px solid var(--border-secondary)", background: sel === i ? "var(--bg-brand-subtle)" : "var(--bg-primary)", color: sel === i ? "var(--text-brand-base)" : "var(--text-secondary)" }}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function AuctionCard({ auction, booked, onClick }: { auction: Auction; booked: boolean; onClick: () => void }) {
  const cars = auctionCars(auction);
  return (
    <button
      onClick={onClick}
      className="press offline-auction-card"
    >
      <div className="offline-auction-media">
        <CarLotHero cars={cars} height={104} cells={10} />
        <span className="offline-auction-date">{auction.date}</span>
      </div>
      <div className="offline-auction-body">
        <div className="offline-auction-topline">
          {auction.inspected && <span><Icon name="check" size={12} /> Inspected</span>}
          <span><Icon name="bolt" size={12} /> Instant delivery</span>
          {booked && <span className="offline-auction-booked">Booked</span>}
        </div>
        <div className="offline-auction-title">{auction.title}</div>
        <div className="offline-auction-meta">
          <span><Icon name="pin" size={13} /> {auction.venue} · {auction.distanceKm} km</span>
          <span><Icon name="calendar" size={13} /> {auction.time}</span>
        </div>
        <div className="offline-auction-metrics">
          <div>
            <span>Cars in lot</span>
            <strong>{cars.length}</strong>
          </div>
          <div>
            <span>Starting bid</span>
            <strong>{fmtL(auction.startingPrice)}</strong>
          </div>
          <div>
            <span>Stock-out</span>
            <strong>Today</strong>
          </div>
        </div>
        <div className="offline-auction-footer">
          <span>Visit fee refundable before 48h</span>
          <strong>{booked ? "View plan" : "Book visit"} <Icon name="chevron" size={14} /></strong>
        </div>
      </div>
    </button>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: "8px 6px",
        background: "rgba(255,255,255,0.13)",
        border: "1px solid rgba(255,255,255,0.16)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="text-heading-h5-bold">{value}</div>
      <div className="text-label-4-regular" style={{ color: "rgba(255,255,255,0.72)" }}>{label}</div>
    </div>
  );
}

function PostVisitStep({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <div className="post-visit-step">
      <div className="post-visit-step-icon">
        <Icon name={icon} size={15} />
      </div>
      <div>
        <div className="text-label-3-semibold text-primary">{title}</div>
        <div className="text-label-4-regular text-secondary">{text}</div>
      </div>
    </div>
  );
}

function CandidateMini({ cand, onClick }: { cand: Candidate; onClick: () => void }) {
  const { state } = useStore();
  const count = (state.candidateIntent[cand.id] ?? cand.intentCount);
  const pct = Math.min(100, (count / cand.intentThreshold) * 100);
  return (
    <button onClick={onClick} className="press rounded-2xl bg-primary text-left overflow-hidden" style={{ width: 220, flexShrink: 0, border: "1px solid var(--border-secondary)" }}>
      <div style={{ height: 80 }}>
        <CarPhoto car={{ ...(cand as any), id: cand.id, photos: 1, type: "owned" } as Car} height="100%" fit="thumb" />
      </div>
      <div className="p-3">
        <div className="text-label-2-semibold text-primary">{cand.make} {cand.model}</div>
        <div className="text-label-4-regular text-secondary">{cand.variant} · {cand.year}</div>
        <div className="text-label-2-semibold text-brand-base mt-1">~{fmtL(cand.indicativePrice)}</div>
        <div className="mt-2" style={{ height: 5, borderRadius: 3, background: "var(--bg-secondary)" }}>
          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: pct >= 100 ? "var(--bg-success-bold)" : "var(--bg-brand-base)" }} />
        </div>
        <div className="text-label-4-regular text-secondary mt-1">{count}/{cand.intentThreshold} interested</div>
      </div>
    </button>
  );
}

/* ───────────────────────── Auction detail overlay ───────────────────────── */
export function AuctionDetail({ auction }: { auction: Auction }) {
  const { pop, push } = useNav();
  const { state } = useStore();
  const cars = auctionCars(auction);
  const booked = state.bookedVisits.includes(auction.id);
  const checkedIn = state.checkedIn.includes(auction.id);

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col" style={{ zIndex: 30 }}>
      <OverlayHeader title="Auction details" onBack={pop} />
      <div className="scroll-area" style={{ flex: 1 }}>
        <div style={{ height: 168 }}>
        <CarLotHero cars={cars} height={186} cells={12} />
        </div>
        <div className="bg-primary px-4 py-4">
          <div className="flex gap-2 mb-2">
            {auction.inspected && <Tag tone="success">Inspected ✓</Tag>}
            <Tag tone="brand">{auction.area}</Tag>
          </div>
          <div className="text-heading-h2-bold text-primary">{auction.title}</div>
          <InfoRow icon="pin" text={`${auction.venue} · ${auction.distanceKm} km away`} />
          <InfoRow icon="calendar" text={`${auction.date} · ${auction.time}`} />
          <div className="auction-detail-focus-grid">
            <div>
              <span>Cars in lot</span>
              <strong>{cars.length}</strong>
            </div>
            <div>
              <span>Starting bid</span>
              <strong>{fmtL(auction.startingPrice)}</strong>
            </div>
          </div>

          <div className="instant-delivery-card mt-3">
            <div className="flex items-center gap-2">
              <div className="instant-delivery-icon">
                <Icon name="bolt" size={17} />
              </div>
              <div>
                <div className="text-label-1-semibold text-primary">Instant delivery after win</div>
                <div className="text-label-4-regular text-secondary">Inspect, bid, scan plate, get gate pass, stock-out same day.</div>
              </div>
            </div>
            <div className="instant-delivery-steps">
              <span>Visit</span>
              <span>Bid</span>
              <span>Handoff</span>
              <span>Drive out</span>
            </div>
          </div>

          {/* map placeholder */}
          <div className="rounded-xl mt-3 flex items-center justify-center" style={{ height: 92, background: "linear-gradient(135deg,#dbe4ee,#c7d3e0)" }}>
            <div className="flex items-center gap-1.5 text-secondary">
              <Icon name="pin" size={18} /> <span className="text-label-3-semibold">Map & directions</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-3">
          <SectionTitle>Cars in this auction</SectionTitle>
        </div>
        <div className="flex flex-col gap-3 px-4">
          {cars.map((car) => (
            <AuctionCarRow key={car.id} car={car} onClick={() => push({ name: "car-detail", params: { id: car.id } })} />
          ))}
        </div>
        <div style={{ height: 100 }} />
      </div>

      {/* CTA */}
      <div className="bg-primary px-4 py-3 flex gap-3" style={{ flexShrink: 0, borderTop: "1px solid var(--border-secondary)" }}>
        {checkedIn ? (
          <Button full leftIcon="scan" onClick={() => push({ name: "handoff", params: { id: auction.id } })}>
            Open handoff
          </Button>
        ) : booked ? (
          <Button full leftIcon="scan" onClick={() => push({ name: "handoff", params: { id: auction.id } })}>
            Check in at venue
          </Button>
        ) : (
          <Button full leftIcon="calendar" onClick={() => push({ name: "book-visit", params: { id: auction.id } })}>
            Book visit
          </Button>
        )}
      </div>
    </div>
  );
}

function AuctionCarRow({ car, onClick }: { car: Car; onClick: () => void }) {
  return (
    <button onClick={onClick} className="press flex gap-3 rounded-2xl bg-primary p-3 text-left" style={{ border: "1px solid var(--border-secondary)" }}>
      <div style={{ width: 96, height: 72, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
        <CarPhoto car={car} height="100%" fit="thumb" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="text-label-1-semibold text-primary">{car.make} {car.model}</div>
        <div className="text-label-3-regular text-secondary">{car.variant} · {car.year} · {(car.km / 1000).toFixed(0)}k km</div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-label-1-semibold text-brand-base">{fmtL(car.minBid)}</span>
          <span className="rounded-md px-2 py-0.5 text-label-4-semibold bg-secondary text-secondary">Grade {car.conditionGrade}/5</span>
        </div>
      </div>
    </button>
  );
}

/* ───────────────────────── Book visit overlay ───────────────────────── */
export function BookVisit({ auction }: { auction: Auction }) {
  const { pop, setTab, reset } = useNav();
  const { dispatch } = useStore();
  const agents = useAgents();
  const [slot, setSlot] = useState(0);
  const [done, setDone] = useState(false);
  const slots = ["11:00 AM – 1:00 PM", "1:00 PM – 3:00 PM", "3:00 PM – 5:00 PM"];

  const FEE = 2000;
  const book = () => {
    dispatch({ type: "BOOK_VISIT", auctionId: auction.id });
    setDone(true);
    agents.toast("Auction", `Visit booked · refundable ₹${FEE.toLocaleString("en-IN")} fee held in escrow. Reminder T-1 day.`);
  };

  if (done) {
    return (
      <div className="absolute inset-0 bg-primary flex flex-col items-center justify-center px-8 text-center" style={{ zIndex: 35 }}>
        <div className="flex items-center justify-center rounded-full bg-success-subtle pop" style={{ width: 72, height: 72 }}>
          <Icon name="check" size={38} className="text-success-bold" strokeWidth={2.6} />
        </div>
        <div className="text-heading-h2-bold text-primary mt-5">Visit booked!</div>
        <div className="text-label-2-regular text-secondary mt-2">
          {auction.date} · {slots[slot]}<br />{auction.venue}
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-secondary px-3.5 py-3 mt-5">
          <Icon name="calendar" size={18} className="text-brand-base" />
          <span className="text-label-3-medium text-primary">Added to calendar · reminders on</span>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-success-subtle px-3.5 py-3 mt-2.5 text-left">
          <Icon name="lock" size={16} className="text-success-bold" style={{ marginTop: 1 }} />
          <span className="text-label-3-regular text-success-bold">
            ₹2,000 minimal booking fee held in escrow — fully refundable if you cancel before 48 hours, and adjusted against your winning bid.
          </span>
        </div>
        <div className="w-full mt-7 flex flex-col gap-2.5">
          <Button full onClick={() => { reset(); }}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col" style={{ zIndex: 35 }}>
      <OverlayHeader title="Book visit" onBack={pop} />
      <div className="scroll-area px-4 py-4" style={{ flex: 1 }}>
        <div className="rounded-2xl bg-primary p-4" style={{ border: "1px solid var(--border-secondary)" }}>
          <div className="text-heading-h5-bold text-primary">{auction.title}</div>
          <InfoRow icon="pin" text={auction.venue} />
          <InfoRow icon="calendar" text={auction.date} />
          <div className="instant-delivery-card mt-3">
            <div className="flex items-center gap-2">
              <Icon name="bolt" size={17} className="text-brand-base" />
              <div>
                <div className="text-label-2-semibold text-primary">Post-visit flow</div>
                <div className="text-label-4-regular text-secondary">After inspection: shortlist, join live auction, win, scan plate and drive out today.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-label-2-semibold text-primary mt-5 mb-2">Choose a slot</div>
        <div className="flex flex-col gap-2.5">
          {slots.map((s, i) => (
            <button key={s} onClick={() => setSlot(i)} className="press flex items-center justify-between rounded-xl px-4 py-3.5" style={{ border: slot === i ? "2px solid var(--bg-brand-base)" : "1px solid var(--border-secondary)", background: "var(--bg-primary)" }}>
              <span className="text-label-1-medium text-primary">{s}</span>
              {slot === i && <Icon name="check" size={18} className="text-brand-base" strokeWidth={2.6} />}
            </button>
          ))}
        </div>

        {/* refundable booking fee */}
        <div className="rounded-2xl bg-primary p-4 mt-5" style={{ border: "1px solid var(--border-secondary)" }}>
          <div className="flex items-center justify-between">
            <span className="text-label-2-semibold text-primary">Minimal refundable booking fee</span>
            <span className="text-heading-h4-bold text-brand-base">₹2,000</span>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <Icon name="shield" size={15} className="text-success-bold" style={{ marginTop: 1 }} />
            <span className="text-label-3-regular text-secondary">
              Held in escrow to firm up turnout. <span className="text-success-bold text-label-3-semibold">100% refundable</span> if cancelled before 48 hours, and adjusted against your winning bid at the auction.
            </span>
          </div>
        </div>
      </div>
      <div className="bg-primary px-4 py-3" style={{ flexShrink: 0, borderTop: "1px solid var(--border-secondary)" }}>
        <Button full leftIcon="lock" onClick={book}>Pay refundable ₹2,000 & confirm visit</Button>
      </div>
    </div>
  );
}

/* ───────────────────────── At-venue handoff overlay ───────────────────────── */
export function Handoff({ auction }: { auction: Auction }) {
  const { pop, setTab } = useNav();
  const { state, dispatch } = useStore();
  const agents = useAgents();
  const cars = auctionCars(auction);
  const wonCar = cars[0]; // demo: dealer wins the first lot live
  const shortlistedCars = cars.slice(0, 3);
  const [phase, setPhase] = useState<"checkin" | "postvisit" | "lots" | "scanning" | "approved">(
    state.checkedIn.includes(auction.id) ? "postvisit" : "checkin"
  );

  const checkIn = () => {
    dispatch({ type: "CHECK_IN", auctionId: auction.id });
    setPhase("postvisit");
  };

  const scan = () => {
    setPhase("scanning");
    setTimeout(() => {
      dispatch({ type: "SET_WON", carId: wonCar.id });
      dispatch({ type: "ADD_PURCHASED", item: { carId: wonCar.id, source: "offline", tokenPaid: true, step: 3, amount: state.highest[wonCar.id] ?? wonCar.currentHighest } });
      agents.onPlateScanned(wonCar);
      setPhase("approved");
    }, 1800);
  };

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col" style={{ zIndex: 35 }}>
      <OverlayHeader title="At-venue handoff" onBack={pop} />
      <div className="scroll-area px-4 py-4" style={{ flex: 1 }}>
        {phase === "checkin" && (
          <div className="flex flex-col items-center text-center pt-6">
            <div className="rounded-2xl bg-primary p-6" style={{ border: "1px solid var(--border-secondary)" }}>
              <div className="flex items-center justify-center mx-auto rounded-2xl bg-secondary" style={{ width: 150, height: 150 }}>
                <Icon name="scan" size={80} className="text-primary" />
              </div>
              <div className="text-label-3-regular text-secondary mt-3">Booking ref · CARS24-{auction.id.slice(0, 4).toUpperCase()}-2291</div>
            </div>
            <div className="text-heading-h3-bold text-primary mt-5">Check in at the venue</div>
            <div className="text-label-2-regular text-secondary mt-1.5 px-4">
              Show this QR at the entrance, inspect cars, then move into the post-visit bidding plan.
            </div>
            <div className="post-visit-mini-flow w-full mt-5">
              <PostVisitStep icon="scan" title="Inspect" text="Verify condition on ground" />
              <PostVisitStep icon="gavel" title="Bid" text="Join live lots after visit" />
              <PostVisitStep icon="bolt" title="Drive out" text="Instant delivery on win" />
            </div>
            <div className="w-full mt-6">
              <Button full leftIcon="check" onClick={checkIn}>Check in & start visit</Button>
            </div>
          </div>
        )}

        {phase === "postvisit" && (
          <div className="pt-1">
            <div className="flex items-center gap-2 rounded-xl bg-success-subtle px-3.5 py-2.5 mb-4">
              <Icon name="check" size={16} className="text-success-bold" strokeWidth={2.6} />
              <span className="text-label-3-semibold text-success-bold">Visit complete · {auction.venue}</span>
            </div>

            <div className="post-visit-hero">
              <div className="flex items-center gap-2">
                <div className="instant-delivery-icon">
                  <Icon name="bolt" size={18} />
                </div>
                <div>
                  <div className="text-heading-h4-bold">Ready for instant delivery</div>
                  <div className="text-label-3-regular" style={{ color: "rgba(255,255,255,0.76)" }}>
                    Win a lot, scan the plate at handoff, gate pass opens, stock-out today.
                  </div>
                </div>
              </div>
              <div className="grid mt-4" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                <HeroMetric value={`${shortlistedCars.length}`} label="shortlisted" />
                <HeroMetric value="0 min" label="seller wait" />
                <HeroMetric value="Today" label="delivery" />
              </div>
            </div>

            <div className="text-label-2-semibold text-primary mt-5 mb-2">Your post-visit shortlist</div>
            <div className="flex flex-col gap-2.5">
              {shortlistedCars.map((car, i) => (
                <div key={car.id} className="flex items-center gap-3 rounded-2xl bg-primary p-3" style={{ border: "1px solid var(--border-secondary)" }}>
                  <div style={{ width: 70, height: 52, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                    <CarPhoto car={car} height="100%" fit="thumb" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-label-2-semibold text-primary">{car.make} {car.model}</div>
                    <div className="text-label-4-regular text-secondary">Priority #{i + 1} · max bid guided by price intel</div>
                  </div>
                  <span className="text-label-3-semibold text-brand-base">{fmtL(car.minBid)}</span>
                </div>
              ))}
            </div>

            <div className="instant-delivery-card mt-4">
              <div className="text-label-2-semibold text-primary">What happens after you win</div>
              <div className="post-visit-roadmap mt-3">
                <PostVisitStep icon="gavel" title="Won bid" text="Auctioneer confirms lot" />
                <PostVisitStep icon="lock" title="Token paid" text="Escrow release begins" />
                <PostVisitStep icon="scan" title="Handoff" text="Plate scan + gate pass" />
                <PostVisitStep icon="bag" title="Stocked out" text="Drive out today" />
              </div>
            </div>

            <div className="mt-5">
              <Button full leftIcon="gavel" onClick={() => setPhase("lots")}>Enter live auction</Button>
            </div>
          </div>
        )}

        {(phase === "lots" || phase === "scanning") && (
          <>
            <div className="flex items-center gap-2 rounded-xl bg-success-subtle px-3.5 py-2.5 mb-4">
              <Icon name="check" size={16} className="text-success-bold" strokeWidth={2.6} />
              <span className="text-label-3-semibold text-success-bold">Checked in · {auction.venue}</span>
            </div>

            <div className="text-label-2-semibold text-primary mb-2">Your lot schedule</div>
            <div className="flex flex-col gap-3">
              {cars.map((car, i) => (
                <div key={car.id} className="flex gap-3 rounded-2xl bg-primary p-3" style={{ border: "1px solid var(--border-secondary)" }}>
                  <div style={{ width: 80, height: 60, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                    <CarPhoto car={car} height="100%" fit="thumb" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="text-label-2-semibold text-primary">{car.make} {car.model}</div>
                    <div className="text-label-4-regular text-secondary">Lot #{i + 1} · live now</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-label-3-semibold text-brand-base">Highest {fmtL((state.highest[car.id] ?? car.currentHighest))}</span>
                      {i === 0 && <Tag tone="success">You're top</Tag>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-brand-subtle p-4 mt-5 text-center">
              <div className="text-heading-h5-bold text-primary">Won a lot? Instant handoff starts here</div>
              <div className="text-label-3-regular text-secondary mt-1 mb-3">
                OCR/ANPR matches the car to your won lot, then CARS24 issues a gate pass for same-day stock-out.
              </div>
              <Button full leftIcon="scan" onClick={scan}>
                {phase === "scanning" ? "Scanning plate…" : "Scan number plate"}
              </Button>
            </div>

            {phase === "scanning" && (
              <div className="flex flex-col items-center mt-5">
                <div className="rounded-2xl overflow-hidden" style={{ width: 200, height: 130, position: "relative", background: "#15131c" }}>
                  <CarPhoto car={wonCar} height="100%" showSilhouette fit="thumb" />
                  <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "#22D3EE", boxShadow: "0 0 12px #22D3EE", animation: "scanline 1.4s ease-in-out infinite" }} />
                  <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", background: "#fff", borderRadius: 4, padding: "2px 10px", fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>
                    DL 3C AB 1234
                  </div>
                </div>
                <div className="text-label-3-medium text-secondary mt-2">Matching plate to won lot…</div>
              </div>
            )}
          </>
        )}

        {phase === "approved" && (
          <div className="flex flex-col items-center text-center pt-8">
            <div className="flex items-center justify-center rounded-full bg-success-subtle pop" style={{ width: 76, height: 76 }}>
              <Icon name="check" size={40} className="text-success-bold" strokeWidth={2.6} />
            </div>
            <div className="text-heading-h2-bold text-primary mt-5">Added to Purchased</div>
            <div className="text-label-2-regular text-secondary mt-2 px-4">
              Plate matched · token paid · stocked in. Gate pass is ready, so this can be stocked out today.
            </div>
            <div className="rounded-2xl bg-primary p-3 mt-5 w-full flex gap-3 items-center" style={{ border: "1px solid var(--border-secondary)" }}>
              <div style={{ width: 70, height: 54, borderRadius: 10, overflow: "hidden" }}>
                <CarPhoto car={wonCar} height="100%" fit="thumb" />
              </div>
              <div className="text-left">
                <div className="text-label-2-semibold text-primary">{wonCar.make} {wonCar.model}</div>
                <div className="text-label-4-regular text-secondary">Status · stocked in → ready for stock-out</div>
              </div>
            </div>
            <div className="w-full mt-6">
              <Button full leftIcon="bag" onClick={() => setTab("purchased")}>Track in Purchased</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Candidates / intent overlay ───────────────────────── */
export function Candidates() {
  const { pop } = useNav();
  const { state, dispatch } = useStore();
  const agents = useAgents();

  const registerIntent = (c: Candidate) => {
    if (state.intentRegistered.includes(c.id)) return;
    dispatch({ type: "REGISTER_INTENT", candidateId: c.id });
    const newCount = (state.candidateIntent[c.id] ?? c.intentCount) + 1;
    if (newCount >= c.intentThreshold) {
      // intent cleared threshold → Auction agent confirms (§10.7)
      const fakeAuction = { id: "elite-pragati", date: "Sat, 21 Jun", venue: "Pragati Maidan, Hall 7", area: c.model } as any;
      setTimeout(() => agents.onIntentThreshold(fakeAuction, () => {}), 400);
    } else {
      agents.toast("Auction", `Noted your interest in the ${c.model}. ${c.intentThreshold - newCount} more to confirm the auction.`);
    }
  };

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col" style={{ zIndex: 30 }}>
      <OverlayHeader title="Help us stock these" onBack={pop} />
      <div className="scroll-area px-4 py-4" style={{ flex: 1 }}>
        <div className="flex items-start gap-2 rounded-xl bg-brand-subtle px-3.5 py-3 mb-4">
          <Icon name="info" size={16} className="text-brand-base" style={{ marginTop: 1 }} />
          <span className="text-label-3-regular text-primary">
            Non-binding interest. Once enough dealers are in, CARS24 acquires the stock and schedules the auction — no capital committed below threshold (§8.2).
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {CANDIDATES.map((c) => {
            const count = state.candidateIntent[c.id] ?? c.intentCount;
            const registered = state.intentRegistered.includes(c.id);
            const pct = Math.min(100, (count / c.intentThreshold) * 100);
            const cleared = count >= c.intentThreshold;
            return (
              <div key={c.id} className="rounded-2xl bg-primary overflow-hidden" style={{ border: "1px solid var(--border-secondary)" }}>
                <div className="flex gap-3 p-3">
                  <div style={{ width: 96, height: 72, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                    <CarPhoto car={{ ...(c as any), id: c.id, photos: 1, type: "owned" } as Car} height="100%" fit="thumb" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="text-label-1-semibold text-primary">{c.make} {c.model}</div>
                    <div className="text-label-4-regular text-secondary">{c.variant} · {c.year} · {(c.km / 1000).toFixed(0)}k km</div>
                    <div className="text-label-2-semibold text-brand-base mt-0.5">Indicative ~{fmtL(c.indicativePrice)}</div>
                    <span className="rounded-md px-2 py-0.5 text-label-4-semibold bg-secondary text-secondary mt-1 inline-block">Inspected · Grade {c.conditionGrade}/5</span>
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-label-4-medium text-secondary">Auction-readiness</span>
                    <span className={`text-label-4-semibold ${cleared ? "text-success-bold" : "text-secondary"}`}>{count}/{c.intentThreshold} {cleared ? "· confirmed" : ""}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--bg-secondary)" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: cleared ? "var(--bg-success-bold)" : "var(--bg-brand-base)", transition: "width 0.4s" }} />
                  </div>
                  <div className="mt-2.5">
                    {registered ? (
                      <Button full variant="secondary" size="sm" leftIcon="check">Interest registered</Button>
                    ) : (
                      <Button full size="sm" leftIcon="plus" onClick={() => registerIntent(c)}>I'm interested</Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <RequestCarForm />

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

function RequestCarForm() {
  const { state, dispatch } = useStore();
  const agents = useAgents();
  const [make, setMake] = useState("");
  const [budget, setBudget] = useState("");
  const [note, setNote] = useState("");

  const submit = () => {
    if (!make.trim()) return;
    dispatch({ type: "REQUEST_CAR", make: make.trim(), budget: budget.trim(), note: note.trim() });
    agents.toast("Auction", `Got it — sourcing a ${make.trim()} for you. We'll alert you when one's inspected & ready.`);
    setMake("");
    setBudget("");
    setNote("");
  };

  const inputStyle: React.CSSProperties = {
    border: "1px solid var(--border-secondary)",
    outline: "none",
    background: "var(--bg-primary)",
    width: "100%",
    borderRadius: 12,
    padding: "11px 13px",
  };

  return (
    <div
      className="mt-5 p-4"
      style={{
        borderRadius: 22,
        border: "1px solid rgba(71,54,254,0.2)",
        background:
          "radial-gradient(90% 90% at 100% 0%, rgba(71,54,254,0.16), transparent 45%), linear-gradient(180deg,#FFFFFF 0%,#F5F7FF 100%)",
        boxShadow: "0 14px 30px rgba(71,54,254,0.1)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center justify-center rounded-full bg-brand-base" style={{ width: 30, height: 30, flexShrink: 0 }}>
          <Icon name="search" size={15} className="text-primary-inverse" />
        </div>
        <div className="text-heading-h4-bold text-primary">Request a car</div>
      </div>
      <div className="text-label-3-regular text-secondary mb-3">
        Tell us the make, budget and must-haves. The auction agent will source, inspect and add matching cars to upcoming lots.
      </div>
      <div className="flex flex-col gap-2.5">
        <input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Make & model (e.g. Toyota Fortuner)" className="text-label-2-regular text-primary" style={inputStyle} />
        <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget (e.g. ₹25–30L)" className="text-label-2-regular text-primary" style={inputStyle} />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes — year, fuel, colour (optional)" className="text-label-2-regular text-primary" style={inputStyle} />
        <Button full leftIcon="send" onClick={submit} disabled={!make.trim()}>Submit request</Button>
      </div>

      {state.carRequests.length > 0 && (
        <div className="mt-4">
          <div className="text-label-3-semibold text-primary mb-2">Your requests</div>
          <div className="flex flex-col gap-2">
            {state.carRequests.map((r, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2.5" style={{ border: "1px solid var(--border-secondary)" }}>
                <div className="flex items-center justify-center rounded-full bg-warning-subtle" style={{ width: 26, height: 26, flexShrink: 0 }}>
                  <Icon name="search" size={13} className="text-warning-bold" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-label-3-semibold text-primary">{r.make}{r.budget ? ` · ${r.budget}` : ""}</div>
                  <div className="text-label-4-regular text-secondary">Sourcing in progress{r.note ? ` · ${r.note}` : ""}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* shared bits */
function OverlayHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-primary" style={{ flexShrink: 0, borderBottom: "1px solid var(--border-secondary)" }}>
      <button className="press text-primary" onClick={onBack} style={{ border: "none", background: "transparent" }}>
        <Icon name="back" size={22} />
      </button>
      <div className="text-heading-h5-bold text-primary">{title}</div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: IconName; text: string }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Icon name={icon} size={15} className="text-secondary" />
      <span className="text-label-3-regular text-secondary">{text}</span>
    </div>
  );
}
