"use client";

import { Pencil, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ResumeDownloadButton } from "./ResumeDownloadButton";
import type { Profile, User } from "@/types";

interface ProfileHeaderProps {
  user: {
    id: number;
    name: string;
    username: string;
    profilePicture?: string | null;
  };
  profile: {
    occupationStatus?: string | null;
    location?: string | null;
  };
  isOwn?: boolean;
}

export function ProfileHeader({ user, profile, isOwn = false }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <Avatar src={user.profilePicture} alt={user.name} size="xl" className="ring-2 ring-border shrink-0" />
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-h3 text-text-primary">{user.name}</h1>
        <p className="text-body-sm text-text-tertiary">@{user.username}</p>
        {profile.occupationStatus && (
          <p className="mt-1 flex items-center justify-center gap-1.5 text-body-sm font-medium text-text-secondary sm:justify-start">
            <Briefcase size={14} />
            {profile.occupationStatus}
          </p>
        )}
        {profile.location && (
          <p className="mt-0.5 flex items-center justify-center gap-1.5 text-body-sm text-text-tertiary sm:justify-start">
            <MapPin size={14} />
            {profile.location}
          </p>
        )}
      </div>
      {isOwn && (
        <div className="flex gap-2 shrink-0">
          <ResumeDownloadButton userId={user.id} />
          <Link href="/profile/edit">
            <Button variant="secondary" size="sm">
              <Pencil size={14} />
              Edit
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
