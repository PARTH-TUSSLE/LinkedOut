"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Settings,
  LogOut,
  UserPlus,
  Linkedin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { logoutUser } from "@/store/thunks/authThunks";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { toggleSidebar } from "@/store/slices/uiSlice";

const navItems = [
  { href: "/dashboard", label: "Feed", icon: LayoutDashboard },
  { href: "/network", label: "Discover", icon: Users },
  { href: "/my-network", label: "My Network", icon: UserPlus },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(logout());
    router.push("/signin");
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full w-56 flex-col border-r border-border bg-card shadow-lg transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center gap-2.5 px-5 border-b border-border">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-text shadow-sm">
            <Linkedin size={15} />
          </div>
          <span className="text-body-sm font-semibold text-text-primary">LinkedOut</span>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-body-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-accent-subtle text-accent shadow-sm"
                    : "text-text-tertiary hover:bg-card-hover hover:text-text-secondary"
                )}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="border-t border-border p-3">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-card-hover"
            >
              <Avatar src={user.profilePicture} alt={user.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-body-sm font-medium text-text-primary">
                  {user.name}
                </p>
                <p className="truncate text-caption text-text-tertiary">
                  @{user.username}
                </p>
              </div>
            </Link>
          </div>
        )}

        <div className="border-t border-border p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-body-sm font-medium text-text-tertiary transition-all duration-150 hover:bg-danger-subtle hover:text-danger"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
