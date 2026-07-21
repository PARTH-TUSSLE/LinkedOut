"use client";

import { LogOut, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { logoutUser } from "@/store/thunks/authThunks";
import { DropdownMenu } from "@/components/ui/DropdownMenu";

export function UserMenu({ trigger }: { trigger: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(logout());
    router.push("/signin");
  };

  return (
    <DropdownMenu
      trigger={trigger}
      items={[
        {
          label: "Profile",
          icon: <User size={14} />,
          onClick: () => router.push("/profile"),
        },
        {
          label: "Settings",
          icon: <Settings size={14} />,
          onClick: () => router.push("/settings"),
        },
        {
          label: "Sign out",
          icon: <LogOut size={14} />,
          onClick: handleLogout,
          danger: true,
        },
      ]}
    />
  );
}
