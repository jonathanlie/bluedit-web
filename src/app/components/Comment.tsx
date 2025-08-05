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
}

export default function Comment({ comment, currentUserId }: CommentProps) {
  // Calculate vote score
  const voteScore = comment.votes?.reduce((sum, vote) => sum + vote.value, 0) || 0;

  // Find current user's vote
  const currentVote = comment.votes?.find(vote => vote.user?.id === currentUserId)?.value || 0;

  return (
    <div className="border-l-2 border-light-border pl-4 mb-4">
      <div className="flex items-start space-x-3">
        <VoteButton
          votableId={comment.id}
          votableType="Comment"
          currentVote={currentVote}
          score={voteScore}
        />
        <div className="flex-1">
          <div className="text-sm text-light-text-secondary mb-1">
            {comment.user?.name || comment.user?.email || "Anonymous"}
          </div>
          <div className="text-light-text-primary mb-2">{comment.body}</div>

          {/* Render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-2">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
