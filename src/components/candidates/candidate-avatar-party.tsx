import { CandidateAvatar } from "./candidate-avatar";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/lib/types";

/**
 * Candidate avatar with their party's short name as a small badge — the party
 * badge is skipped entirely when a party has no recognised abbreviation,
 * rather than inventing one.
 */
export function CandidateAvatarWithParty({
  candidate,
  size = "md",
  className,
}: {
  candidate: Candidate;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const short = candidate.party?.short_name;
  return (
    <div className={cn("relative shrink-0", className)}>
      <CandidateAvatar
        name={candidate.name}
        color={candidate.party?.color}
        photoUrl={candidate.photo_url}
        size={size}
      />
      {short && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full border-2 border-card font-bold leading-none text-white",
            size === "xl" ? "h-6 min-w-6 px-1.5 text-[10px]" : "h-5 min-w-5 px-1 text-[9px]"
          )}
          style={{ background: candidate.party?.color ?? "var(--primary)" }}
        >
          {short}
        </span>
      )}
    </div>
  );
}
