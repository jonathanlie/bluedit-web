"use client";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useSession } from "next-auth/react";

const VOTE = gql`
  mutation Vote($votableId: ID!, $votableType: String!, $value: Int!) {
    vote(votableId: $votableId, votableType: $votableType, value: $value)
  }
`;

interface VoteButtonProps {
  votableId: string;
  votableType: "Post" | "Comment";
  currentVote?: number;
  score: number;
}

export default function VoteButton({
  votableId,
  votableType,
  currentVote = 0,
  score,
}: VoteButtonProps) {
  const [vote, { loading }] = useMutation(VOTE);
  const [localScore, setLocalScore] = useState(score);
  const [localVote, setLocalVote] = useState(currentVote);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const handleVote = async (value: number) => {
    if (loading) return;

    // Optimistically update local state for instant feedback
    let newScore = localScore;
    let newVote = localVote;

    if (localVote === value) {
      newScore -= value;
      newVote = 0;
    } else if (localVote === 0) {
      newScore += value;
      newVote = value;
    } else {
      newScore = newScore - localVote + value;
      newVote = value;
    }

    setLocalScore(newScore);
    setLocalVote(newVote);

    try {
      await vote({
        variables: {
          votableId,
          votableType,
          value
        },
        update: (cache, { data }) => {}
      });

    } catch (error) {
      console.error("Vote failed:", error);

      // Revert optimistic update on error
      setLocalScore(score);
      setLocalVote(currentVote);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-full h-8 w-8 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none ${
          localVote === 1
            ? "text-brand hover:text-brand/80"
            : "text-light-text-secondary hover:text-light-text-primary hover:bg-gray-700"
        }`}
        aria-label="Upvote"
      >
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
      </button>
      <span className={`text-sm font-medium min-w-[2rem] text-center ${
        localScore > 0 ? "text-brand" : localScore < 0 ? "text-brand-secondary" : "text-light-text-secondary"
      }`}>
        {localScore}
      </span>
      <button
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-full h-8 w-8 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none ${
          localVote === -1
            ? "text-brand-secondary hover:text-brand-secondary/80"
            : "text-light-text-secondary hover:text-light-text-primary hover:bg-gray-700"
        }`}
        aria-label="Downvote"
      >
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
      </button>
    </div>
  );
}
