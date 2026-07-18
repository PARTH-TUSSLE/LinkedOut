import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE_URL } from "@/config/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatYear(date: string | Date | null | undefined) {
  if (!date) return "";
  return new Date(date).getFullYear().toString();
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getFileUrl(filename: string | null | undefined) {
  if (!filename || filename === "default.jpeg") return null;
  return `${API_BASE_URL.replace("/api/v1", "")}/${filename}`;
}
