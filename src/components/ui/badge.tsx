import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface-strong text-foreground",
        primary: "bg-primary-soft text-primary",
        accent: "bg-accent-soft text-accent",
        success: "bg-success-soft text-success",
        danger: "bg-danger-soft text-danger",
        outline: "border border-border-strong text-muted",
        demo: "bg-amber-50 text-amber-800 border border-amber-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
