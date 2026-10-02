import type { Metadata } from "next";
import { KnowledgeBaseView } from "@/components/knowledge/knowledge-base-view";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description:
    "Connect websites and Facebook Pages, then crawl, chunk, embed and index them for your AI agent.",
};

export default function KnowledgeBasePage() {
  return <KnowledgeBaseView />;
}
