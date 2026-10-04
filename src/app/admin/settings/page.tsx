import type { Metadata } from "next";
import { PlatformSettingsView } from "@/components/admin/platform-settings-view";

export const metadata: Metadata = {
  title: "Platform Settings",
  description: "Developer controls for the SupportBrain AI platform.",
};

export default function AdminSettingsPage() {
  return <PlatformSettingsView />;
}
