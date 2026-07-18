"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Feed", icon: LayoutDashboard },
  { href: "/network", label: "Network", icon: Users },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface lg:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
