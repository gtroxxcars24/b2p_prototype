import React, { createContext, useContext, useReducer, useRef, useCallback } from "react";

export type AgentName =
  | "PA"
  | "RA"
  | "Pricing"
  | "Condition"
  | "Concierge"
  | "Auction"
  | "Support";

export const AGENT_LABEL: Record<AgentName, string> = {
  PA: "Buying Assistant",
  RA: "Seller Agent",
  Pricing: "Pricing Agent",
  Condition: "Condition Agent",
  Concierge: "Concierge",
  Auction: "Auction Agent",
  Support: "Support",
};

export interface Chip {
  label: string;
  action: () => void;
  primary?: boolean;
}

export interface AssistantMessage {
  id: number;
  agent: AgentName;
  text: string;
  typing?: boolean;
  chips?: Chip[];
}

export interface Toast {
  id: number;
  agent: AgentName;
  text: string;
}

export const PIPELINE = ["Won bid", "Seller accepted", "Token paid", "Stocked in", "Stocked out"] as const;

export interface Purchased {
  carId: string;
  source: "online" | "offline";
  tokenPaid: boolean;
  step: number; // index into PIPELINE
  amount?: number; // winning bid
}

export interface AppState {
  // dealer profile (PA agent perception)
  dealerGoal: number; // cars this month
  budget: number;
  winRate: number; // 0-1

  // bidding
  bids: Record<string, number>; // carId -> dealer's bid
  highest: Record<string, number>; // carId -> current highest (overrides car default)
  won: string[]; // carIds won
  lost: string[];
  tokenPaid: string[]; // carIds with token funded

  // offline
  bookedVisits: string[]; // auction ids
  checkedIn: string[];
  intentRegistered: string[]; // candidate ids
  candidateIntent: Record<string, number>; // candidate id -> count override

  // purchases / post-procurement
  purchased: Purchased[];

  // assistant surface
  assistantOpen: boolean;
  messages: AssistantMessage[];
  toasts: Toast[];

  // ephemeral agent effects
  prefillBid: Record<string, number>; // carId -> suggested amount
  tokenNudge: string | null; // carId needing token

  // auto-bid: carId -> max amount the system can auto-raise to
  autoBid: Record<string, number>;

  // dealer-submitted "source this car for me" requests
  carRequests: { make: string; budget: string; note: string }[];
}

const initialState: AppState = {
  dealerGoal: 10,
  budget: 1500000,
  winRate: 0.42,
  bids: {},
  highest: {},
  won: [],
  lost: [],
  tokenPaid: [],
  bookedVisits: [],
  checkedIn: [],
  intentRegistered: [],
  candidateIntent: {},
  purchased: [],
  assistantOpen: false,
  messages: [],
  toasts: [],
  prefillBid: {},
  tokenNudge: null,
  autoBid: {},
  carRequests: [],
};

type Action =
  | { type: "PATCH"; patch: Partial<AppState> }
  | { type: "ADD_MESSAGE"; message: AssistantMessage }
  | { type: "UPDATE_MESSAGE"; id: number; patch: Partial<AssistantMessage> }
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; id: number }
  | { type: "SET_ASSISTANT_OPEN"; open: boolean }
  | { type: "PLACE_BID"; carId: string; amount: number; highest: number }
  | { type: "SET_WON"; carId: string }
  | { type: "PAY_TOKEN"; carId: string }
  | { type: "ADD_PURCHASED"; item: Purchased }
  | { type: "ADVANCE_PIPELINE"; carId: string }
  | { type: "PREFILL_BID"; carId: string; amount: number }
  | { type: "SET_AUTOBID"; carId: string; max: number | null }
  | { type: "TOKEN_NUDGE"; carId: string | null }
  | { type: "BOOK_VISIT"; auctionId: string }
  | { type: "CHECK_IN"; auctionId: string }
  | { type: "REGISTER_INTENT"; candidateId: string }
  | { type: "REQUEST_CAR"; make: string; budget: string; note: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "PATCH":
      return { ...state, ...action.patch };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((m) => (m.id === action.id ? { ...m, ...action.patch } : m)),
      };
    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.toast] };
    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "SET_ASSISTANT_OPEN":
      return { ...state, assistantOpen: action.open };
    case "PLACE_BID":
      return {
        ...state,
        bids: { ...state.bids, [action.carId]: action.amount },
        highest: { ...state.highest, [action.carId]: action.highest },
      };
    case "SET_WON":
      return state.won.includes(action.carId)
        ? state
        : { ...state, won: [...state.won, action.carId] };
    case "PAY_TOKEN":
      return {
        ...state,
        tokenPaid: state.tokenPaid.includes(action.carId)
          ? state.tokenPaid
          : [...state.tokenPaid, action.carId],
        tokenNudge: null,
        purchased: state.purchased.map((p) =>
          p.carId === action.carId ? { ...p, tokenPaid: true } : p
        ),
      };
    case "ADD_PURCHASED":
      return state.purchased.some((p) => p.carId === action.item.carId)
        ? state
        : { ...state, purchased: [...state.purchased, action.item] };
    case "ADVANCE_PIPELINE":
      return {
        ...state,
        purchased: state.purchased.map((p) =>
          p.carId === action.carId
            ? { ...p, step: Math.min(p.step + 1, PIPELINE.length - 1) }
            : p
        ),
      };
    case "PREFILL_BID":
      return { ...state, prefillBid: { ...state.prefillBid, [action.carId]: action.amount } };
    case "SET_AUTOBID": {
      const autoBid = { ...state.autoBid };
      if (action.max == null) delete autoBid[action.carId];
      else autoBid[action.carId] = action.max;
      return { ...state, autoBid };
    }
    case "TOKEN_NUDGE":
      return { ...state, tokenNudge: action.carId };
    case "BOOK_VISIT":
      return state.bookedVisits.includes(action.auctionId)
        ? state
        : { ...state, bookedVisits: [...state.bookedVisits, action.auctionId] };
    case "CHECK_IN":
      return state.checkedIn.includes(action.auctionId)
        ? state
        : { ...state, checkedIn: [...state.checkedIn, action.auctionId] };
    case "REGISTER_INTENT": {
      if (state.intentRegistered.includes(action.candidateId)) return state;
      return {
        ...state,
        intentRegistered: [...state.intentRegistered, action.candidateId],
        candidateIntent: {
          ...state.candidateIntent,
          [action.candidateId]: (state.candidateIntent[action.candidateId] ?? 0) + 1,
        },
      };
    }
    case "REQUEST_CAR":
      return {
        ...state,
        carRequests: [{ make: action.make, budget: action.budget, note: action.note }, ...state.carRequests],
      };
    default:
      return state;
  }
}

interface Ctx {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  nextId: () => number;
}

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const idRef = useRef(1);
  const nextId = useCallback(() => idRef.current++, []);
  return (
    <StoreContext.Provider value={{ state, dispatch, nextId }}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
