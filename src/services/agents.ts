import { mockAgent } from "@/data/mock-agent";
import { sleep } from "@/lib/utils";
import { knowledgeService } from "./knowledge";
import type { AIAgent, AgentReply } from "@/types/agent";

let agent: AIAgent = { ...mockAgent };

export const agentService = {
  async getAgent(): Promise<AIAgent> {
    await sleep(30);
    return agent;
  },

  async updateAgent(patch: Partial<AIAgent>): Promise<AIAgent> {
    await sleep(300);
    agent = { ...agent, ...patch, updatedAt: new Date().toISOString() };
    return agent;
  },

  async setStatus(status: AIAgent["status"]): Promise<AIAgent> {
    agent = { ...agent, status, updatedAt: new Date().toISOString() };
    return agent;
  },

  async toggleKnowledge(sourceId: string, enabled: boolean): Promise<AIAgent> {
    const set = new Set(agent.knowledgeSourceIds);
    if (enabled) set.add(sourceId);
    else set.delete(sourceId);
    agent = {
      ...agent,
      knowledgeSourceIds: Array.from(set),
      updatedAt: new Date().toISOString(),
    };
    return agent;
  },

  async testAgent(question: string): Promise<AgentReply> {
    const answer = await knowledgeService.ask(question, agent.knowledgeSourceIds);
    return {
      id: `rep_${Date.now().toString(36)}`,
      content:
        answer.confidence < agent.confidenceThreshold
          ? agent.fallbackMessage
          : answer.answer,
      confidence: answer.confidence,
      latencyMs: answer.latencyMs,
      model: agent.model,
      usedKnowledge: answer.usedKnowledge,
      retrieved: answer.retrieved.map((chunk) => ({
        id: chunk.id,
        sourceId: chunk.sourceId,
        name: chunk.label,
        type: chunk.kind,
        score: chunk.score,
        snippet: chunk.snippet,
      })),
    };
  },
};

export type AgentService = typeof agentService;
