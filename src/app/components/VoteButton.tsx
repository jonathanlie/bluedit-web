"use client";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

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
  onVoteChange?: (newScore: number) => void;
}

export default function VoteButton({
  votableId,
  votableType,
  currentVote = 0,
  score,
  onVoteChange
}: VoteButtonProps) {
  const [vote, { loading }] = useMutation(VOTE);
  const [localScore, setLocalScore] = useState(score);
  const [localVote, setLocalVote] = useState(currentVote);

  const handleVote = async (value: number) => {
    if (loading) return;

    try {
      await vote({
        variables: {
          votableId,
          votableType,
          value
        }
      });

      // Update local state optimistically
      let newScore = localScore;
      if (localVote === value) {
        // Same vote clicked again - remove vote
        newScore -= value;
        setLocalVote(0);
      } else if (localVote === 0) {
        // No previous vote - add new vote
        newScore += value;
        setLocalVote(value);
      } else {
        // Different vote - change vote
        newScore = newScore - localVote + value;
        setLocalVote(value);
      }

      setLocalScore(newScore);
      onVoteChange?.(newScore);
    } catch (error) {
      console.error("Vote failed:", error);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`p-1 rounded hover:bg-gray-100 ${
          localVote === 1 ? "text-orange-500" : "text-gray-400"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Upvote"
      >
        ▲
      </button>
      <span className="text-sm font-medium min-w-[2rem] text-center">
        {localScore}
      </span>
      <button
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`p-1 rounded hover:bg-gray-100 ${
          localVote === -1 ? "text-blue-500" : "text-gray-400"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Downvote"
      >
        ▼
      </button>
    </div>
  );
}
