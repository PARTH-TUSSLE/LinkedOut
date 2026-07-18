import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post, Comment, Pagination } from "@/types";

export interface PostsState {
  posts: Post[];
  isLoading: boolean;
  isCreating: boolean;
  pagination: Pagination | null;
  comments: Record<number, Comment[]>;
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  isCreating: false,
  pagination: null,
  comments: {},
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(
      state,
      action: PayloadAction<{ posts: Post[]; pagination: Pagination }>
    ) {
      state.posts = action.payload.posts;
      state.pagination = action.payload.pagination;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
    },
    removePost(state, action: PayloadAction<number>) {
      state.posts = state.posts.filter(
        (p) => p.postId !== action.payload
      );
    },
    updatePostLikes(
      state,
      action: PayloadAction<{ postId: number; likes: number; likedByUser: boolean }>
    ) {
      const post = state.posts.find((p) => p.postId === action.payload.postId);
      if (post) {
        post.likes = action.payload.likes;
        post.likedByUser = action.payload.likedByUser;
      }
    },
    setPostsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setCreating(state, action: PayloadAction<boolean>) {
      state.isCreating = action.payload;
    },
    setComments(
      state,
      action: PayloadAction<{ postId: number; comments: Comment[] }>
    ) {
      state.comments[action.payload.postId] = action.payload.comments;
    },
    addComment(
      state,
      action: PayloadAction<{ postId: number; comment: Comment }>
    ) {
      const { postId, comment } = action.payload;
      if (!state.comments[postId]) {
        state.comments[postId] = [];
      }
      state.comments[postId].push(comment);
    },
    removeComment(
      state,
      action: PayloadAction<{ postId: number; commentId: number }>
    ) {
      const { postId, commentId } = action.payload;
      if (state.comments[postId]) {
        state.comments[postId] = state.comments[postId].filter(
          (c) => c.commentId !== commentId
        );
      }
    },
    updatePostCommentCount(
      state,
      action: PayloadAction<{ postId: number; delta: number }>
    ) {
      const post = state.posts.find((p) => p.postId === action.payload.postId);
      if (post) {
        post.commentCount = (post.commentCount ?? 0) + action.payload.delta;
      }
    },
  },
});

export const {
  setPosts,
  addPost,
  removePost,
  updatePostLikes,
  setPostsLoading,
  setCreating,
  setComments,
  addComment,
  removeComment,
  updatePostCommentCount,
} = postsSlice.actions;
export default postsSlice.reducer;
