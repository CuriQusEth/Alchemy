export const AGENT_REGISTRY_ADDRESS = "0x0000000000000000000000000000000000000000";

export function getAgentData(agentId: string) {
  // Returns formatted agent data based on ERC-8004
  return {
    id: agentId,
    verified: true
  };
}
