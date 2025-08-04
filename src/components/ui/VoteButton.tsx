import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const voteButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "text-light-text-secondary hover:text-light-text-primary hover:bg-gray-100",
        upvoted: "text-brand hover:text-brand/80",
        downvoted: "text-brand-secondary hover:text-brand-secondary/80",
      },
      size: {
        default: "h-8 w-8",
        sm: "h-6 w-6",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface VoteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof voteButtonVariants> {
  direction: 'up' | 'down';
  isVoted?: boolean;
  voteValue?: number; // 1 for upvote, -1 for downvote, 0 for no vote
  score?: number;
  onVote?: (direction: 'up' | 'down') => void;
}

const VoteButton = React.forwardRef<HTMLButtonElement, VoteButtonProps>(
  ({
    className,
    variant,
    size,
    direction,
    isVoted = false,
    voteValue = 0,
    score = 0,
    onVote,
    ...props
  }, ref) => {
    // Determine variant based on vote state
    const getVariant = (): "default" | "upvoted" | "downvoted" => {
      if (direction === 'up' && voteValue === 1) return 'upvoted';
      if (direction === 'down' && voteValue === -1) return 'downvoted';
      return 'default';
    };

    const handleClick = () => {
      onVote?.(direction);
    };

    return (
      <button
        ref={ref}
        className={cn(voteButtonVariants({ variant: getVariant(), size, className }))}
        onClick={handleClick}
        aria-label={`${direction}vote`}
        aria-pressed={isVoted}
        {...props}
      >
        {direction === 'up' ? (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    );
  }
);

VoteButton.displayName = "VoteButton";

export { VoteButton, voteButtonVariants };
