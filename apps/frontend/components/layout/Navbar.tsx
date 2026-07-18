"use client";

import Link from "next/link";
import { Menu, Bell } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { Avatar } from "@/components/ui/Avatar";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg lg:hidden"
          >
            <Menu size={20} />
          </button>
          <Link href="/dashboard" className="text-lg font-bold text-primary">
            LinkedOut
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg">
            <Bell size={20} />
          </button>
          {user && (
            <UserMenu
              trigger={
                <button className="rounded-full transition-opacity hover:opacity-80">
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
