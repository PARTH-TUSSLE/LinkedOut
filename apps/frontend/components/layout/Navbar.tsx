"use client";

import { Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { Avatar } from "@/components/ui/Avatar";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Navbar() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg-elevated">
      <div className="flex h-12 items-center justify-between px-4 lg:px-6">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-lg p-1.5 text-text-tertiary transition-colors hover:bg-card-hover lg:hidden"
        >
          <Menu size={17} />
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <ThemeToggle />
          {user && (
            <UserMenu
              trigger={
                <button className="rounded-full transition-all duration-150 hover:ring-2 hover:ring-ring ml-1">
                  <Avatar
                    src={user.profilePicture}
                    alt={user.name}
                    size="sm"
                  />
                </button>
              }
            />
          )}
        </div>
      </div>
    </header>
  );
}
