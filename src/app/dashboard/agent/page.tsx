import type { Metadata } from "next";
import { AgentWorkspace } from "@/components/agent/agent-workspace";

export const metadata: Metadata = { title: "AI Agent" };

export default function AgentPage() {
  return <AgentWorkspace />;
}
