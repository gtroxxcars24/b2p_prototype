import React, { useEffect, useRef, useState } from "react";
import { FEED_CARS, Car, fmtL } from "../data/cars";
import { CarMedia } from "../components/CarMedia";
import { CarPhoto } from "../components/CarPhoto";
import { Icon } from "../components/Icon";
import { Button, GuaranteeBadge, SpecChip, GradeBadge, Tag, Sheet, Cars24OwnedBadge } from "../components/ui";
import { useNav } from "../state/nav";
import { useStore } from "../state/store";
import { useAgents } from "../agents/useAgents";
import { useBid } from "../components/BidFlow";

interface Filters {
  type: "all" | "owned" | "ocb";
  fuel: string;
  trans: string;
  grade: number;
  maxBid: number;
}
const DEFAULT_FILTERS: Filters = { type: "all", fuel: "all", trans: "all", grade: 0, maxBid: 0 };

const AUCTION_SECONDS: Record<string, number> = {
  "creta-2022": 18 * 60 + 24,
  "swift-2021": 23 * 60 + 8,
  "nexon-2020": 31 * 60 + 42,
  "city-2021": 42 * 60 + 15,
};

interface LiveComment {
  dealer: string;
  text: string;
}

const LIVE_COMMENTS: Record<string, LiveComment[]> = {
  "swift-2021": [
    { dealer: "Metro Cars", text: "Any repaint on the front bumper?" },
    { dealer: "Rana Auto", text: "Can you show tyre tread once?" },
    { dealer: "Host", text: "Underbody capture is clean and in report." },
  ],
  "creta-2022": [
    { dealer: "Kohli Motors", text: "Service history authorised?" },
    { dealer: "Prime Wheels", text: "Can we see rear bumper scratch?" },
    { dealer: "Host", text: "Paint meter is original on all panels." },
  ],
  "nexon-2020": [
    { dealer: "Apex Cars", text: "Bonnet repaint reading please?" },
    { dealer: "Sethi Auto", text: "Any engine noise on cold start?" },
    { dealer: "Host", text: "OBD pass, bonnet repaint shown in report." },
  ],
};

const LIVE_COMMENT_SUGGESTIONS = [
  "Show undercarriage",
  "Show dents",
  "Start engine",
  "Show tyres",
];

function initialAuctionSeconds(id: string) {
  if (AUCTION_SECONDS[id]) return AUCTION_SECONDS[id];
  const seed = id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return 14 * 60 + (seed % 1800);
}

