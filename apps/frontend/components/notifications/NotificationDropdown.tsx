"use client";

import { Bell } from "lucide-react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";

export function NotificationDropdown() {
  return (
    <DropdownMenu
      trigger={
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-card-hover transition-colors">
          <Bell size={14} />
        </button>
      }
      items={[
        {
          label: "No notifications yet",
          onClick: () => {},
        },
      ]}
    />
  );
}
