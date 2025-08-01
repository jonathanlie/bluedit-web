"use client";
import VoteButton from "./VoteButton";

interface CommentProps {
  comment: {
    id: string;
    body: string;
    user?: {
      name?: string;
      email: string;
    };
    votes?: Array<{
      value: number;
      user?: {
        id: string;
      };
    }>;
    replies?: CommentProps["comment"][];
  };
  currentUserId?: string;
  onVoteChange?: (commentId: string, newScore: number) => void;
}

export default function Comment({ comment, currentUserId, onVoteChange }: CommentProps) {
  // Calculate vote score
  const voteScore = comment.votes?.reduce((sum, vote) => sum + vote.value, 0) || 0;

  // Find current user's vote
  const currentVote = comment.votes?.find(vote => vote.user?.id === currentUserId)?.value || 0;

  const handleVoteChange = (newScore: number) => {
    onVoteChange?.(comment.id, newScore);
  };

  return (
    <div className="border-l-2 border-gray-200 pl-4 mb-4">
      <div className="flex items-start space-x-3">
        <VoteButton
          votableId={comment.id}
          votableType="Comment"
          currentVote={currentVote}
          score={voteScore}
          onVoteChange={handleVoteChange}
        />
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-1">
            {comment.user?.name || comment.user?.email || "Anonymous"}
          </div>
          <div className="text-gray-800 mb-2">{comment.body}</div>

          {/* Render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-2">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onVoteChange={onVoteChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
