import type { WidgetConfig } from "@/types/channel";

/**
 * The copy-paste embed code a business adds to their own website to mount the
 * SupportBrain chat widget. In production a backend would register the org and
 * serve `widget.js`; here the snippet is generated from the live widget config.
 */
export function buildEmbedSnippet(config: WidgetConfig, orgId = "org_northwind") {
  return `<script
  src="https://cdn.supportbrain.ai/widget.js"
  data-org="${orgId}"
  data-position="${config.position}"
  data-theme="${config.theme}"
  data-color="${config.primaryColor}"
  data-agent="${config.agentName}"
  async
></script>`;
}
