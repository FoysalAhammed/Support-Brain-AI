import { SourceDetailLoader } from "@/components/knowledge/source-detail-loader";

export default async function KnowledgeSourcePage({
  params,
}: {
  params: Promise<{ sourceId: string }>;
}) {
  const { sourceId } = await params;
  return <SourceDetailLoader sourceId={sourceId} />;
}
