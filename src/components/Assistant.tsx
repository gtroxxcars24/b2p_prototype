import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStore, AGENT_LABEL, AgentName } from "../state/store";
import { useAgents } from "../agents/useAgents";
import { Icon } from "./Icon";
import { useNav } from "../state/nav";
import { FEED_CARS, carById, fmtL } from "../data/cars";

const AGENT_TINT: Record<AgentName, string> = {
  PA: "#4736FE",
  RA: "#0E7C66",
  Pricing: "#7A3DF2",
  Condition: "#1B7FCC",
  Concierge: "#0E7C66",
  Auction: "#C2410C",
  Support: "#525252",
};

export function AgentAvatar({ agent, size = 30 }: { agent: AgentName; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: AGENT_TINT[agent],
        borderRadius: "50%",
        flexShrink: 0,
      }}
      className="inline-flex items-center justify-center text-primary-inverse"
    >
      <Icon name="sparkle" size={size * 0.55} strokeWidth={2.2} />
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </span>
  );
}

/** Floating assistant launcher + chat sheet (PRD §10.5). */
export function Assistant() {
  const { state, dispatch } = useStore();
  const { tab, stack, push } = useNav();
  const { onEscalate, say, toast } = useAgents();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const open = state.assistantOpen;
  const unread = state.messages.filter((m) => !m.typing).length;
  const activeOverlay = stack[stack.length - 1];
  const activeCar = activeOverlay?.name === "car-detail" ? carById(activeOverlay.params?.id ?? "") : undefined;
  const context = activeCar ? "car" : tab === "live" || tab === "online" ? "feed" : tab === "offline" ? "offline" : "support";

  const contextCopy = useMemo(() => {
    if (activeCar) {
      return {
        title: `${activeCar.make} ${activeCar.model} agent`,
        subtitle: "Ask about price, condition, history or bid strategy",
        placeholder: "Ask about this car",
      };
    }
    if (tab === "live") {
      return {
        title: "Live auction assistant",
        subtitle: "Search live video lots or ask for bid strategy",
        placeholder: "Search Swift, live SUV under 10L...",
      };
    }
    if (tab === "online") {
      return {
        title: "Search online auctions",
        subtitle: "Find list-style auction cars by model, budget or grade",
        placeholder: "Search Swift, SUV under 10L, automatic...",
      };
    }
    if (tab === "offline") {
      return {
        title: "Auction assistant",
        subtitle: "Find visits, lots, venues and inspection timing",
        placeholder: "Ask about auctions or lots",
      };
    }
    return {
      title: "CARS24 Assistant",
      subtitle: "Agents working for you",
      placeholder: "Ask for help",
    };
  }, [activeCar, tab]);

  const openCar = (id: string) => {
    dispatch({ type: "SET_ASSISTANT_OPEN", open: false });
    push({ name: "car-detail", params: { id } });
  };

  const requestMissingCar = (raw: string) => {
    const requested = raw.trim() || "Requested car";
    dispatch({
      type: "REQUEST_CAR",
      make: requested,
      budget: "Flexible",
      note: "Notify for online or offline auction availability",
    });
    toast("Auction", `Request saved — we'll alert you when ${requested} is available online or offline.`);
    say("Auction", `Done — I'll notify you when ${requested} is inspected and enters an online or offline auction.`);
  };

  const searchCars = (raw: string) => {
    const query = raw.trim().toLowerCase();
    const budgetMatch = query.match(/(\d+(?:\.\d+)?)\s*l/);
    const budget = budgetMatch ? Number(budgetMatch[1]) * 100000 : 0;
    const matches = FEED_CARS.filter((car) => {
      const haystack = `${car.make} ${car.model} ${car.variant} ${car.fuel} ${car.transmission} ${car.conditionLabel} ${car.type}`.toLowerCase();
      const semanticOnly =
        query.includes("suv") ||
        query.includes("under") ||
        query.includes("budget") ||
        query.includes("owned") ||
        query.includes("automatic") ||
        query.includes("manual");
      const textHit = !query || semanticOnly || query.split(/\s+/).some((token) => token.length > 2 && haystack.includes(token));
      const budgetHit = budget ? car.minBid <= budget : true;
      const suvHit = query.includes("suv") ? ["creta", "nexon", "seltos"].some((m) => car.model.toLowerCase().includes(m)) : true;
      const ownedHit = query.includes("owned") ? car.type === "owned" : true;
      const autoHit = query.includes("automatic") ? car.transmission === "Automatic" : true;
      const manualHit = query.includes("manual") ? car.transmission === "Manual" : true;
      return textHit && budgetHit && suvHit && ownedHit && autoHit && manualHit;
    }).slice(0, 3);

    if (matches.length === 0) {
      say(
        "PA",
        `I couldn't find a close match for "${raw}". Want me to request it and notify you when it becomes available in an online or offline auction?`,
        [{ label: "Request this car", action: () => requestMissingCar(raw), primary: true }]
      );
      return;
    }

    say(
      "PA",
      `I found ${matches.length} match${matches.length === 1 ? "" : "es"} for "${raw}". Best pick: ${matches[0].make} ${matches[0].model} at ${fmtL(matches[0].minBid)}.`,
      matches.map((car, i) => ({
        label: `${car.model} · ${fmtL(car.minBid)}`,
        action: () => openCar(car.id),
        primary: i === 0,
      }))
    );
  };

  const answerCarQuestion = (raw: string) => {
    if (!activeCar) return;
    const query = raw.toLowerCase();
    if (query.includes("price") || query.includes("bid") || query.includes("value") || query.includes("margin")) {
      say(
        "Pricing",
        `${activeCar.make} ${activeCar.model}: min bid ${fmtL(activeCar.minBid)}, fair value ${fmtL(activeCar.fairValue)}, estimated resale ${fmtL(activeCar.estResale)}. I would start at min bid and keep headroom below ${fmtL(activeCar.reserve + activeCar.increment * 3)}.`
      );
      return;
    }
    if (query.includes("condition") || query.includes("defect") || query.includes("damage") || query.includes("underbody")) {
      say(
        "Condition",
        `Grade ${activeCar.conditionGrade}/5 (${activeCar.conditionLabel}). ${activeCar.defects.length} marked defect${activeCar.defects.length === 1 ? "" : "s"}: ${activeCar.defects.map((d) => d.area).join(", ")}. Underbody capture is available in Inspection media.`
      );
      return;
    }
    if (query.includes("history") || query.includes("loan") || query.includes("challan") || query.includes("accident")) {
      say(
        "Condition",
        `History check: challan ${activeCar.history.challan}; loan/lien ${activeCar.history.loan}; accident ${activeCar.history.accident}; service ${activeCar.history.service}; Vaahan ${activeCar.history.vaahan}.`
      );
      return;
    }
    say(
      "PA",
      `${activeCar.make} ${activeCar.model} is ${activeCar.variant}, ${activeCar.year}, ${(activeCar.km / 1000).toFixed(0)}k km, ${activeCar.fuel}, ${activeCar.transmission}. Min bid ${fmtL(activeCar.minBid)} and grade ${activeCar.conditionGrade}/5.`
    );
  };

  const submit = (text = draft) => {
    const raw = text.trim();
    if (!raw) return;
    setDraft("");
    if (context === "car") answerCarQuestion(raw);
    else if (context === "feed") searchCars(raw);
    else if (context === "offline") say("Auction", `I can help with "${raw}". Best shortcut: open Offline filters for venue, date, distance and lot type.`);
    else say("Support", `I can help with "${raw}".`);
  };

  const quickActions =
    context === "car" && activeCar
      ? [
          { label: "Price check", action: () => submit("price and bid strategy") },
          { label: "Condition", action: () => submit("condition defects underbody") },
          { label: "History", action: () => submit("history loan challan accident") },
        ]
      : context === "feed"
        ? [
            { label: "Owned stock", action: () => submit("owned stock") },
            { label: "SUV under 10L", action: () => submit("suv under 10L") },
            { label: "Automatic", action: () => submit("automatic") },
          ]
        : [
            { label: "This week", action: () => submit("this week auctions") },
            { label: "Near me", action: () => submit("near me") },
            { label: "Inspected lots", action: () => submit("inspected lots") },
          ];

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages, open]);

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => dispatch({ type: "SET_ASSISTANT_OPEN", open: true })}
          className="press"
          style={{
            position: "absolute",
            right: 14,
            bottom: 108,
            zIndex: 65,
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#4736FE",
            border: "none",
            boxShadow: "0 8px 22px rgba(71,54,254,0.38)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Open auction chat assistant"
        >
          <Icon name="chat" size={25} strokeWidth={2.25} />
          {unread > 0 && (
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                background: "#E11D48",
                color: "#fff",
                borderRadius: 10,
                minWidth: 18,
                height: 18,
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 5px",
              }}
            >
              {unread}
            </span>
          )}
        </button>
      )}

      {open && (
        <>
          <div className="sheet-backdrop" onClick={() => dispatch({ type: "SET_ASSISTANT_OPEN", open: false })} />
          <div className="sheet" style={{ height: "74%" }}>
            <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-secondary)" }}>
              <div className="flex items-center gap-2.5">
                <AgentAvatar agent={activeCar ? "Condition" : tab === "offline" ? "Auction" : "PA"} size={34} />
                <div>
                  <div className="text-heading-h5-bold text-primary">{contextCopy.title}</div>
                  <div className="text-label-4-regular text-secondary">{contextCopy.subtitle}</div>
                </div>
              </div>
              <button
                className="press text-secondary"
                onClick={() => dispatch({ type: "SET_ASSISTANT_OPEN", open: false })}
                style={{ border: "none", background: "transparent" }}
              >
                <Icon name="close" size={22} />
              </button>
            </div>

            <div ref={scrollRef} className="scroll-area px-4 py-4 flex flex-col gap-3" style={{ flex: 1 }}>
              {state.messages.length === 0 && (
                <div className="text-label-2-regular text-secondary text-center mt-8">
                  {activeCar
                    ? "Ask anything about this car: price, condition, history, underbody or bid strategy."
                    : tab === "live"
                      ? "Search live video auctions from here. Try owned stock, SUV under 10L, automatic, or a model name."
                      : tab === "online"
                        ? "Search online auction cards by model, grade, fuel, budget or demand."
                      : "Your agents will guide you here as you browse, bid and buy."}
                </div>
              )}
              {state.messages.map((m) => (
                <div key={m.id} className="flex gap-2.5">
                  <AgentAvatar agent={m.agent} />
                  <div style={{ maxWidth: "82%" }}>
                    <div className="text-label-4-semibold text-secondary mb-1">{AGENT_LABEL[m.agent]}</div>
                    <div
                      className="rounded-2xl px-3.5 py-2.5 bg-secondary text-primary text-label-2-regular"
                      style={{ borderTopLeftRadius: 4 }}
                    >
                      {m.typing ? <TypingDots /> : m.text}
                    </div>
                    {!m.typing && m.chips && m.chips.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {m.chips.map((c, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              c.action();
                              dispatch({ type: "SET_ASSISTANT_OPEN", open: false });
                            }}
                            className={`press rounded-full px-3.5 py-2 text-label-3-semibold ${
                              c.primary
                                ? "bg-brand-base text-primary-inverse"
                                : "bg-primary text-brand-base border border-brand-base"
                            }`}
                            style={{ border: c.primary ? "none" : undefined }}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border-secondary)" }}>
              <div className="flex flex-wrap gap-2 mb-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className="press rounded-full px-3 py-2 text-label-3-semibold bg-brand-subtle text-brand-base"
                    style={{ border: "none" }}
                    onClick={action.action}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <div className="assistant-composer">
                <button
                  className={`assistant-voice-button ${voiceMode ? "assistant-voice-button--active" : ""} press`}
                  onClick={() => setVoiceMode((v) => !v)}
                  type="button"
                  aria-label="Voice mode"
                >
                  <Icon name="mic" size={18} />
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                  }}
                  placeholder={voiceMode ? "Listening... ask by voice" : contextCopy.placeholder}
                  className="assistant-input text-label-2-regular text-primary"
                />
                <button className="assistant-send-button press" onClick={() => submit()} type="button">
                  <Icon name="send" size={17} />
                </button>
              </div>
              {voiceMode && (
                <div className="assistant-voice-note text-label-4-medium">
                  Voice mode on · try “find Creta automatic” or “explain condition”.
                </div>
              )}
              <button
                onClick={onEscalate}
                className="press w-full text-center text-label-3-medium text-secondary"
                style={{ border: "none", background: "transparent", marginTop: 10 }}
              >
                Need a human? <span className="text-brand-base">Talk to a specialist</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/** Background "handled for you" toasts (PRD §10.5). */
export function Toasts() {
  const { state } = useStore();
  if (state.toasts.length === 0) return null;
  return (
    <div className="toast-wrap">
      {state.toasts.map((t) => (
        <div
          key={t.id}
          className="toast flex items-start gap-2.5 rounded-2xl px-3.5 py-3"
          style={{ background: "#1F2430", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
        >
          <AgentAvatar agent={t.agent} size={26} />
          <div className="text-label-3-medium" style={{ paddingTop: 2 }}>
            {t.text}
          </div>
        </div>
      ))}
    </div>
  );
}
