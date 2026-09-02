import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function CandidateAvatar({
  name,
  color = "#4338ca",
  className,
  size = "md",
}: {
  name: string;
  color?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-20 w-20 text-xl",
    xl: "h-28 w-28 text-3xl",
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        sizes[size],
        className
      )}
      style={{
        background: `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 60%, black))`,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
