import { Swoosh } from "@/components/ui/swoosh";

/** Annotation manuscrite décorative — toujours aria-hidden, jamais porteuse d'information. */
export function HandNote({
  children,
  className,
  tone = "primary",
  underline = true,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "primary" | "danger";
  underline?: boolean;
}) {
  const textClass = tone === "danger" ? "text-danger" : "text-primary";
  const strokeClass = tone === "danger" ? "text-danger/60" : "text-primary/60";
  return (
    <span aria-hidden="true" className={className}>
      <span className={`relative inline-block font-hand text-[1.15rem] leading-[1.15] ${textClass}`}>
        {children}
        {underline && <Swoosh className={`-bottom-1.5 ${strokeClass}`} />}
      </span>
    </span>
  );
}
