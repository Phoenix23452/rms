"use server";
import { isMobileDevice } from "@/lib/utils";
import { headers } from "next/headers";

export async function useIsMobile() {
  const ua = (await headers()).get("user-agent");
  const isMobile = isMobileDevice(ua);
  return { isMobile };
}
