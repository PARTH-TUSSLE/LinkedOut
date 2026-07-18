"use client";

import { useEffect } from "react";
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
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <CreatePostForm />
      <PostList
        posts={posts}
        isLoading={isLoading}
        onRetry={loadPosts}
      />
    </div>
  );
}
