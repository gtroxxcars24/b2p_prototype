import React from "react";
import { StoreProvider, useStore } from "./state/store";
import { NavProvider, useNav, Overlay } from "./state/nav";
import { BidProvider } from "./components/BidFlow";
import { Assistant, Toasts } from "./components/Assistant";
import { Icon, IconName } from "./components/Icon";
import { Feed, OnlineAuctions } from "./screens/Feed";
import { CarDetail } from "./screens/CarDetail";
import { Offline, AuctionDetail, BookVisit, Handoff, Candidates } from "./screens/Offline";
import { SellerChat } from "./screens/SellerChat";
import { Purchased, Account } from "./screens/Purchased";
import { carById } from "./data/cars";
import { auctionById } from "./data/auctions";

const WALLET_BALANCE = "₹2.4L";

function StatusBar() {
  return (
    <div className="status-bar text-primary">
      <span>9:41</span>
      <div className="flex items-center gap-1.5" style={{ marginRight: 2 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <path d="M8 2.2c2 0 3.9.8 5.3 2.1l1.2-1.3A9.5 9.5 0 008 .4 9.5 9.5 0 001.5 3l1.2 1.3A7.5 7.5 0 018 2.2z" />
          <path d="M8 5.6c1.1 0 2.1.4 2.8 1.2l1.2-1.3A6 6 0 008 3.8a6 6 0 00-4 1.7l1.2 1.3A4 4 0 018 5.6z" />
          <circle cx="8" cy="9" r="1.6" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" />
          <rect x="22.5" y="3.5" width="1.5" height="5" rx="0.75" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function HeaderAction({ icon, onClick }: { icon: IconName; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="dealer-action press"
      type="button"
    >
      <Icon name={icon} size={17} strokeWidth={2.15} />
    </button>
  );
}

function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return <span className="notification-count">{count}</span>;
}

function AppHeader() {
  const { tab, setTab } = useNav();
  const { state } = useStore();
  const notificationCount = Math.max(1, state.purchased.length);
  const serviceTiles: { title: string; icon: IconName; active?: boolean; onClick?: () => void; tone: string }[] = [
    { title: "Car\nAuction", icon: "gavel", active: tab === "live" || tab === "online" || tab === "offline", onClick: () => setTab("live"), tone: "auction" },
    { title: "Give\nLoans", icon: "car", tone: "loans" },
    { title: "Check\nCIBIL", icon: "gauge", tone: "cibil" },
    { title: "Car\nReport", icon: "doc", tone: "report" },
    { title: "Share\nLeads", icon: "send", tone: "leads" },
  ];
  return (
    <div className="dealer-header-wrap">
      <div className="dealer-header">
        <div className="dealer-header-top">
          <button className="dealer-location press" onClick={() => setTab("account")} type="button">
            <span className="dealer-location-pin">
              <Icon name="pin" size={18} strokeWidth={2.45} />
            </span>
            <span className="dealer-location-copy">
              <span className="dealer-location-label">RTO</span>
              <Icon name="chevron" size={14} strokeWidth={2.45} style={{ transform: "rotate(90deg)" }} />
            </span>
          </button>
          <div className="dealer-header-actions">
            <button className="dealer-wallet press" onClick={() => setTab("purchased")} type="button">
              <Icon name="wallet" size={16} strokeWidth={2.05} />
              <span>{WALLET_BALANCE}</span>
            </button>
            <button className="dealer-action press" onClick={() => setTab("account")} type="button">
              <Icon name="bell" size={17} strokeWidth={2.15} />
              <NotificationBadge count={notificationCount} />
            </button>
          </div>
        </div>
        <div className="dealer-shortcuts no-scrollbar">
          {serviceTiles.map((tile) => (
            <button
              key={tile.title}
              className={`dealer-service-tile dealer-service-tile--${tile.tone} ${tile.active ? "dealer-service-tile--active" : ""} press`}
              onClick={tile.onClick}
              type="button"
            >
              <span className="dealer-service-title">{tile.title}</span>
              <span className="dealer-service-visual">
                <Icon name={tile.icon} size={tile.tone === "auction" ? 22 : 24} strokeWidth={2.35} />
                {tile.tone === "auction" ? <span className="dealer-bid-chip">BID</span> : null}
                {tile.tone === "loans" ? <span className="dealer-rupee-chip">₹</span> : null}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="dealer-mode-tray">
        <div className="dealer-mode-switch">
          <button
            className={`dealer-mode-option ${tab === "live" ? "dealer-mode-option--active" : ""} press`}
            onClick={() => setTab("live")}
            type="button"
          >
            <span>Live</span>
            <span className="dealer-mode-count">10</span>
          </button>
          <button
            className={`dealer-mode-option ${tab === "online" ? "dealer-mode-option--active" : ""} press`}
            onClick={() => setTab("online")}
            type="button"
          >
            <span>Online</span>
            <span className="dealer-mode-count">18</span>
          </button>
          <button
            className={`dealer-mode-option ${tab === "offline" ? "dealer-mode-option--active" : ""} press`}
            onClick={() => setTab("offline")}
            type="button"
          >
            <span>Offline</span>
            <span className="dealer-mode-count">2</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function FullscreenTopChrome() {
  const { tab, setTab } = useNav();
  const { state } = useStore();
  const notificationCount = Math.max(1, state.purchased.length);
  return (
    <div className="fullscreen-top-chrome">
      <StatusBar />
      <div className="fullscreen-top-row">
        <button className="fullscreen-location press" onClick={() => setTab("account")} type="button">
          <span className="fullscreen-location-pin">
            <Icon name="pin" size={16} strokeWidth={2.45} />
          </span>
          <span>RTO</span>
          <Icon name="chevron" size={13} strokeWidth={2.45} style={{ transform: "rotate(90deg)" }} />
        </button>

        <div className="fullscreen-actions">
          <button className="fullscreen-wallet press" onClick={() => setTab("purchased")} type="button">
            <Icon name="wallet" size={15} strokeWidth={2.05} />
            <span>{WALLET_BALANCE}</span>
          </button>
          <button className="fullscreen-icon-button press" onClick={() => setTab("account")} type="button">
            <Icon name="bell" size={16} strokeWidth={2.1} />
            <NotificationBadge count={notificationCount} />
          </button>
        </div>
      </div>

      <div className="fullscreen-mode-row">
        <div className="reels-mode-tabs">
          <button
            className={`reels-mode-tab ${tab === "live" ? "reels-mode-tab--active" : ""}`}
            onClick={() => setTab("live")}
            type="button"
          >
            Live
          </button>
          <button
            className={`reels-mode-tab ${tab === "online" ? "reels-mode-tab--active" : ""}`}
            onClick={() => setTab("online")}
            type="button"
          >
            Online
          </button>
          <button
            className={`reels-mode-tab ${tab === "offline" ? "reels-mode-tab--active" : ""}`}
            onClick={() => setTab("offline")}
            type="button"
          >
            Offline
          </button>
        </div>
      </div>
    </div>
  );
}

function UtilityTopChrome() {
  const { setTab } = useNav();
  const { state } = useStore();
  const notificationCount = Math.max(1, state.purchased.length);
  return (
    <div className="utility-top-chrome">
      <StatusBar />
      <div className="utility-top-row">
        <button className="fullscreen-location press" onClick={() => setTab("account")} type="button">
          <span className="fullscreen-location-pin">
            <Icon name="pin" size={16} strokeWidth={2.45} />
          </span>
          <span>RTO</span>
          <Icon name="chevron" size={13} strokeWidth={2.45} style={{ transform: "rotate(90deg)" }} />
        </button>

        <button className="utility-auction-pill press" onClick={() => setTab("live")} type="button">
          <Icon name="gavel" size={14} strokeWidth={2.2} />
          Auction
        </button>

        <div className="fullscreen-actions">
          <button className="fullscreen-wallet press" onClick={() => setTab("purchased")} type="button">
            <Icon name="wallet" size={15} strokeWidth={2.05} />
            <span>{WALLET_BALANCE}</span>
          </button>
          <button className="fullscreen-icon-button press" onClick={() => setTab("account")} type="button">
            <Icon name="bell" size={16} strokeWidth={2.1} />
            <NotificationBadge count={notificationCount} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceDock() {
  const { tab, setTab } = useNav();
  const items: { label: string; icon: IconName; active?: boolean; onClick?: () => void }[] = [
    { label: "Auction", icon: "gavel", active: tab === "live" || tab === "online" || tab === "offline", onClick: () => setTab("live") },
    { label: "Loans", icon: "car" },
    { label: "CIBIL", icon: "gauge" },
    { label: "Report", icon: "doc" },
    { label: "Leads", icon: "send" },
  ];
  return (
    <div className="service-dock">
      {items.map((item) => (
        <button
          key={item.label}
          className={`service-dock-item ${item.active ? "service-dock-item--active" : ""} press`}
          onClick={item.onClick}
          type="button"
        >
          <span className="service-dock-icon">
            <Icon name={item.icon} size={19} strokeWidth={2.2} />
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function TabContent() {
  const { tab } = useNav();
  switch (tab) {
    case "live":
      return <Feed />;
    case "online":
      return <OnlineAuctions />;
    case "offline":
      return <Offline />;
    case "purchased":
      return <Purchased />;
    case "account":
      return <Account />;
  }
}

function OverlayHost({ overlay, z }: { overlay: Overlay; z: number }) {
  let node: React.ReactNode = null;
  if (overlay.name === "car-detail") {
    const car = carById(overlay.params!.id);
    if (car) node = <CarDetail car={car} />;
  } else if (overlay.name === "auction-detail") {
    const a = auctionById(overlay.params!.id);
    if (a) node = <AuctionDetail auction={a} />;
  } else if (overlay.name === "book-visit") {
    const a = auctionById(overlay.params!.id);
    if (a) node = <BookVisit auction={a} />;
  } else if (overlay.name === "handoff") {
    const a = auctionById(overlay.params!.id);
    if (a) node = <Handoff auction={a} />;
  } else if (overlay.name === "candidates") {
    node = <Candidates />;
  } else if (overlay.name === "seller-chat") {
    const car = carById(overlay.params!.id);
    const initialCall = overlay.params?.call === "audio" || overlay.params?.call === "video" ? overlay.params.call : null;
    if (car) node = <SellerChat car={car} initialCall={initialCall} />;
  }
  return <div style={{ position: "absolute", inset: 0, zIndex: z }}>{node}</div>;
}

function Shell() {
  const { stack, tab } = useNav();
  const immersive = tab === "live" || tab === "online" || tab === "offline";
  return (
    <div className="phone-screen">
      {immersive ? <FullscreenTopChrome /> : <UtilityTopChrome />}
      <div style={{ flex: 1, position: "relative", minHeight: 0, display: "flex", flexDirection: "column" }}>
        <TabContent />
        <ServiceDock />
        {stack.map((o, i) => (
          <OverlayHost key={i} overlay={o} z={30 + i * 5} />
        ))}
        <Toasts />
        <Assistant />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <NavProvider>
        <div className="stage">
          <div className="phone">
            <BidProvider>
              <Shell />
            </BidProvider>
          </div>
        </div>
      </NavProvider>
    </StoreProvider>
  );
}
