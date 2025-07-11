import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Optional helper to detect mobile from user-agent
export function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return /iPhone|Android.*Mobile|Windows Phone/i.test(userAgent);
}
