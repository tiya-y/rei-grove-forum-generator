"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, ClipboardCheck, Clock, Settings } from "lucide-react";
import clsx from "clsx";

// Standard four-page structure — exact labels, icons, and order per the Constitution (§12)
const nav = [
  { href: "/input", label: "Input", icon: Plus },
  { href: "/approve", label: "Approve", icon: ClipboardCheck },
  { href: "/history", label: "History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-gray-100 bg-white h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-lg font-semibold text-gray-900">REI Grove</span>
        <p className="text-xs text-gray-500 mt-0.5">Forum Post Generator</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <Link
          href="/"
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span className="flex-1">Dashboard</span>
        </Link>

        <div className="my-2 border-t border-gray-100" />

        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
