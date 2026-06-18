import React from "react";
import { Car, carById, fmtL } from "../data/cars";
import { CarPhoto } from "../components/CarPhoto";
import { Icon } from "../components/Icon";
import { Button, Tag, GuaranteeBadge } from "../components/ui";
import { useStore, Purchased as PItem } from "../state/store";
import { useNav } from "../state/nav";
import { useAgents } from "../agents/useAgents";

export function Purchased() {
  const { state } = useStore();
  const { setTab } = useNav();

  if (state.purchased.length === 0) {
    return (
      <div className="utility-screen procurement-screen flex flex-col" style={{ flex: 1 }}>
        <Header />
        <div className="flex flex-col items-center justify-center text-center px-10" style={{ flex: 1 }}>
          <div className="flex items-center justify-center rounded-full bg-secondary" style={{ width: 72, height: 72 }}>
            <Icon name="bag" size={34} className="text-tertiary" />
          </div>
          <div className="text-heading-h4-bold text-primary mt-4">No cars yet</div>
          <div className="text-label-2-regular text-secondary mt-1.5">
            Win a car online or at an auction and it lands here — with live post-procurement tracking.
          </div>
          <div className="mt-5">
            <Button onClick={() => setTab("online")} leftIcon="home">Go to feed</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="utility-screen procurement-screen flex flex-col" style={{ flex: 1, minHeight: 0 }}>
      <Header />
      <div className="scroll-area px-4 py-4 procurement-scroll" style={{ flex: 1 }}>
        <div className="flex flex-col gap-3.5">
          {state.purchased.map((p) => (
            <PurchasedCard key={p.carId} item={p} />
          ))}
        </div>
        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="procurement-header px-4 pt-3 pb-3" style={{ flexShrink: 0 }}>
      <div className="text-heading-h3-bold">Purchased</div>
      <div className="text-label-3-regular">
        Post-procurement, handled by the Concierge agent
      </div>
    </div>
  );
}

function journeyFor(item: PItem, car: Car) {
  if (item.source === "offline") return ["Visit complete", "Won bid", "Token paid", "Stocked in", "Stocked out"];
  if (car.type === "owned") return ["Won bid", "Token paid", "Stocked in", "Stocked out"];
  return ["Won bid", "Seller accepted", "Token paid", "Stocked in", "Stocked out"];
}

function journeyNote(item: PItem, car: Car) {
  if (item.source === "offline") return "Instant delivery path: scan at handoff, gate pass issued, stocked out the same day.";
  if (car.type === "owned") return "CARS24 owned stock skips seller acceptance. Fulfillment is guaranteed once token is paid.";
  return "Seller acceptance is required for OCB. Once accepted, token payment starts procurement.";
}

function PurchasedCard({ item }: { item: PItem }) {
  const car = carById(item.carId);
  const { dispatch } = useStore();
  const { push } = useNav();
  const agents = useAgents();
  if (!car) return null;

  const journey = journeyFor(item, car);
  const step = Math.min(item.step, journey.length - 1);
  const needsToken = item.source === "online" && !item.tokenPaid;
  const sellerCallsUnlocked = car.type === "ocb" && item.tokenPaid;
  const ownedSupportUnlocked = car.type === "owned" && item.tokenPaid;

  const payToken = () => {
    dispatch({ type: "PAY_TOKEN", carId: car.id });
    dispatch({ type: "ADVANCE_PIPELINE", carId: car.id });
    agents.onPostWinOwned(car);
  };

  const advance = () => {
    dispatch({ type: "ADVANCE_PIPELINE", carId: car.id });
    const next = journey[Math.min(step + 1, journey.length - 1)];
    agents.toast("Concierge", `${car.model}: ${next} updated.`);
  };

  const openAgentSupport = () => {
    agents.say(
      "Concierge",
      `${car.make} ${car.model} is CARS24 owned stock. I can help with token status, stocked-in ETA, gate pass, documentation and stock-out timeline.`,
      [{ label: "Human support", action: openHumanSupport, primary: true }],
      true
    );
  };

  const openHumanSupport = () => {
    agents.say(
      "Support",
      `Connecting you to CARS24 support for ${car.make} ${car.model}. No seller coordination is needed on owned stock.`,
      undefined,
      true
    );
    agents.toast("Support", `${car.model}: human support requested.`);
  };

  return (
    <div className="procurement-card rounded-2xl bg-primary overflow-hidden">
      <div className="flex gap-3 p-3">
        <div style={{ width: 96, height: 72, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
          <CarPhoto car={car} height="100%" fit="thumb" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <Tag tone={item.source === "offline" ? "purple" : "brand"}>{item.source === "offline" ? "Auction" : "Online"}</Tag>
            {car.type === "owned" && <Tag tone="success">Fulfillment guaranteed</Tag>}
            {car.type === "ocb" && <Tag tone="ocb">Seller flow</Tag>}
          </div>
          <div className="text-label-1-semibold text-primary">{car.make} {car.model}</div>
          <div className="text-label-4-regular text-secondary">{car.variant} · {car.year}</div>
          <div className="text-label-2-semibold text-brand-base mt-0.5">Won at {fmtL(item.amount ?? car.minBid)}</div>
        </div>
      </div>

      {/* pipeline */}
      <div className="px-3.5 pb-3.5">
        <div className="procurement-status-card">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-label-4-semibold text-secondary">Procurement journey</div>
              <div className="text-label-1-semibold text-primary">{journey[step]}</div>
            </div>
            {item.source === "offline" ? (
              <span className="instant-delivery-pill">
                <Icon name="bolt" size={13} />
                Instant delivery
              </span>
            ) : car.type === "owned" ? (
              <GuaranteeBadge compact />
            ) : (
              <span className="seller-accepted-pill">
                <Icon name="check" size={13} />
                Seller accepted
              </span>
            )}
          </div>
          <div className="text-label-4-regular text-secondary mt-2">{journeyNote(item, car)}</div>
        </div>

        {car.type === "ocb" && (
          <div className={`seller-contact-card ${sellerCallsUnlocked ? "seller-contact-card--unlocked" : ""}`}>
            <div className="flex items-center gap-2.5">
              <div className="seller-contact-avatar">
                <Icon name="user" size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="text-label-2-semibold text-primary">Verified seller chat</div>
                <div className="text-label-4-regular text-secondary">
                  {sellerCallsUnlocked
                    ? "Chat, audio call and video walkthrough are live now."
                    : "Unlocks after token payment. Masked chat and recorded calls."}
                </div>
              </div>
            </div>
            {sellerCallsUnlocked ? (
              <div className="seller-contact-actions">
                <button
                  className="press seller-contact-action seller-contact-action--chat"
                  onClick={() => push({ name: "seller-chat", params: { id: car.id } })}
                  type="button"
                >
                  <Icon name="send" size={15} />
                  Chat
                </button>
                <button
                  className="press seller-contact-action"
                  onClick={() => push({ name: "seller-chat", params: { id: car.id, call: "audio" } })}
                  type="button"
                >
                  <Icon name="phone" size={15} />
                  Audio
                </button>
                <button
                  className="press seller-contact-action seller-contact-action--video"
                  onClick={() => push({ name: "seller-chat", params: { id: car.id, call: "video" } })}
                  type="button"
                >
                  <Icon name="video" size={15} />
                  Video
                </button>
              </div>
            ) : (
              <div className="seller-contact-locked">
                <Icon name="lock" size={13} />
                Pay token to start seller communication
              </div>
            )}
          </div>
        )}

        {car.type === "owned" && (
          <div className={`owned-support-card ${ownedSupportUnlocked ? "owned-support-card--unlocked" : ""}`}>
            <div className="flex items-center gap-2.5">
              <div className="owned-support-avatar">
                <Icon name="bolt" size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="text-label-2-semibold text-primary">CARS24 Concierge support</div>
                <div className="text-label-4-regular text-secondary">
                  {ownedSupportUnlocked
                    ? "AI agent and human support for documents, gate pass and stock-out."
                    : "Unlocks after token payment. No seller chat on CARS24 owned stock."}
                </div>
              </div>
            </div>
            {ownedSupportUnlocked ? (
              <div className="owned-support-actions">
                <button className="press owned-support-action owned-support-action--agent" onClick={openAgentSupport} type="button">
                  <Icon name="bolt" size={15} />
                  Ask agent
                </button>
                <button className="press owned-support-action" onClick={openHumanSupport} type="button">
                  <Icon name="phone" size={15} />
                  Human support
                </button>
              </div>
            ) : (
              <div className="owned-support-locked">
                <Icon name="lock" size={13} />
                Pay token to unlock CARS24 support
              </div>
            )}
          </div>
        )}

        <Pipeline labels={journey} step={step} />
        {needsToken ? (
          <div className="mt-3">
            <div className="flex items-center gap-2 rounded-xl bg-warning-subtle px-3 py-2.5 mb-2.5">
              <Icon name="lock" size={15} className="text-warning-bold" />
              <span className="text-label-3-medium text-warning-bold">Pay the token to start procurement — escrow-protected.</span>
            </div>
            <Button full size="sm" leftIcon="lock" onClick={payToken}>Pay token</Button>
          </div>
        ) : step < journey.length - 1 ? (
          <div className="mt-3">
            <Button full size="sm" variant="secondary" leftIcon="check" onClick={advance}>
              Advance: {journey[step + 1]}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-success-subtle py-2.5 mt-3">
            <Icon name="check" size={16} className="text-success-bold" strokeWidth={2.6} />
            <span className="text-label-2-semibold text-success-bold">Stocked out · drive-out complete</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Pipeline({ labels, step }: { labels: string[]; step: number }) {
  return (
    <div className="flex items-start justify-between mt-1">
      {labels.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center" style={{ width: labels.length > 4 ? 50 : 62 }}>
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 26,
                  height: 26,
                  background: done ? "var(--bg-success-bold)" : active ? "var(--bg-brand-base)" : "var(--bg-secondary)",
                  color: done || active ? "#fff" : "var(--text-tertiary)",
                  border: active ? "3px solid var(--bg-brand-subtle)" : "none",
                }}
              >
                {done ? <Icon name="check" size={14} strokeWidth={2.8} /> : <span className="text-label-4-semibold">{i + 1}</span>}
              </div>
              <span
                className={`text-label-4-${active ? "semibold" : "regular"} text-center mt-1`}
                style={{ color: done ? "var(--text-success-bold)" : active ? "var(--text-brand-base)" : "var(--text-tertiary)", lineHeight: 1.15 }}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? "var(--bg-success-bold)" : "var(--border-secondary)", marginTop: 12 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function Account() {
  return (
    <div className="utility-screen account-screen flex flex-col" style={{ flex: 1, minHeight: 0 }}>
      <div className="scroll-area px-4 py-4 account-scroll" style={{ flex: 1 }}>
        <div className="flex items-center gap-3 rounded-2xl bg-primary p-4 mb-4" style={{ border: "1px solid var(--border-secondary)" }}>
          <div className="flex items-center justify-center rounded-full bg-brand-base" style={{ width: 52, height: 52 }}>
            <Icon name="user" size={26} className="text-primary-inverse" />
          </div>
          <div>
            <div className="text-heading-h4-bold text-primary">Sharma Motors</div>
            <div className="text-label-3-regular text-secondary">Dealer Premium · Delhi NCR</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <Metric label="This month goal" value="10 cars" />
          <Metric label="Budget" value="₹15L" />
          <Metric label="Win rate" value="42%" />
        </div>
        {["Escrow & payments", "Saved searches", "Notifications", "KYC & documents", "Help & support"].map((r) => (
          <button key={r} className="press flex items-center justify-between w-full bg-primary px-4 py-3.5 mb-2 rounded-xl" style={{ border: "1px solid var(--border-secondary)" }}>
            <span className="text-label-1-medium text-primary">{r}</span>
            <Icon name="chevron" size={18} className="text-tertiary" />
          </button>
        ))}
        <div className="text-label-4-regular text-secondary text-center mt-4">
          Prototype · scripted AI agents, no live data (PRD §10.6)
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-primary px-3 py-3" style={{ border: "1px solid var(--border-secondary)" }}>
      <div className="text-heading-h5-bold text-primary">{value}</div>
      <div className="text-label-4-regular text-secondary" style={{ lineHeight: 1.2 }}>{label}</div>
    </div>
  );
}
