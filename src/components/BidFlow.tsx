import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Car, carById, fmtL, fmtRs } from "../data/cars";
import { useStore } from "../state/store";
import { useNav } from "../state/nav";
import { useAgents } from "../agents/useAgents";
import { Icon } from "./Icon";
import { Button, GuaranteeBadge } from "./ui";

interface BidCtx {
  openBid: (carId: string) => void;
}
const Ctx = createContext<BidCtx | null>(null);
export function useBid() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBid within BidProvider");
  return c;
}

type Step = "confirm" | "placed" | "outbid" | "won" | "ocb-pending";

export function BidProvider({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const { setTab } = useNav();
  const agents = useAgents();

  const [carId, setCarId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("confirm");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [autoOn, setAutoOn] = useState(false);
  const [autoMax, setAutoMax] = useState(0);
  const [wonInfo, setWonInfo] = useState<{ amount: number; auto: boolean }>({ amount: 0, auto: false });
  const outbidOnce = useRef<Set<string>>(new Set());

  const car = carId ? carById(carId) : null;
  const highest = car ? state.highest[car.id] ?? car.currentHighest : 0;
  const floor = car ? Math.max(car.minBid, highest + car.increment) : 0;

  const openBid = useCallback(
    (id: string) => {
      const c = carById(id);
      if (!c) return;
      const h = state.highest[c.id] ?? c.currentHighest;
      const f = Math.max(c.minBid, h + c.increment);
      setCarId(id);
      setStep("confirm");
      setAmount(f);
      setError(null);
      setAutoOn(state.autoBid[c.id] != null);
      setAutoMax(state.autoBid[c.id] ?? f + c.increment * 6);
      agents.onBidOpen(c);
    },
    [agents, state.highest, state.autoBid]
  );

  const close = useCallback(() => setCarId(null), []);

  const step1 = car?.increment ?? 5000;
  const auctionTimeLeft = "18m 24s";
  const autoSteps = car ? Math.max(0, Math.floor((autoMax - amount) / step1)) : 0;
  const increaseNowAmount = amount + step1;

  function win(c: Car, finalAmount: number, auto = false) {
    dispatch({ type: "SET_WON", carId: c.id });
    dispatch({
      type: "ADD_PURCHASED",
      item: { carId: c.id, source: "online", tokenPaid: false, step: c.type === "ocb" ? 1 : 0, amount: finalAmount },
    });
    setWonInfo({ amount: finalAmount, auto });
    setStep("won");
    if (c.type === "owned") agents.onWonTokenUnpaid(c, () => payToken(c));
  }

  const confirm = useCallback(() => {
    if (!car) return;
    if (amount < floor) {
      setError(`Must be at least ${fmtL(floor)} (current highest + increment)`);
      return;
    }
    // escrow hold + record bid
    dispatch({ type: "PLACE_BID", carId: car.id, amount, highest: amount });
    // persist the auto-bid preference for this lot
    dispatch({ type: "SET_AUTOBID", carId: car.id, max: autoOn ? autoMax : null });

    // First bid on a lot: simulate a rival outbid to demo the raise flow.
    if (!outbidOnce.current.has(car.id)) {
      outbidOnce.current.add(car.id);
      setStep("placed");
      const rival = amount + car.increment;
      setTimeout(() => {
        dispatch({ type: "PLACE_BID", carId: car.id, amount, highest: rival });
        const counter = rival + car.increment;
        // Auto-bid: re-enter automatically up to the dealer's cap — no manual action.
        if (autoOn && counter <= autoMax) {
          dispatch({ type: "PLACE_BID", carId: car.id, amount: counter, highest: counter });
          setAmount(counter);
          agents.toast("PA", `Auto-bid kept you on top at ${fmtL(counter)} — no action needed.`);
          if (car.type === "owned" || counter >= car.reserve) {
            win(car, counter, true);
          } else {
            setStep("ocb-pending");
          }
          return;
        }
        // Otherwise fall back to manual raise.
        setAmount(counter);
        setError(null);
        setStep("outbid");
        agents.toast("PA", `Outbid on ${car.model} — increase to ${fmtL(counter)} to stay in.`, 6000);
        agents.onOutbid(car, counter, () => {
          setAmount(counter);
          setError(null);
          setStep("confirm");
          setCarId(car.id);
        });
        if (autoOn) {
          agents.toast("PA", `Auto-bid cap ${fmtL(autoMax)} reached — raise manually to stay in.`);
        }
      }, 1400);
      return;
    }

    // Subsequent (raised) bid wins.
    if (car.type === "owned" || amount >= car.reserve) {
      win(car, amount);
    } else {
      setStep("ocb-pending");
    }
  }, [car, amount, floor, autoOn, autoMax, dispatch, agents]);

  const increaseWhileLeading = useCallback(() => {
    if (!car) return;
    const nextAmount = amount + step1;
    setAmount(nextAmount);
    setError(null);
    dispatch({ type: "PLACE_BID", carId: car.id, amount: nextAmount, highest: nextAmount });
    dispatch({ type: "SET_AUTOBID", carId: car.id, max: autoOn ? Math.max(autoMax, nextAmount + car.increment) : null });
    agents.toast("PA", `Bid increased to ${fmtL(nextAmount)}. You're still highest for now.`);
  }, [agents, amount, autoMax, autoOn, car, dispatch, step1]);

  function payToken(c: Car) {
    dispatch({ type: "PAY_TOKEN", carId: c.id });
    dispatch({ type: "ADVANCE_PIPELINE", carId: c.id });
    agents.onPostWinOwned(c);
    close();
    setTab("purchased");
  }

  return (
    <Ctx.Provider value={{ openBid }}>
      {children}
      {car && (
        <>
          <div className="sheet-backdrop" onClick={close} />
          {step === "won" ? (
            <WonCard car={car} amount={wonInfo.amount} auto={wonInfo.auto} onPayToken={() => payToken(car)} onClose={() => { close(); setTab("purchased"); }} />
          ) : step === "ocb-pending" ? (
            <OcbPendingCard car={car} onClose={close} />
          ) : (
            <div className="sheet" style={{ paddingBottom: 16 }}>
              <Header car={car} onClose={close} />
              <div className="scroll-area px-5 pb-2">
                <div className="bid-live-strip mb-3">
                  <div className="flex items-center gap-1.5">
                    <Icon name="calendar" size={15} />
                    <span>Live auction</span>
                  </div>
                  <strong>Ends in {auctionTimeLeft}</strong>
                </div>

                {step === "placed" && (
                  <div className="bid-status-card bid-status-card--leading mb-3">
                    <div className="flex items-center gap-2">
                      <Icon name="check" size={16} />
                      <span className="text-label-2-semibold">You're highest right now</span>
                    </div>
                    <div className="text-label-3-regular mt-1">
                      Auction is still live. Increase your bid or switch on auto-bid with step cover below.
                    </div>
                  </div>
                )}

                {step === "outbid" && (
                  <div className="flex items-center gap-2 rounded-xl bg-danger-subtler px-3.5 py-2.5 mb-3">
                    <Icon name="bolt" size={16} className="text-danger-base" />
                    <span className="text-label-3-semibold text-danger-base">
                      You've been outbid — new highest {fmtL(highest)}
                    </span>
                  </div>
                )}

                {/* Amount + stepper */}
                <div className="text-label-3-medium text-secondary mb-1.5">Your bid</div>
                <div className="flex items-center justify-between rounded-2xl bg-secondary px-3 py-3 mb-1">
                  <button
                    className="press flex items-center justify-center rounded-full bg-primary"
                    style={{ width: 40, height: 40, border: "1px solid var(--border-secondary)" }}
                    onClick={() => { setAmount((a) => Math.max(floor, a - step1)); setError(null); }}
                  >
                    <Icon name="minus" size={18} className="text-primary" />
                  </button>
                  <div className="text-center">
                    <div className="text-heading-h1-bold text-primary">{fmtL(amount)}</div>
                    <div className="text-label-4-regular text-secondary">{fmtRs(amount)}</div>
                  </div>
                  <button
                    className="press flex items-center justify-center rounded-full bg-brand-base"
                    style={{ width: 40, height: 40, border: "none" }}
                    onClick={() => { setAmount((a) => a + step1); setError(null); }}
                  >
                    <Icon name="plus" size={18} className="text-primary-inverse" />
                  </button>
                </div>
                {error ? (
                  <div className="text-label-4-medium text-danger-base mb-2">{error}</div>
                ) : (
                  <div className="text-label-4-regular text-secondary mb-2">
                    Min {fmtL(floor)} · increment {fmtRs(car.increment)}
                  </div>
                )}

                {/* Auto-bid */}
                <div className="rounded-xl mt-2" style={{ border: autoOn ? "1px solid var(--bg-brand-base)" : "1px solid var(--border-secondary)", overflow: "hidden" }}>
                  <button
                    className="press flex items-center justify-between w-full px-3.5 py-3"
                    style={{ border: "none", background: autoOn ? "var(--bg-brand-subtle)" : "var(--bg-primary)" }}
                    onClick={() => {
                      const next = !autoOn;
                      setAutoOn(next);
                      if (next) setAutoMax((m) => Math.max(m, amount + car.increment));
                    }}
                  >
                    <div className="flex items-center gap-2 text-left">
                      <Icon name="bolt" size={16} className={autoOn ? "text-brand-base" : "text-secondary"} />
                      <div>
                        <div className="text-label-2-semibold text-primary">Auto-bid</div>
                        <div className="text-label-4-regular text-secondary">
                          {autoOn
                            ? `Active · covers ${autoSteps} raise step${autoSteps === 1 ? "" : "s"} of ${fmtRs(car.increment)}`
                            : `Activate to cover ${Math.max(autoSteps, 1)} raise steps of ${fmtRs(car.increment)}`}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        width: 42,
                        height: 24,
                        borderRadius: 12,
                        background: autoOn ? "var(--bg-brand-base)" : "var(--border-secondary)",
                        position: "relative",
                        flexShrink: 0,
                        transition: "background 0.15s",
                      }}
                    >
                      <span style={{ position: "absolute", top: 2, left: autoOn ? 20 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
                    </span>
                  </button>
                  {autoOn && (
                    <div className="flex items-center justify-between px-3.5 py-3" style={{ borderTop: "1px solid var(--border-secondary)" }}>
                      <div>
                        <div className="text-label-3-medium text-secondary">Max auto-bid</div>
                        <div className="text-label-4-regular text-secondary">{autoSteps} step{autoSteps === 1 ? "" : "s"} left at {fmtRs(car.increment)}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="press flex items-center justify-center rounded-full bg-primary" style={{ width: 32, height: 32, border: "1px solid var(--border-secondary)" }} onClick={() => setAutoMax((m) => Math.max(amount + car.increment, m - step1))}>
                          <Icon name="minus" size={15} className="text-primary" />
                        </button>
                        <span className="text-heading-h5-bold text-brand-base" style={{ minWidth: 56, textAlign: "center" }}>{fmtL(autoMax)}</span>
                        <button className="press flex items-center justify-center rounded-full bg-brand-base" style={{ width: 32, height: 32, border: "none" }} onClick={() => setAutoMax((m) => m + step1)}>
                          <Icon name="plus" size={15} className="text-primary-inverse" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Binding notice */}
                <div className="flex items-start gap-2 rounded-xl bg-secondary px-3.5 py-2.5 mt-2">
                  <Icon name="lock" size={16} className="text-secondary" style={{ marginTop: 1 }} />
                  <span className="text-label-3-regular text-secondary">
                    Binding bid. Token held in <span className="text-primary text-label-3-semibold">escrow</span> — auto-refunded if the deal breaks.
                  </span>
                </div>

                {/* Trust lines (owned) */}
                {car.type === "owned" && (
                  <div className="flex flex-col gap-2 mt-3">
                    <TrustLine text="100% procurement guarantee — no seller to back out" />
                    <TrustLine text="Same-day / guaranteed stock-out on win" />
                  </div>
                )}
                {car.type === "ocb" && (
                  <div className="flex items-start gap-2 mt-3">
                    <Icon name="info" size={16} className="text-secondary" style={{ marginTop: 1 }} />
                    <span className="text-label-3-regular text-secondary">
                      OCB lot — subject to seller confirmation if below reserve ({fmtL(car.reserve)}).
                    </span>
                  </div>
                )}
              </div>

              <div className="px-5 pt-2">
                <Button full onClick={step === "placed" ? increaseWhileLeading : confirm} leftIcon="bolt">
                  {step === "placed"
                    ? `Increase bid · ${fmtL(increaseNowAmount)}`
                    : step === "outbid"
                      ? `Increase bid · ${fmtL(amount)}`
                      : `Confirm bid · ${fmtL(amount)}`}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Ctx.Provider>
  );
}

function Header({ car, onClose }: { car: Car; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-3">
      <div>
        <div className="text-heading-h3-bold text-primary">Place bid</div>
        <div className="text-label-3-regular text-secondary">
          {car.year} {car.make} {car.model} · {car.variant}
        </div>
      </div>
      <button className="press text-secondary" onClick={onClose} style={{ border: "none", background: "transparent" }}>
        <Icon name="close" size={22} />
      </button>
    </div>
  );
}

function TrustLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center rounded-full bg-success-subtle" style={{ width: 22, height: 22 }}>
        <Icon name="check" size={13} className="text-success-bold" strokeWidth={2.6} />
      </div>
      <span className="text-label-3-medium text-primary">{text}</span>
    </div>
  );
}

function WonCard({ car, amount, auto, onPayToken, onClose }: { car: Car; amount: number; auto?: boolean; onPayToken: () => void; onClose: () => void }) {
  const { state } = useStore();
  const paid = state.tokenPaid.includes(car.id);
  return (
    <div className="sheet pop" style={{ paddingBottom: 18 }}>
      <div className="flex flex-col items-center text-center px-6 pt-7 pb-2">
        <div className="flex items-center justify-center rounded-full bg-success-subtle" style={{ width: 64, height: 64 }}>
          <Icon name="check" size={34} className="text-success-bold" strokeWidth={2.6} />
        </div>
        <div className="text-heading-h2-bold text-primary mt-4">You won the {car.model}!</div>
        {auto && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-subtle px-3 py-1 mt-2">
            <Icon name="bolt" size={13} className="text-brand-base" />
            <span className="text-label-4-semibold text-brand-base">Won by auto-bid — no manual action</span>
          </div>
        )}
        <div className="text-label-2-regular text-secondary mt-1">
          Winning bid {fmtL(amount)} · held in escrow
        </div>
        {car.type === "owned" && (
          <div className="inline-flex mt-3">
            <GuaranteeBadge />
          </div>
        )}
        <div className="text-label-3-regular text-secondary mt-3">
          {car.type === "owned"
            ? "Stock-out is 100% guaranteed — this car is yours. Pay the token to lock it."
            : "Seller accepted your winning bid. Pay the token to move it into stocked-in procurement."}
        </div>
      </div>
      <div className="px-5 pt-3 flex flex-col gap-2.5">
        {!paid ? (
          <Button full onClick={onPayToken} leftIcon="lock">
            Pay token (escrow-protected)
          </Button>
        ) : (
          <Button full onClick={onClose} leftIcon="bag">
            Track in Purchased
          </Button>
        )}
        <button className="press text-center text-label-3-medium text-secondary py-1" onClick={onClose} style={{ border: "none", background: "transparent" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

function OcbPendingCard({ car, onClose }: { car: Car; onClose: () => void }) {
  return (
    <div className="sheet pop" style={{ paddingBottom: 18 }}>
      <div className="flex flex-col items-center text-center px-6 pt-7 pb-2">
        <div className="flex items-center justify-center rounded-full bg-warning-subtle" style={{ width: 64, height: 64 }}>
          <Icon name="phone" size={30} className="text-warning-bold" />
        </div>
        <div className="text-heading-h2-bold text-primary mt-4">Bid placed — pending seller</div>
        <div className="text-label-3-regular text-secondary mt-2">
          Your bid is below reserve ({fmtL(car.reserve)}). The seller agent (RA) is proposing your price to the seller — you'll hear back within 24h (T+1). Token held in escrow, auto-refunded if it breaks.
        </div>
      </div>
      <div className="px-5 pt-4">
        <Button full onClick={onClose}>
          Got it
        </Button>
      </div>
    </div>
  );
}
