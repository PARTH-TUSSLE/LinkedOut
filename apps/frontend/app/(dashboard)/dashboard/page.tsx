"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPosts } from "@/store/thunks/postsThunks";
import { setPosts, setPostsLoading } from "@/store/slices/postsSlice";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { PostList } from "@/components/posts/PostList";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { posts, isLoading } = useAppSelector((state) => state.posts);

  const loadPosts = () => {
    dispatch(setPostsLoading(true));
    dispatch(fetchPosts())
      .unwrap()
      .then((result) => {
        dispatch(setPosts({ posts: result.posts, pagination: result.pagination }));
      })
      .catch(() => {})
      .finally(() => dispatch(setPostsLoading(false)));
  };

  useEffect(() => {
    loadPosts();
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl space-y-4 p-4 sm:p-6"
    >
      <div className="mb-8">
        <h1 className="text-h3 text-text-primary">Feed</h1>
        <p className="mt-1 text-body-sm text-text-secondary">Latest updates from your network</p>
      </div>
      <CreatePostForm />
      <PostList
        posts={posts}
        isLoading={isLoading}
        onRetry={loadPosts}
      />
    </motion.div>
  );
}
