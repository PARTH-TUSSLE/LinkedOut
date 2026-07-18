export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
}

export interface Education {
  id?: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface WorkHistory {
  id?: number;
  company: string;
  location?: string;
  position: string;
  years: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string;
}

export interface Profile {
  id: number;
  userId: number;
  bio?: string;
  occupationStatus?: string;
  location?: string;
  education: Education[];
  workHistory: WorkHistory[];
  user?: {
    name: string;
    username: string;
    email: string;
    profilePicture: string;
  };
}

export interface Post {
  postId: number;
  creatorId: number;
  body: string;
  likes: number;
  media: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  creator?: {
    id: number;
    name: string;
    username: string;
    profilePicture: string;
  };
  likedByUser?: boolean;
}

export interface Comment {
  commentId: number;
  body: string;
  creatorId: number;
  postId: number;
  creator?: {
    id: number;
    name: string;
    username: string;
    profilePicture: string;
  };
}

export interface Connection {
  connectionId: number;
  senderId: number;
  receiverId: number;
  status: string;
  createdAt: string;
  sender?: {
    id: number;
    name: string;
    username: string;
  };
  receiver?: {
    id: number;
    name: string;
    username: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  msg?: string;
  data?: T;
}
