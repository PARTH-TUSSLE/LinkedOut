"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserProfile as fetchUserProfileThunk } from "@/store/thunks/profileThunks";
import {
  fetchSentRequests,
  fetchReceivedRequests,
  fetchConnections,
} from "@/store/thunks/connectionsThunks";
import {
  setSentRequests,
  setReceivedRequests,
  setConnections,
} from "@/store/slices/connectionsSlice";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { ProfileEducation } from "@/components/profile/ProfileEducation";
import { ProfileWorkHistory } from "@/components/profile/ProfileWorkHistory";
import { ResumeDownloadButton } from "@/components/profile/ResumeDownloadButton";
import { ConnectButton } from "@/components/connections/ConnectButton";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import type { User, Profile } from "@/types";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<{ user: User; profile: Profile } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = Number(params.userId);

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      setError("Invalid user ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      dispatch(fetchUserProfileThunk(userId)).unwrap(),
      dispatch(fetchSentRequests()).unwrap(),
      dispatch(fetchReceivedRequests()).unwrap(),
      dispatch(fetchConnections()).unwrap(),
    ])
      .then(([profileData, sent, received, conns]) => {
        setData({
          user: profileData.user,
          profile: profileData.profile,
        });
        dispatch(setSentRequests(sent));
        dispatch(setReceivedRequests(received));
        dispatch(setConnections(conns));
      })
      .catch((err: any) => {
        setError(typeof err === "string" ? err : "User not found");
      })
      .finally(() => setLoading(false));
  }, [dispatch, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4">
        <ErrorState message={error || "User not found"} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft size={16} />
        Back
      </Button>

      <div className="relative rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex-1">
            <ProfileHeader user={data.user} profile={data.profile} />
          </div>
          <div className="flex gap-2">
            <ResumeDownloadButton userId={data.user.id} />
            <ConnectButton userId={data.user.id} />
          </div>
        </div>
      </div>

      <ProfileBio bio={data.profile.bio} />
      <ProfileEducation education={data.profile.education} />
      <ProfileWorkHistory workHistory={data.profile.workHistory} />
    </div>
  );
}
