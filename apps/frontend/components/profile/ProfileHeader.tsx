"use client";

import { Avatar } from "@/components/ui/Avatar";
import type { User, Profile } from "@/types";

interface ProfileHeaderProps {
  user: User;
  profile: Profile;
}

export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:items-start">
      <Avatar
        src={user.profilePicture}
        alt={user.name}
        size="lg"
        className="ring-4 ring-white"
      />
      <div className="text-center sm:text-left">
        <h1 className="text-xl font-bold text-text-primary">{user.name}</h1>
        <p className="text-sm text-text-secondary">@{user.username}</p>
        {profile.occupationStatus && (
          <p className="mt-1 text-sm font-medium text-text-primary">
            {profile.occupationStatus}
          </p>
        )}
        {profile.location && (
          <p className="mt-0.5 text-sm text-text-muted">{profile.location}</p>
        )}
      </div>
    </div>
  );
}
