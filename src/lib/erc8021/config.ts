export const ERC8021_CONFIG = {
  ATTRIBUTION_CODE: "[ATTRIBUTION_CODE]",
  BUILDER_CODE: "bc_wiuk1ety"
};

/**
 * Utility to encode an attribution code to be included in calldata or event.
 */
export function encodeAttributionData(attributionCode: string, builderCode: string): string {
  // Mock encoding logic - normally this creates appended calldata hex
  return `0x000000000000000000000000${attributionCode}${builderCode}`;
}
