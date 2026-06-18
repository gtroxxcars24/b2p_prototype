import { useCallback, useRef } from "react";
import { useStore, AgentName, Chip } from "../state/store";
import { Car, fmtL } from "../data/cars";
import { Auction } from "../data/auctions";

/**
 * Deterministic, scripted agent layer (PRD §10.6 / §10.7).
 * No inference, no network — each trigger reads mock-state fields, waits a
 * simulated "typing" latency (~600–1000ms), then emits a typed effect with
 * canned copy.
 */
export function useAgents() {
  const { state, dispatch, nextId } = useStore();
  // throttle "card view" so scrolling doesn't spam the same message
  const lastCardSeen = useRef<string | null>(null);

  /** Push a typing bubble, then resolve it to real copy + chips after latency. */
  const say = useCallback(
    (agent: AgentName, text: string, chips?: Chip[], openSheet = false) => {
      const id = nextId();
      if (openSheet) dispatch({ type: "SET_ASSISTANT_OPEN", open: true });
      dispatch({ type: "ADD_MESSAGE", message: { id, agent, text: "", typing: true } });
      const delay = 600 + Math.floor(Math.random() * 400);
      setTimeout(() => {
        dispatch({ type: "UPDATE_MESSAGE", id, patch: { text, typing: false, chips } });
      }, delay);
      return id;
    },
    [dispatch, nextId]
  );

  const toast = useCallback(
    (agent: AgentName, text: string, ttl = 4500) => {
      const id = nextId();
      dispatch({ type: "ADD_TOAST", toast: { id, agent, text } });
      setTimeout(() => dispatch({ type: "REMOVE_TOAST", id }), ttl);
    },
    [dispatch, nextId]
  );

  // ── §10.7 row: App open ──────────────────────────────────────────────
  const onAppOpen = useCallback(() => {
    if (state.messages.length > 0) return;
    say(
      "PA",
      `You're after ~${state.dealerGoal} cars this month within ${fmtL(state.budget)}. I've lined up ${state.dealerGoal - 4} in budget with high win odds — owned stock first so wins are guaranteed.`
    );
    toast("PA", `Lined up ${state.dealerGoal - 4} cars in your budget with high win odds. Tap me anytime.`, 5000);
  }, [say, toast, state.messages.length, state.dealerGoal, state.budget]);

  // ── §10.7 row: Card view (Condition agent) ───────────────────────────
  const onCardView = useCallback(
    (car: Car, openReport: () => void) => {
      if (lastCardSeen.current === car.id) return;
      lastCardSeen.current = car.id;
      const minor = car.defects.filter((d) => d.severity === "minor").length;
      const major = car.defects.filter((d) => d.severity === "major").length;
      const defectCopy =
        major > 0
          ? `${major} major + ${minor} minor defect${minor === 1 ? "" : "s"}`
          : `${minor} minor cosmetic defect${minor === 1 ? "" : "s"}`;
      say(
        "Condition",
        `${car.make} ${car.model}: Grade ${car.conditionGrade}/5 · ${car.conditionLabel}. ${defectCopy}, underbody clean. Open the report?`,
        [{ label: "Open report", action: openReport, primary: true }],
        false // surface as a passive bubble; user can open the sheet
      );
    },
    [say]
  );

  // ── §10.7 row: Bid open (Pricing agent) ──────────────────────────────
  const onBidOpen = useCallback(
    (car: Car) => {
      dispatch({ type: "PREFILL_BID", carId: car.id, amount: car.minBid });
      say(
        "Pricing",
        `Opening at ${fmtL(car.minBid)}, below market (fair value ${fmtL(car.fairValue)}). ${car.demand} demand — win odds high. I've pre-filled the opening bid.`
      );
    },
    [say, dispatch]
  );

  // ── §10.7 row: Outbid (PA agent) ─────────────────────────────────────
  const onOutbid = useCallback(
    (car: Car, suggested: number, raise: () => void) => {
      say(
        "PA",
        `You've been outbid on the ${car.model}. Raise to ${fmtL(suggested)} to stay on top?`,
        [{ label: `Raise to ${fmtL(suggested)}`, action: raise, primary: true }]
      );
    },
    [say]
  );

  // ── §10.7 row: Won, token unpaid (PA agent) ──────────────────────────
  const onWonTokenUnpaid = useCallback(
    (car: Car, payToken: () => void) => {
      dispatch({ type: "TOKEN_NUDGE", carId: car.id });
      say(
        "PA",
        `You won the ${car.model}! Pay the token to lock it — held in escrow, auto-refunded if anything's off.`,
        [{ label: "Pay token", action: payToken, primary: true }]
      );
    },
    [say, dispatch]
  );

  // ── §10.7 row: Seller quote high, OCB (RA agent) ─────────────────────
  const onSellerQuoteHigh = useCallback(
    (car: Car) => {
      if (!car.sellerQuote) return;
      const lo = fmtL(car.fairValue - 0.3 * 100000);
      const hi = fmtL(car.fairValue);
      const propose = car.reserve;
      say(
        "RA",
        `Seller quoted ${fmtL(car.sellerQuote)}; market is ${lo}–${hi}. I'll propose ${fmtL(propose)} to the seller and confirm.`
      );
    },
    [say]
  );

  // ── §10.7 row: Post-win owned (Concierge agent) ──────────────────────
  const onPostWinOwned = useCallback(
    (car: Car) => {
      toast("Concierge", `${car.model}: token paid. Moving to stocked-in procurement now.`);
    },
    [toast]
  );

  // ── §10.7 row: Intent ≥ threshold (Auction agent) ────────────────────
  const onIntentThreshold = useCallback(
    (auction: Auction, bookVisit: () => void) => {
      toast("Auction", `Enough interest — auction confirmed ${auction.date}, ${auction.venue}.`);
      say(
        "Auction",
        `Enough dealers are in — the ${auction.area} auction is confirmed for ${auction.date} at ${auction.venue}. Book your visit?`,
        [{ label: "Book visit", action: bookVisit, primary: true }]
      );
    },
    [say, toast]
  );

  // ── §10.7 row: Plate scanned (Auction agent) ─────────────────────────
  const onPlateScanned = useCallback(
    (car: Car) => {
      say(
        "Auction",
        `Plate matched to your won lot — ${car.make} ${car.model}. Stocked in and ready for instant stock-out today.`
      );
      toast("Concierge", `${car.model}: gate pass ready · stocked-out can happen today.`);
    },
    [say, toast]
  );

  // ── §10.7 row: Unclear / complaint (Support agent) ───────────────────
  const onEscalate = useCallback(() => {
    say("Support", "Got it — connecting you to a human specialist. Someone will pick this up shortly.");
  }, [say]);

  return {
    onAppOpen,
    onCardView,
    onBidOpen,
    onOutbid,
    onWonTokenUnpaid,
    onSellerQuoteHigh,
    onPostWinOwned,
    onIntentThreshold,
    onPlateScanned,
    onEscalate,
    say,
    toast,
  };
}
