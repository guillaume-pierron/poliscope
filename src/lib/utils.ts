import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number) {
  return `${Math.round(value)} %`;
}

/** Splits a proposal's comma-separated `tags` column into a clean list. */
export function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** A proposal counts as "chiffrée" when its own sourced text states a number. */
export function isQuantifiedProposal(proposal: { title: string; summary: string }): boolean {
  return /\d/.test(proposal.title) || /\d/.test(proposal.summary);
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
