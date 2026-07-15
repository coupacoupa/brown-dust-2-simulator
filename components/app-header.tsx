"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Global chrome: brand (→ boss list), primary nav, and the top-right menu
// holding account (roster) and admin entries.
export default function AppHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const navLink = (href: string, label: string, exact = false) => {
    const active = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
          active
            ? "bg-zinc-900 text-indigo-300 shadow-sm"
            : "text-zinc-450 hover:text-zinc-200 hover:bg-zinc-900/50"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="relative w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md z-40 py-4 px-6 md:px-12 flex items-center justify-between gap-4 overflow-visible">
      {/* Glow behind title */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-[64px] pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/10 rounded-full blur-[64px] pointer-events-none" />

      <div className="flex items-center gap-6 z-10 min-w-0">
        <Link href="/" className="flex flex-col gap-0.5 group shrink-0">
          <span className="text-lg font-black tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent uppercase group-hover:opacity-80 transition-opacity">
            Brown Dust 2 Simulator
          </span>
          <span className="text-[10px] font-semibold text-zinc-500 tracking-wide">
            Fiend Hunt & Guild Raid Combat Optimizer
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/25 border border-zinc-900 p-1 rounded-xl">
          {navLink("/", "Bosses", true)}
          {navLink("/roster", "My Roster")}
        </nav>
      </div>

      {/* Top-right menu */}
      <div className="relative z-10" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            menuOpen
              ? "border-indigo-500/50 bg-indigo-950/20 text-indigo-300"
              : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white">
            ME
          </span>
          Account
          <span className={`text-[8px] transition-transform ${menuOpen ? "rotate-180" : ""}`}>▼</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden animate-fadeIn">
            <div className="px-4 py-3 border-b border-zinc-900">
              <p className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Local Account</p>
              <p className="text-[9px] text-zinc-550 mt-0.5">Saved in this browser</p>
            </div>
            <Link
              href="/roster"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-indigo-300 transition-colors"
            >
              🎭 My Roster
              <span className="ml-auto text-[8px] text-zinc-600 uppercase font-black">Sync</span>
            </Link>
            <div className="border-t border-zinc-900">
              <p className="px-4 pt-2.5 pb-1 text-[8px] font-black text-zinc-600 uppercase tracking-widest">Admin</p>
              <Link
                href="/admin/bosses"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-amber-300 transition-colors"
              >
                👾 Manage Bosses
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
