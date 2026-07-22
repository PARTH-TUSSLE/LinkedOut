"use client";

import { useEffect } from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-4xl p-4 sm:p-6"
    >
      <div className="mb-8">
        <h1 className="text-h3 text-text-primary">Discover</h1>
        <p className="mt-1 text-body-sm text-text-secondary">
          Find and connect with other professionals
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={<Users size={20} />}
          title="No users found"
          description="There are no other users to connect with yet."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="flex flex-col p-5 text-center transition-all duration-200 hover:border-border-hover">
                <div className="flex-1">
                  <Link href={`/profile/${profile.userId}`}>
                    <Avatar
                      src={profile.user?.profilePicture}
                      alt={profile.user?.name || "User"}
                      size="lg"
                      className="mx-auto ring-2 ring-border"
                    />
                  </Link>
                  <Link
                    href={`/profile/${profile.userId}`}
                    className="mt-3 block text-body-sm font-medium text-text-primary hover:text-accent transition-colors"
                  >
                    {profile.user?.name || "Unknown"}
                  </Link>
                  <Link
                    href={`/profile/${profile.userId}`}
                    className="text-caption text-text-tertiary hover:text-accent transition-colors inline-block"
                  >
                    @{profile.user?.username}
                  </Link>
                  {profile.occupationStatus && (
                    <p className="mt-1 text-caption text-text-secondary">
                      {profile.occupationStatus}
                    </p>
                  )}
                  {profile.location && (
                    <p className="text-caption text-text-tertiary">{profile.location}</p>
                  )}
                </div>
                <div className="mt-4 flex justify-center">
                  <ConnectButton userId={profile.userId} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
