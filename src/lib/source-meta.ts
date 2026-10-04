import { Database, Facebook, FileText, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { KnowledgeSourceType } from "@/types/knowledge";

interface SourceTypeMeta {
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
  pageNoun: string;
  pageNounSingular: string;
  blockNoun: string;
}

export const sourceTypeMeta: Record<KnowledgeSourceType, SourceTypeMeta> = {
  website: {
    label: "Website",
    shortLabel: "Website",
    Icon: Globe,
    pageNoun: "Pages",
    pageNounSingular: "page",
    blockNoun: "Content blocks",
  },
  facebook: {
    label: "Facebook Page",
    shortLabel: "Facebook",
    Icon: Facebook,
    pageNoun: "Sections",
    pageNounSingular: "section",
    blockNoun: "Content blocks",
  },
  document: {
    label: "Document",
    shortLabel: "Document",
    Icon: FileText,
    pageNoun: "Documents",
    pageNounSingular: "document",
    blockNoun: "Content blocks",
  },
  database: {
    label: "Database",
    shortLabel: "Database",
    Icon: Database,
    pageNoun: "Tables",
    pageNounSingular: "table",
    blockNoun: "Rows",
  },
};

export function sourceMeta(type: KnowledgeSourceType): SourceTypeMeta {
  return sourceTypeMeta[type] ?? sourceTypeMeta.website;
}