function formatAuctionTimer(total: number) {
  const safe = Math.max(0, total);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function filterCars(query: string, filters: Filters) {
  return FEED_CARS.filter((c) => {
    const q = query.trim().toLowerCase();
    if (q && !`${c.make} ${c.model} ${c.variant}`.toLowerCase().includes(q)) return false;
    if (filters.type !== "all" && c.type !== filters.type) return false;
    if (filters.fuel !== "all" && c.fuel !== filters.fuel) return false;
    if (filters.trans !== "all" && c.transmission !== filters.trans) return false;
    if (filters.grade && c.conditionGrade < filters.grade) return false;
    if (filters.maxBid && c.minBid > filters.maxBid) return false;
    return true;
  });
}

function requestedCarLabel(query: string, filters: Filters) {
  return (
    query.trim() ||
    `${filters.type !== "all" ? filters.type.toUpperCase() : "Matching"} ${filters.fuel !== "all" ? filters.fuel : ""} ${filters.trans !== "all" ? filters.trans : ""} car`
      .replace(/\s+/g, " ")
      .trim()
  );
}

function liveCommentsFor(car: Car) {
  return LIVE_COMMENTS[car.id] ?? [
    { dealer: "North Auto", text: "Please confirm tyre condition." },
    { dealer: "Galaxy Motors", text: "Is the report live now?" },
    { dealer: "Host", text: "Full inspection and price intel are available." },
  ];
}

export function Feed() {
  const agents = useAgents();
  const { dispatch } = useStore();
  const didOpen = useRef(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (!didOpen.current) {
      didOpen.current = true;
      const t = setTimeout(() => agents.onAppOpen(), 700);
      return () => clearTimeout(t);
    }
  }, [agents]);

  const activeCount =
    (filters.type !== "all" ? 1 : 0) +
    (filters.fuel !== "all" ? 1 : 0) +
    (filters.trans !== "all" ? 1 : 0) +
    (filters.grade ? 1 : 0) +
    (filters.maxBid ? 1 : 0);

  const cars = filterCars(query, filters);

  const requestCar = () => {
    const requested = requestedCarLabel(query, filters);
    dispatch({
      type: "REQUEST_CAR",
      make: requested,
      budget: filters.maxBid ? `Up to ${fmtL(filters.maxBid)}` : "Flexible",
      note: "Notify for online or offline auction availability",
    });
    agents.toast("Auction", `Request saved — we'll notify you when ${requested} is available online or offline.`);
    agents.say("Auction", `I've added ${requested} to your requested cars. You'll be notified when a matching car is inspected for online or offline auction.`);
  };

  return (
    <div className="feed-screen">
      {/* Search + filter overlay */}
      <div className="feed-search-overlay">
        <div className="flex items-center gap-2 flex-1 rounded-full px-3 feed-search-pill">
          <Icon name="search" size={17} className="text-secondary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search make or model"
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
          onClick={() => setFilterOpen(true)}
          className="press relative flex items-center justify-center rounded-full feed-filter-button"
          style={{ border: activeCount ? "1px solid var(--bg-brand-base)" : "1px solid rgba(255,255,255,0.7)" }}
        >
          <Icon name="filter" size={18} className={activeCount ? "text-brand-base" : "text-primary"} />
          {activeCount > 0 && (
            <span style={{ position: "absolute", top: -4, right: -4, background: "#4736FE", color: "#fff", borderRadius: 9, minWidth: 17, height: 17, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Snap feed */}
      {cars.length > 0 ? (
        <div className="feed" style={{ flex: 1, height: "100%" }}>
          {cars.map((car) => (
            <FeedCard key={car.id} car={car} onView={agents.onCardView} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center px-10" style={{ flex: 1, paddingTop: 160 }}>
          <div className="flex items-center justify-center rounded-full bg-secondary" style={{ width: 64, height: 64 }}>
            <Icon name="search" size={28} className="text-tertiary" />
          </div>
          <div className="text-heading-h5-bold text-primary mt-3">No cars match</div>
          <div className="text-label-3-regular text-secondary mt-1">Request this car and we'll notify you when it appears in an online or offline auction.</div>
          <div className="flex flex-col gap-2.5 w-full mt-4">
            <Button full leftIcon="send" onClick={requestCar}>Request this car</Button>
            <button onClick={() => { setQuery(""); setFilters(DEFAULT_FILTERS); }} className="press text-label-2-semibold text-brand-base" style={{ border: "none", background: "transparent" }}>
              Clear search and filters
            </button>
          </div>
        </div>
      )}

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} />
    </div>
  );
}

export function OnlineAuctions() {
  const agents = useAgents();
  const { dispatch } = useStore();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const activeCount =
    (filters.type !== "all" ? 1 : 0) +
    (filters.fuel !== "all" ? 1 : 0) +
    (filters.trans !== "all" ? 1 : 0) +
    (filters.grade ? 1 : 0) +
    (filters.maxBid ? 1 : 0);
  const cars = filterCars(query, filters);

  const requestCar = () => {
    const requested = requestedCarLabel(query, filters);
    dispatch({
      type: "REQUEST_CAR",
      make: requested,
      budget: filters.maxBid ? `Up to ${fmtL(filters.maxBid)}` : "Flexible",
      note: "Notify for online or offline auction availability",
    });
    agents.toast("Auction", `Request saved — we'll notify you when ${requested} is listed.`);
    agents.say("Auction", `I've added ${requested} to requested cars. You'll be notified when a matching vehicle appears in online or offline auction.`);
  };

  return (
    <div className="online-auctions-screen">
      <div className="feed-search-overlay">
        <div className="flex items-center gap-2 flex-1 rounded-full px-3 feed-search-pill">
          <Icon name="search" size={17} className="text-secondary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search make or model"
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
          onClick={() => setFilterOpen(true)}
          className="press relative flex items-center justify-center rounded-full feed-filter-button"
          style={{ border: activeCount ? "1px solid var(--bg-brand-base)" : "1px solid rgba(255,255,255,0.7)" }}
          type="button"
        >
          <Icon name="filter" size={18} className={activeCount ? "text-brand-base" : "text-primary"} />
          {activeCount > 0 && <span className="online-filter-count">{activeCount}</span>}
        </button>
      </div>

      <div className="scroll-area online-auctions-scroll px-4">
        <div className="online-list-hero">
          <div>
            <div className="text-heading-h4-bold text-primary">Online auctions</div>
            <div className="text-label-3-regular text-secondary">List view for quick scanning, comparison and bidding</div>
          </div>
          <div className="online-list-count">
            <strong>{cars.length}</strong>
            <span>cars</span>
          </div>
        </div>

        {cars.length > 0 ? (
          <div className="online-car-list">
            {cars.map((car) => (
              <OnlineAuctionCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="online-empty-state">
            <div className="flex items-center justify-center rounded-full bg-secondary" style={{ width: 64, height: 64 }}>
              <Icon name="search" size={28} className="text-tertiary" />
            </div>
            <div className="text-heading-h5-bold text-primary mt-3">No online cars match</div>
            <div className="text-label-3-regular text-secondary mt-1">Request this car and we will notify you when it enters online or offline auction.</div>
            <div className="flex flex-col gap-2.5 w-full mt-4">
              <Button full leftIcon="send" onClick={requestCar}>Request this car</Button>
              <button onClick={() => { setQuery(""); setFilters(DEFAULT_FILTERS); }} className="press text-label-2-semibold text-brand-base" style={{ border: "none", background: "transparent" }}>
                Clear search and filters
              </button>
            </div>
          </div>
        )}
        <div style={{ height: 116 }} />
      </div>

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} />
    </div>
  );
}

function OnlineAuctionCard({ car }: { car: Car }) {
  const { push } = useNav();
  const { state } = useStore();
  const { openBid } = useBid();
  const [auctionSeconds, setAuctionSeconds] = useState(() => initialAuctionSeconds(car.id));
  const highest = state.highest[car.id] ?? car.currentHighest;
  const won = state.won.includes(car.id);
  const dealerBid = state.bids[car.id];
  const activeBidders = onlineActiveBidderCount(car, dealerBid != null);
  const openDetail = () => push({ name: "car-detail", params: { id: car.id } });

  useEffect(() => {
    const t = window.setInterval(() => {
      setAuctionSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [car.id]);

  return (
    <div
      className="online-car-card press"
      onClickCapture={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button,input,textarea,select,a")) return;
        openDetail();
      }}
    >
      <button className="online-card-image" onClick={openDetail} type="button">
        <CarPhoto car={car} height="100%" fit="thumb" />
        <span className="online-timer-chip">
          <Icon name="calendar" size={12} />
          {formatAuctionTimer(auctionSeconds)}
        </span>
      </button>

      <div className="online-card-body">
        <div className="flex items-center gap-1.5 mb-1">
          {car.type === "owned" ? <Tag tone="success">Owned stock</Tag> : <Tag tone="ocb">OCB</Tag>}
          {car.demand === "High" && <Tag tone="purple">High demand</Tag>}
        </div>
        <button className="online-card-title press" onClick={openDetail} type="button">
          {car.make} {car.model}
        </button>
        <div className="text-label-4-regular text-secondary">
          {car.variant} · {car.year} · {(car.km / 1000).toFixed(0)}k km
        </div>

        <div className="online-card-bid-row">
          <div>
            <span>Starting bid</span>
            <strong>{fmtL(car.minBid)}</strong>
          </div>
          <div>
            <span>Highest bid</span>
            <strong>{fmtL(highest)}</strong>
          </div>
        </div>

        <div className="online-card-meta">
          <span><Icon name="user" size={12} /> {activeBidders} active bidders</span>
          <span><Icon name="shield" size={12} /> Grade {car.conditionGrade}/5</span>
        </div>

        <div className="online-card-actions">
          {won ? (
            <Button full size="sm" variant="secondary" leftIcon="check" onClick={openDetail}>Won</Button>
          ) : (
            <Button full size="sm" leftIcon="bolt" onClick={() => openBid(car.id)}>Bid</Button>
          )}
          <button className="press online-card-report" onClick={openDetail} type="button">
            Report
          </button>
        </div>
      </div>
    </div>
  );
}

function onlineActiveBidderCount(car: Car, hasDealerBid: boolean) {
  const base = car.demand === "High" ? 16 : car.demand === "Medium" ? 10 : 6;
  return base + (car.type === "owned" ? 2 : 0) + (hasDealerBid ? 1 : 0);
}

function FilterSheet({ open, onClose, filters, setFilters }: { open: boolean; onClose: () => void; filters: Filters; setFilters: (f: Filters) => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Filters">
      <ChipGroup
        label="Lot type"
        value={filters.type}
        options={[{ v: "all", l: "All" }, { v: "owned", l: "Owned" }, { v: "ocb", l: "OCB" }]}
        onPick={(v) => setFilters({ ...filters, type: v as Filters["type"] })}
      />
      <ChipGroup
        label="Fuel"
        value={filters.fuel}
        options={[{ v: "all", l: "All" }, { v: "Petrol", l: "Petrol" }, { v: "Diesel", l: "Diesel" }, { v: "EV", l: "EV" }, { v: "CNG", l: "CNG" }]}
        onPick={(v) => setFilters({ ...filters, fuel: v })}
      />
      <ChipGroup
        label="Transmission"
        value={filters.trans}
        options={[{ v: "all", l: "All" }, { v: "Automatic", l: "Automatic" }, { v: "Manual", l: "Manual" }]}
        onPick={(v) => setFilters({ ...filters, trans: v })}
      />
      <ChipGroup
        label="Min condition grade"
        value={String(filters.grade)}
        options={[{ v: "0", l: "Any" }, { v: "3", l: "3+" }, { v: "4", l: "4+" }, { v: "5", l: "5" }]}
        onPick={(v) => setFilters({ ...filters, grade: Number(v) })}
      />
      <ChipGroup
        label="Max min-bid (budget)"
        value={String(filters.maxBid)}
        options={[{ v: "0", l: "Any" }, { v: "500000", l: "≤ ₹5L" }, { v: "1000000", l: "≤ ₹10L" }, { v: "1500000", l: "≤ ₹15L" }]}
        onPick={(v) => setFilters({ ...filters, maxBid: Number(v) })}
      />
      <div className="flex gap-2 mt-4">
        <div style={{ flex: 1 }}>
          <Button full variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear all</Button>
        </div>
        <div style={{ flex: 1 }}>
          <Button full onClick={onClose}>Show results</Button>
        </div>
      </div>
    </Sheet>
  );
}

function ChipGroup({ label, value, options, onPick }: { label: string; value: string; options: { v: string; l: string }[]; onPick: (v: string) => void }) {
  return (
    <div className="mb-4">
      <div className="text-label-2-semibold text-primary mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.v}
              onClick={() => onPick(o.v)}
              className="press rounded-full px-3.5 py-2 text-label-3-medium"
              style={{
                border: active ? "none" : "1px solid var(--border-secondary)",
                background: active ? "var(--bg-brand-subtle)" : "var(--bg-primary)",
                color: active ? "var(--text-brand-base)" : "var(--text-secondary)",
              }}
            >
              {o.l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FeedCard({ car, onView }: { car: Car; onView: ReturnType<typeof useAgents>["onCardView"] }) {
  const { push } = useNav();
  const { state } = useStore();
  const { openBid } = useBid();
  const ref = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [auctionSeconds, setAuctionSeconds] = useState(() => initialAuctionSeconds(car.id));
  const [reportOpen, setReportOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentFocused, setCommentFocused] = useState(false);
  const [comments, setComments] = useState<LiveComment[]>(() => liveCommentsFor(car));

  const openDetail = () => push({ name: "car-detail", params: { id: car.id } });
  const highest = state.highest[car.id] ?? car.currentHighest;
  const won = state.won.includes(car.id);
  const dealerBid = state.bids[car.id];
  const activeBidders = onlineActiveBidderCount(car, dealerBid != null);
  const visibleComments = comments.slice(-2);

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentDraft.trim();
    if (!text) return;
    setComments((prev) => [...prev.slice(-4), { dealer: "You", text }]);
    setCommentDraft("");
    setCommentFocused(false);
  };

  const askSuggestion = (text: string) => {
    setComments((prev) => [...prev.slice(-4), { dealer: "You", text }]);
    setCommentDraft("");
    setCommentFocused(false);
  };

  useEffect(() => {
    const t = window.setInterval(() => {
      setAuctionSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [car.id]);

  useEffect(() => {
    const seedComments = liveCommentsFor(car);
    let index = 0;
    const t = window.setInterval(() => {
      index = (index + 1) % seedComments.length;
      setComments((prev) => [...prev.slice(-5), seedComments[index]]);
    }, 4200);
    return () => window.clearInterval(t);
  }, [car.id]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.7) {
            onView(car, openDetail);
          }
        });
      },
      { threshold: [0.7] }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car.id]);

  return (
    <div
      ref={ref}
      className="feed-card relative"
      style={{ height: "100%" }}
      onClickCapture={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest(".live-comments,.live-report-panel,.live-report-pip,.live-action-rail,.live-top-badges,.live-bottom-panel")) return;
        if (target.closest("button,input,textarea,select,a")) return;
        openDetail();
      }}
    >
      {/* media fills card; tapping anywhere on the image opens the car detail */}
      <div
        className="absolute inset-0"
        style={{ cursor: "pointer" }}
      >
        <CarMedia car={car} />
      </div>

      <div className="live-top-badges">
        <div className="live-tag-stack">
          <span className="live-status-pill">
            <span className="live-dot" />
            Live now
          </span>
          {car.type === "owned" ? (
            <Cars24OwnedBadge />
          ) : (
            <span className="live-source-pill">OCB · Consumer</span>
          )}
        </div>
      </div>

      <div className="live-action-rail">
        <button
          onClick={() => setLiked((v) => !v)}
          className="press live-action-button"
          type="button"
          aria-label="Save car"
        >
          <Icon name={liked ? "heart-fill" : "heart"} size={20} />
          <span>Save</span>
        </button>
        <button className="press live-action-button" onClick={() => setReportOpen(true)} type="button">
          <Icon name="doc" size={19} />
          <span>Report</span>
        </button>
      </div>

      <div className="live-bottom-panel">
        <div className="live-auction-chips">
          <span><Icon name="calendar" size={13} /> Ends {formatAuctionTimer(auctionSeconds)}</span>
          <span><Icon name="shield" size={13} /> {car.conditionGrade}/5 · {car.conditionLabel}</span>
          {car.demand === "High" && <span>High demand</span>}
        </div>

        <button onClick={openDetail} className="press live-title-block" type="button">
          <div className="text-heading-h2-bold" style={{ color: "#fff" }}>
            {car.make} {car.model}
          </div>
          <div className="text-label-2-regular" style={{ color: "rgba(255,255,255,0.78)" }}>
            {car.variant} · {car.year} · {(car.km / 1000).toFixed(0)}k km
          </div>
        </button>

        <div className="live-bid-strip">
          <div>
            <span>Starting bid</span>
            <strong>{fmtL(car.minBid)}</strong>
          </div>
          <div>
            <span>Highest bid</span>
            <strong>{fmtL(highest)}</strong>
          </div>
          <div>
            <span>Active bidders</span>
            <strong>{activeBidders}</strong>
          </div>
        </div>

        <div className={`live-comments ${commentFocused ? "live-comments--focused" : ""}`}>
          <div className="live-comments-feed" aria-live="polite">
            {visibleComments.map((comment, idx) => (
              <div className="live-comment-row" key={`${comment.dealer}-${comment.text}-${idx}`}>
                <strong>{comment.dealer}</strong>
                <span>{comment.text}</span>
              </div>
            ))}
          </div>
          {commentFocused && (
            <div className="live-comment-suggestions">
              {LIVE_COMMENT_SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => askSuggestion(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <form className="live-comment-form" onSubmit={submitComment}>
            <Icon name="send" size={14} />
            <input
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              onFocus={() => setCommentFocused(true)}
              onBlur={() => window.setTimeout(() => setCommentFocused(false), 140)}
              placeholder="Ask a live question"
            />
            <button type="submit">Ask</button>
          </form>
        </div>

        {won ? (
          <Button full variant="secondary" leftIcon="check" onClick={openDetail}>
            Won — view in Purchased
          </Button>
        ) : (
          <Button full leftIcon="bolt" onClick={() => openBid(car.id)}>
            Place bid
          </Button>
        )}
      </div>

      {reportOpen && (
        <div className="live-report-backdrop" role="dialog" aria-label="Live condition report">
          <div className="live-report-pip">
            <CarPhoto car={car} height="100%" fit="thumb" />
            <span><span className="live-dot" /> Live PIP</span>
          </div>
          <div className="live-report-panel">
            <div className="live-report-handle" />
            <div className="live-report-header">
              <div>
                <div className="text-heading-h4-bold text-primary">Condition report</div>
                <div className="text-label-3-regular text-secondary">
                  Video keeps playing in PIP while you inspect details
                </div>
              </div>
              <button className="press live-report-close" onClick={() => setReportOpen(false)} type="button" aria-label="Close report">
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="live-report-car">
              <div>
                <div className="text-label-4-semibold text-brand-base">{car.type === "owned" ? "CARS24 owned stock" : "OCB consumer car"}</div>
                <div className="text-heading-h5-bold text-primary">
                  {car.make} {car.model}
                </div>
                <div className="text-label-3-regular text-secondary">
                  {car.variant} · {car.year} · {(car.km / 1000).toFixed(0)}k km
                </div>
              </div>
              {car.type === "owned" && <GuaranteeBadge compact />}
            </div>

            <div className="live-report-grid">
              <div>
                <span>Grade</span>
                <strong>{car.conditionGrade}/5</strong>
              </div>
              <div>
                <span>Highest bid</span>
                <strong>{fmtL(highest)}</strong>
              </div>
              <div>
                <span>Active bidders</span>
                <strong>{activeBidders}</strong>
              </div>
            </div>

            <div className="live-report-section">
              <div className="text-label-2-semibold text-primary">Inspection highlights</div>
              <div className="live-report-list">
                <span><Icon name="check" size={14} /> OBD {car.obd2.status}</span>
                <span><Icon name="check" size={14} /> {car.paintMeter}</span>
                <span><Icon name="check" size={14} /> Tyres: {car.tyreTread}</span>
                <span><Icon name="check" size={14} /> Underbody capture available</span>
              </div>
            </div>

            <div className="live-report-section">
              <div className="text-label-2-semibold text-primary">Price intel</div>
              <div className="live-report-price-row">
                <span>Fair value {fmtL(car.fairValue)}</span>
                <span>Est. resale {fmtL(car.estResale)}</span>
              </div>
            </div>

            <Button full variant="secondary" leftIcon="doc" onClick={openDetail}>
              Open full CDP
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function DarkChip({ icon, label }: { icon: any; label: string }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
      style={{ background: "rgba(255,255,255,0.15)", flexShrink: 0 }}
    >
      <Icon name={icon} size={14} style={{ color: "rgba(255,255,255,0.9)" }} />
      <span className="text-label-3-medium" style={{ color: "#fff", whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}
