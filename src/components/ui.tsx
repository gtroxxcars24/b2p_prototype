import React from "react";
import { Icon, IconName } from "./Icon";

/* ---------------- Button ---------------- */
export function Button({
  children,
  variant = "primary",
  full,
  disabled,
  onClick,
  leftIcon,
  size = "md",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  full?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  leftIcon?: IconName;
  size?: "md" | "sm";
}) {
  const base =
    "press inline-flex items-center justify-center gap-2 rounded-full text-label-1-semibold";
  const pad = size === "sm" ? "px-4 py-2.5 text-label-2-semibold" : "px-5 py-3.5";
  const styles: Record<string, string> = {
    primary: "text-primary-inverse",
    secondary: "bg-primary text-brand-base",
    tertiary: "bg-transparent text-brand-base",
    danger: "text-primary-inverse",
  };
  const bg: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(180deg, #5A4BFF 0%, #4736FE 60%, #3B2BDB 100%)",
      boxShadow: "0 8px 20px rgba(71,54,254,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
      border: "none",
    },
    secondary: { border: "1.5px solid var(--bg-brand-base)" },
    tertiary: { border: "none" },
    danger: {
      background: "linear-gradient(180deg, #F0436A 0%, #E11D48 100%)",
      boxShadow: "0 8px 20px rgba(225,29,72,0.32)",
      border: "none",
    },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${base} ${pad} ${styles[variant]} ${full ? "w-full" : ""} ${
        disabled ? "opacity-40" : ""
      }`}
      style={bg[variant]}
    >
      {leftIcon && <Icon name={leftIcon} size={size === "sm" ? 16 : 18} />}
      {children}
    </button>
  );
}

/* ---------------- Fulfillment Guaranteed stamp (owned only) ---------------- */
export function FulfillmentStamp({ size = 66 }: { size?: number }) {
  const uid = React.useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Fulfillment guaranteed 100%">
      <defs>
        <linearGradient id={`seal-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12A07F" />
          <stop offset="100%" stopColor="#0A5C49" />
        </linearGradient>
        <radialGradient id={`sheen-${uid}`} cx="50%" cy="32%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <path id={`top-${uid}`} d="M 19 50 A 31 31 0 0 1 81 50" fill="none" />
        <path id={`bot-${uid}`} d="M 21 50 A 29 29 0 0 0 79 50" fill="none" />
      </defs>
      {/* scalloped outer ring */}
      <circle cx="50" cy="50" r="48" fill="#E7B33C" />
      <circle cx="50" cy="50" r="46" fill={`url(#seal-${uid})`} />
      <circle cx="50" cy="50" r="46" fill={`url(#sheen-${uid})`} />
      <circle cx="50" cy="50" r="40.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
      <circle cx="50" cy="50" r="42.5" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" />
      <text fill="#fff" fontWeight="800" letterSpacing="1.6" style={{ fontSize: 9 }}>
        <textPath href={`#top-${uid}`} startOffset="50%" textAnchor="middle">
          FULFILLMENT
        </textPath>
      </text>
      <text fill="#fff" fontWeight="800" letterSpacing="1.6" style={{ fontSize: 9 }}>
        <textPath href={`#bot-${uid}`} startOffset="50%" textAnchor="middle">
          GUARANTEED
        </textPath>
      </text>
      {/* side stars */}
      <text x="16" y="54" fill="#E7B33C" style={{ fontSize: 9 }} textAnchor="middle">★</text>
      <text x="84" y="54" fill="#E7B33C" style={{ fontSize: 9 }} textAnchor="middle">★</text>
      {/* center */}
      <text x="50" y="49" fill="#fff" fontWeight="800" textAnchor="middle" style={{ fontSize: 24 }}>
        100<tspan style={{ fontSize: 13 }}>%</tspan>
      </text>
      <line x1="34" y1="56" x2="66" y2="56" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <text x="50" y="64" fill="rgba(255,255,255,0.9)" fontWeight="700" letterSpacing="1" textAnchor="middle" style={{ fontSize: 6 }}>
        STOCK-OUT
      </text>
    </svg>
  );
}

/** Back-compat wrapper used across screens. */
export function GuaranteeBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span style={{ filter: "drop-shadow(0 4px 8px rgba(10,92,73,0.35))", display: "inline-flex" }}>
      <FulfillmentStamp size={compact ? 54 : 76} />
    </span>
  );
}

