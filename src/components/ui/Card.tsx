import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "rounded-lg border border-light-border bg-light-fg shadow-sm",
  {
    variants: {
      variant: {
        default: "border-light-border",
        elevated: "border-light-border shadow-md",
        interactive: "border-light-border hover:border-light-text-secondary transition-colors duration-150 cursor-pointer",
      },
      padding: {
        default: "p-4",
        sm: "p-3",
        lg: "p-6",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card, cardVariants };
