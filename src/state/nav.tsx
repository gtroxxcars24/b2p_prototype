import React, { createContext, useContext, useState, useCallback } from "react";

export type Tab = "live" | "online" | "offline" | "purchased" | "account";

export interface Overlay {
  name: "car-detail" | "auction-detail" | "book-visit" | "handoff" | "candidates" | "price-intel" | "seller-chat";
  params?: Record<string, string>;
}

interface NavCtx {
  tab: Tab;
  setTab: (t: Tab) => void;
  stack: Overlay[];
  push: (o: Overlay) => void;
  pop: () => void;
  reset: () => void;
}

const Ctx = createContext<NavCtx | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTabState] = useState<Tab>("live");
  const [stack, setStack] = useState<Overlay[]>([]);

  const setTab = useCallback((t: Tab) => {
    setStack([]);
    setTabState(t);
  }, []);
  const push = useCallback((o: Overlay) => setStack((s) => [...s, o]), []);
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const reset = useCallback(() => setStack([]), []);

  return (
    <Ctx.Provider value={{ tab, setTab, stack, push, pop, reset }}>{children}</Ctx.Provider>
  );
}

export function useNav() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useNav within NavProvider");
  return c;
}
