/**
 * ERC-8004 Trustless Agents
 * Agent state & reputation tracking utilities.
 */
export interface TrustlessAgent {
  id: string;
  reputation: number;
  activityCount: number;
}

export function calculateAgentReputation(agent: TrustlessAgent): number {
  return agent.reputation + Math.log10(Math.max(agent.activityCount, 1));
}
