// components/MobileMenu.tsx
"use client";

import Link from "next/link";
import React from "react";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="mobile-sheet"
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        background: open ? "rgba(0,0,0,.45)" : "transparent",
        pointerEvents: open ? "auto" : "none",
        transition: "background .2s",
      }}
      onClick={onClose}
    >
      <div
        className="mobile-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: 300,
          background: "var(--bg)",
          borderLeft: "1px solid rgba(127,127,127,.25)",
          padding: 16,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .2s",
          boxShadow: "0 0 20px rgba(0,0,0,.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Navigation</h3>
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: 16,
          }}
        >
          <Link href="/" onClick={onClose}>
            🏠 Home
          </Link>
          <Link href="/tabs" onClick={onClose}>
            🧩 Tabs
          </Link>
          <Link href="/courtroom" onClick={onClose}>
            ⚖️ Court Room
          </Link>
          <Link href="/about" onClick={onClose}>
            ℹ️ About
          </Link>
        </nav>

        <button
          className="btn"
          style={{
            marginTop: 16,
            borderRadius: 10,
            padding: "8px 12px",
            border: "1px solid rgba(127,127,127,.35)",
            background: "var(--card)",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
