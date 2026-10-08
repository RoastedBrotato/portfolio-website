import type { ReviewRelationship } from "@/types";

/**
 * "How do you know me?" on the review form. Shared by the form, the server-side
 * validation and the card, so a label only ever changes in one place.
 */
export const relationships: readonly { value: ReviewRelationship; label: string }[] = [
  { value: "client", label: "Client" },
  { value: "collaborator", label: "Collaborator" },
  { value: "colleague", label: "Colleague" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
];

export function relationshipLabel(value?: string): string | undefined {
  return value ? relationships.find((r) => r.value === value)?.label : undefined;
}

export function isRelationship(value: string): value is ReviewRelationship {
  return relationships.some((r) => r.value === value);
}
