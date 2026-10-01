import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-btn px-2 py-0.5 text-xs font-medium leading-5",
  {
    variants: {
      variant: {
        accent:
          "border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]",
        solid: "bg-[var(--accent)] text-white",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--text-secondary)]",
        neutral: "bg-[#f4f4f5] text-[var(--text-secondary)]",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
