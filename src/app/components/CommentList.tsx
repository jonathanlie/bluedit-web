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
}

export default function CommentList({ comments, currentUserId }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-light-text-secondary text-center py-8">
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
        />
      ))}
    </div>
  );
}
