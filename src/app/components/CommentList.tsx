"use client";
import Comment from "./Comment";

interface CommentListProps {
  comments: Array<{
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
    replies?: CommentListProps["comments"];
  }>;
  currentUserId?: string;
  onVoteChange?: (commentId: string, newScore: number) => void;
}

export default function CommentList({ comments, currentUserId, onVoteChange }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onVoteChange={onVoteChange}
        />
      ))}
    </div>
  );
}
