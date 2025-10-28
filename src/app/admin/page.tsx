import React from "react";
import AdminDashboard from "./AdminPageClient";

export const dynamic = "force-dynamic"; // SSR with auto-updates

export default async function AdminPage() {
  return <AdminDashboard />;
}
