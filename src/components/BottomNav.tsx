import React from "react";
import { useNav, Tab } from "../state/nav";
import { Icon, IconName } from "./Icon";
import { useStore } from "../state/store";

const TABS: { tab: Tab; label: string; icon: IconName }[] = [
  { tab: "live", label: "Live", icon: "home" },
  { tab: "online", label: "Online", icon: "gavel" },
  { tab: "offline", label: "Offline", icon: "gavel" },
  { tab: "purchased", label: "Purchased", icon: "bag" },
  { tab: "account", label: "Account", icon: "user" },
];

export function BottomNav() {
  const { tab, setTab } = useNav();
  const { state } = useStore();
  const purchasedCount = state.purchased.length;

  return (
    <div
      className="flex items-stretch justify-around bg-primary"
      style={{
        height: 64,
        flexShrink: 0,
        borderTop: "1px solid var(--border-secondary)",
        paddingBottom: 4,
      }}
    >
      {TABS.map((t) => {
        const active = tab === t.tab;
        return (
          <button
            key={t.tab}
            onClick={() => setTab(t.tab)}
            className="press flex flex-col items-center justify-center gap-1 flex-1"
            style={{ border: "none", background: "transparent", position: "relative" }}
          >
            <div style={{ position: "relative" }}>
              <Icon
                name={t.icon}
                size={23}
                strokeWidth={active ? 2.3 : 2}
                className={active ? "text-brand-base" : "text-tertiary"}
              />
              {t.tab === "purchased" && purchasedCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -8,
                    background: "#4736FE",
                    color: "#fff",
                    borderRadius: 9,
                    minWidth: 16,
                    height: 16,
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                  }}
                >
                  {purchasedCount}
                </span>
              )}
            </div>
            <span
              className={`text-label-4-${active ? "semibold" : "medium"} ${
                active ? "text-brand-base" : "text-tertiary"
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
