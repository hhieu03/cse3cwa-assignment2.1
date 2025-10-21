// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import StudentBadge from "./StudentBadge";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";

/** Lưu route cuối vào cookie để dùng breadcrumb/history */
function setLastRouteCookie(path: string) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 ngày
    document.cookie = `lastRoute=${encodeURIComponent(
      path
    )}; expires=${d.toUTCString()}; path=/`;
  } catch {}
}

type NavItem = { href: string; label: string; emoji: string };

export default function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  /** Lưu cookie khi path đổi */
  useEffect(() => {
    setLastRouteCookie(pathname);
  }, [pathname]);

  /** Danh sách menu trên desktop */
  const navItems: NavItem[] = useMemo(
    () => [
      { href: "/", label: "Home", emoji: "🏠" },
      { href: "/tabs", label: "Tabs", emoji: "🧩" },
      { href: "/courtroom", label: "Court Room", emoji: "⚖️" }, // <— ĐÃ THÊM
      { href: "/about", label: "About", emoji: "ℹ️" },
    ],
    []
  );

  /** Breadcrumbs đơn giản từ pathname */
  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts;
  }, [pathname]);

  return (
    <header
      role="banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg)",
        borderBottom: "1px solid rgba(127,127,127,.2)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        {/* Logo / Title */}
        <Link href="/" aria-label="Go to home" className="logo">
          <span style={{ fontWeight: 700, fontSize: 18 }}>LTU CWA</span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hide-on-mobile"
          style={{
            display: "flex",
            gap: 12,
            marginLeft: 12,
            alignItems: "center",
          }}
        >
          {navItems.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="nav-link"
                aria-current={active ? "page" : undefined}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: active ? "var(--bg)" : "var(--fg)",
                  background: active ? "var(--link)" : "transparent",
                  fontWeight: active ? 700 : 500,
                }}
              >
                <span aria-hidden="true" style={{ marginRight: 6 }}>
                  {n.emoji}
                </span>
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div style={{ marginLeft: "auto" }} />

        {/* Actions */}
        <StudentBadge />
        <ThemeToggle />

        {/* Mobile menu button */}
        <button
          aria-label="Open mobile menu"
          onClick={() => setOpen(true)}
          className="show-on-mobile btn"
          style={{
            marginLeft: 8,
            borderRadius: 10,
            padding: "6px 10px",
            border: "1px solid rgba(127,127,127,.35)",
            background: "var(--card)",
            cursor: "pointer",
          }}
        >
          ☰ Menu
        </button>
      </div>

      {/* Breadcrumbs */}
      <div
        className="container"
        aria-label="Breadcrumbs"
        style={{
          paddingTop: 4,
          paddingBottom: 8,
          fontSize: 14,
          color: "var(--muted)",
        }}
      >
        <span>
          <Link href="/">Home</Link>
        </span>
        {crumbs.map((c, i) => (
          <span key={i}>
            {" "}
            /{" "}
            <Link href={"/" + crumbs.slice(0, i + 1).join("/")}>{c}</Link>
          </span>
        ))}
      </div>

      {/* Mobile sheet */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
