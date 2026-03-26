import type { BrowserAttachment } from "./types.js";
import type { BrowserPromptArtifacts } from "./prompt.js";
import { formatBytes } from "./utils.js";

export function buildTokenEstimateSuffix(artifacts: BrowserPromptArtifacts): string {
  const parts: string[] = [];
  if (artifacts.tokenEstimateIncludesInlineFiles && artifacts.inlineFileCount > 0) {
    const count = artifacts.inlineFileCount;
    const plural = count === 1 ? "" : "s";
    parts.push(`includes ${count} inline file${plural}`);
  }
  const excludedCount = artifacts.excludedAttachmentCount ?? 0;
  if (excludedCount > 0) {
    const plural = excludedCount === 1 ? "" : "s";
    parts.push(`${excludedCount} uploaded attachment${plural} excluded from estimate`);
  }
  return parts.length > 0 ? ` (${parts.join("; ")})` : "";
}

export function buildOpaqueAttachmentWarning(artifacts: BrowserPromptArtifacts): string | null {
  const count = artifacts.excludedAttachmentCount ?? 0;
  if (count <= 0) {
    return null;
  }
  const plural = count === 1 ? "" : "s";
  const sizeBytes = artifacts.excludedAttachmentBytes ?? 0;
  const sizeLabel =
    sizeBytes > 0 ? ` (${formatBytes(sizeBytes)} total)` : "";
  return `Token estimate excludes ${count} uploaded archive/media attachment${plural}${sizeLabel}; Oracle cannot pre-budget those contents before browser upload.`;
}

export function formatAttachmentLabel(attachment: BrowserAttachment): string {
  if (typeof attachment.sizeBytes !== "number" || Number.isNaN(attachment.sizeBytes)) {
    return attachment.displayPath;
  }
  return `${attachment.displayPath} (${formatBytes(attachment.sizeBytes)})`;
}
