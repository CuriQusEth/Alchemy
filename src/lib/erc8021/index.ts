export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "[BUILDER_CODE]";

export function getAttributionData(data: string = "0x") {
  // Mock standard ERC-8021 encoding
  return `${data}?attribution=${ATTRIBUTION_CODE}&builder=${BUILDER_CODE}`;
}