/* ---------------- CARS24 owned mark ---------------- */
export function Cars24OwnedBadge() {
  return (
    <span className="cars24-owned-badge" aria-label="CARS24 owned">
      <span className="cars24-owned-word">Cars24</span>
      <svg className="cars24-owned-mark" viewBox="0 23 74 76" fill="none" aria-hidden="true">
        <path d="M65.4442 23.0212L7.94981 23.0212C3.54617 23.0212 0 26.6913 0 31.2487L0 90.7512C0 95.2936 3.54617 98.9787 7.94981 98.9787L65.4442 98.9787C69.8333 98.9787 73.3941 95.2786 73.3941 90.7512L73.3941 31.2487C73.3941 26.6913 69.8188 23.0212 65.4442 23.0212ZM62.4939 68.3551C59.4419 79.7712 49.4429 88.2093 37.4673 88.4951C37.2784 88.5101 37.0749 88.5101 36.8714 88.5101C36.668 88.5101 36.4645 88.5101 36.261 88.4951C36.0575 88.4951 35.8395 88.4951 35.607 88.48H35.5489C26.9015 88.0438 19.3586 83.336 14.8096 76.3569C11.9611 71.9649 10.3042 66.6855 10.3042 60.9849C10.3042 58.3076 10.6676 55.7055 11.3652 53.2538C11.4524 52.9831 11.6704 52.8176 11.9611 52.8176H21.3642C21.8147 52.8176 22.1054 53.2538 21.931 53.69C21.0881 55.9311 20.623 58.3979 20.623 61C20.623 69.3177 25.39 76.3419 32.0027 78.7334C32.6276 78.944 33.2817 79.1395 33.9647 79.2749C34.9094 79.4704 35.8831 79.5757 36.886 79.5757C38.5718 79.5757 40.2287 79.2749 41.7547 78.7334C44.3271 77.8009 46.6234 76.1614 48.4837 74.0105C49.9515 72.2958 51.1288 70.2502 51.9572 67.979C52.0444 67.7233 52.2624 67.5729 52.524 67.5729H61.9126C62.3195 67.5729 62.6102 67.979 62.5085 68.3701L62.4939 68.3551ZM62.4939 57.1795H53.2797C52.9891 57.1795 52.7565 56.969 52.6838 56.6681C51.9862 53.329 50.5038 50.3509 48.4691 47.9894C47.1902 46.4853 45.6787 45.2519 44.0074 44.3194C43.2952 43.8983 42.5395 43.5674 41.7692 43.2816C40.2141 42.7401 38.5864 42.4393 36.9005 42.4393L18.7336 42.4393C18.1814 42.4393 17.9198 41.7474 18.3122 41.3413C22.803 36.7838 28.8635 33.8659 35.5925 33.535H35.6506C35.8686 33.5199 36.1012 33.5199 36.3046 33.5199C36.5081 33.5049 36.7116 33.5049 36.915 33.5049C37.1185 33.5049 37.322 33.5049 37.5109 33.5199C50.4166 33.8207 61.0697 43.6125 63.1334 56.4275C63.1915 56.8336 62.9154 57.1946 62.5375 57.1946L62.4939 57.1795Z" fill="#4736FE"/>
      </svg>
      <span className="cars24-owned-copy">Owned stock</span>
    </span>
  );
}

/* ---------------- Spec chip ---------------- */
export function SpecChip({ icon, label }: { icon: IconName; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
      <Icon name={icon} size={14} className="text-secondary" />
      <span className="text-label-3-medium text-primary">{label}</span>
    </div>
  );
}

/* ---------------- Condition grade badge ---------------- */
export function GradeBadge({
  grade,
  label,
  onClick,
}: {
  grade: number;
  label: string;
  onClick?: () => void;
}) {
  const tone =
    grade >= 5
      ? "bg-success-subtle text-success-bold"
      : grade >= 4
        ? "bg-brand-subtle text-brand-base"
        : "bg-warning-subtle text-warning-bold";
  return (
    <button
      onClick={onClick}
      className={`press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${tone}`}
      style={{ border: "none" }}
    >
      <Icon name="check" size={13} strokeWidth={2.4} />
      <span className="text-label-3-semibold">
        {grade}/5 · {label}
      </span>
    </button>
  );
}

/* ---------------- Generic pill / tag ---------------- */
export function Tag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "danger" | "success" | "purple" | "ocb";
}) {
  const map: Record<string, string> = {
    neutral: "bg-secondary text-secondary",
    brand: "bg-brand-subtle text-brand-base",
    danger: "bg-danger-subtler text-danger-base",
    success: "bg-success-subtle text-success-bold",
    purple: "text-primary-inverse",
    ocb: "bg-tertiary text-secondary",
  };
  const style =
    tone === "purple" ? { background: "#7A3DF2", border: "none" } : { border: "none" };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-label-4-semibold ${map[tone]}`}
      style={style}
    >
      {children}
    </span>
  );
}

/* ---------------- Bottom sheet ---------------- */
export function Sheet({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="grab-handle" />
        <div className="flex items-center justify-between px-5 pt-1 pb-2">
          <div className="text-heading-h3-bold text-primary">{title}</div>
          <button className="press flex items-center justify-center rounded-full bg-secondary text-secondary" onClick={onClose} style={{ border: "none", width: 30, height: 30 }}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="scroll-area px-5 pb-6">{children}</div>
      </div>
    </>
  );
}

/* ---------------- Section header row ---------------- */
export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-heading-h4-bold text-primary">{children}</div>
      {right}
    </div>
  );
}
