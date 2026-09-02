import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "focus-ring h-11 w-full rounded-lg border border-border-strong bg-background px-4 text-sm placeholder:text-muted-2",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "focus-ring w-full rounded-lg border border-border-strong bg-background px-4 py-3 text-sm placeholder:text-muted-2",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium", className)} {...props} />;
}

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "focus-ring h-11 w-full rounded-lg border border-border-strong bg-background px-4 text-sm",
        className
      )}
      {...props}
    />
  )
);
Select.displayName = "Select";
