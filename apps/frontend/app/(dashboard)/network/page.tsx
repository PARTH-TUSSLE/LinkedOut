"use client";

import { useEffect } from "react";
import { Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAllUsers,
  fetchSentRequests,
  fetchReceivedRequests,
  fetchConnections,
} from "@/store/thunks/connectionsThunks";
import {
  setAllUsers,
  setSentRequests,
  setReceivedRequests,
  setConnections,
  setConnectionsLoading,
} from "@/store/slices/connectionsSlice";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { ConnectButton } from "@/components/connections/ConnectButton";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import Link from "next/link";

export default function NetworkPage() {
  const dispatch = useAppDispatch();
  const { allUsers, isLoading } = useAppSelector(
    (state) => state.connections
  );
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const loadUsers = () => {
    dispatch(setConnectionsLoading(true));
    Promise.all([
      dispatch(fetchAllUsers()).unwrap(),
      dispatch(fetchSentRequests()).unwrap(),
      dispatch(fetchReceivedRequests()).unwrap(),
      dispatch(fetchConnections()).unwrap(),
    ])
      .then(([users, sent, received, conns]) => {
        dispatch(setAllUsers(users));
        dispatch(setSentRequests(sent));
        dispatch(setReceivedRequests(received));
        dispatch(setConnections(conns));
      })
      .catch(() => {})
      .finally(() => dispatch(setConnectionsLoading(false)));
  };

  useEffect(() => {
    loadUsers();
  }, [dispatch]);

  const filteredUsers = allUsers.filter(
    (p) => p.userId !== currentUser?.id
  );

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">Network</h1>
        <p className="text-sm text-text-secondary">
          Discover and connect with other professionals
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size={24} />
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="There are no other users to connect with yet."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredUsers.map((profile) => (
            <Card key={profile.id} className="p-4">
              <div className="flex flex-col items-center text-center">
                <Link href={`/profile/${profile.userId}`}>
                  <Avatar
                    src={profile.user?.profilePicture}
                    alt={profile.user?.name || "User"}
                    size="lg"
                  />
                </Link>
                <Link
                  href={`/profile/${profile.userId}`}
                  className="mt-3 text-sm font-medium text-text-primary hover:text-primary"
                >
                  {profile.user?.name || "Unknown"}
                </Link>
                <p className="text-xs text-text-muted">
                  @{profile.user?.username}
                </p>
                {profile.occupationStatus && (
                  <p className="mt-1 text-xs text-text-secondary">
                    {profile.occupationStatus}
                  </p>
                )}
                {profile.location && (
                  <p className="text-xs text-text-muted">{profile.location}</p>
                )}
                <div className="mt-3">
                  <ConnectButton userId={profile.userId} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
