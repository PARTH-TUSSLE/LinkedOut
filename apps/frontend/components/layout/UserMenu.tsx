"use client";

import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { logoutUser } from "@/store/thunks/authThunks";

interface UserMenuProps {
  trigger: React.ReactNode;
}

export function UserMenu({ trigger }: UserMenuProps) {
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
          icon: <User size={16} />,
          onClick: () => router.push("/profile"),
        },
        {
          label: "Settings",
          icon: <Settings size={16} />,
          onClick: () => router.push("/settings"),
        },
        {
          label: "Sign out",
          icon: <LogOut size={16} />,
          onClick: handleLogout,
          danger: true,
        },
      ]}
    />
  );
}
