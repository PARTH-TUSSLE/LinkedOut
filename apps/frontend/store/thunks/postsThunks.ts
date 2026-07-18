import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/axios";
import type { Post, Comment, Pagination } from "@/types";

export const fetchPosts = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/posts");
      return {
        posts: response.data.posts as Post[],
        pagination: response.data.pagination as Pagination,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch posts"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/create",
  async (
    data: { body: string; media?: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("body", data.body);
      if (data.media) formData.append("media", data.media);
      const response = await api.post("/create/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.post as Post;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to create post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (postId: number, { rejectWithValue }) => {
    try {
      await api.delete("/delete/post", { data: { postId } });
      return postId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to delete post"
      );
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/like",
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await api.post("/increaseLikes", { postId });
      return { postId, msg: response.data.msg };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to like post"
      );
    }
  }
);

export const unlikePost = createAsyncThunk(
  "posts/unlike",
  async (postId: number, { rejectWithValue }) => {
    try {
      await api.post("/decreaseLikes", { postId });
      return postId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to unlike post"
      );
    }
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      return {
        postId,
        comments: response.data.comments as Comment[],
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch comments"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async (
    data: { postId: number; commentBody: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/create/comment", data);
      return {
        postId: data.postId,
        comment: response.data.addedComment as Comment,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to add comment"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (
    data: { postId: number; commentId: number },
    { rejectWithValue }
  ) => {
    try {
      await api.delete("/delete/comment", { data: { commentId: data.commentId } });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to delete comment"
      );
    }
  }
);
