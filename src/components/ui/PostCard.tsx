import React from 'react';
import Link from 'next/link';
import { VoteButton } from '@/components/ui/VoteButton';
import { cn } from '@/lib/utils';

export interface Post {
  id: string;
  title: string;
  body: string;
  score: number;
  userVote?: number; // 1 for upvote, -1 for downvote, 0 for no vote
  user?: {
    name: string;
  };
  subbluedit?: {
    name: string;
  };
  createdAt?: string;
  commentCount?: number;
}

export interface PostCardProps {
  post: Post;
  subblueditName?: string;
  showSubbluedit?: boolean;
  className?: string;
  onVote?: (postId: string, direction: 'up' | 'down') => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  subblueditName,
  showSubbluedit = true,
  className,
  onVote,
}) => {
  const handleVote = (direction: 'up' | 'down') => {
    onVote?.(post.id, direction);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className={cn("flex bg-light-fg hover:bg-gray-50 transition-colors duration-150 border-b border-light-border last:border-b-0", className)}>
      {/* Vote Column */}
      <div className="flex flex-col items-center mr-3 py-2 px-2">
        <VoteButton
          direction="up"
          voteValue={post.userVote}
          onVote={handleVote}
          className="mb-1"
        />
        <span className={cn(
          "text-xs font-medium min-w-[1.5rem] text-center",
          post.score > 0 ? "text-brand" : post.score < 0 ? "text-brand-secondary" : "text-light-text-secondary"
        )}>
          {post.score}
        </span>
        <VoteButton
          direction="down"
          voteValue={post.userVote}
          onVote={handleVote}
          className="mt-1"
        />
      </div>

      {/* Content Column */}
      <div className="flex-1 min-w-0 py-2 pr-4">
        {/* Metadata */}
        <div className="flex items-center space-x-2 text-xs text-light-text-secondary mb-1">
          {showSubbluedit && (
            <>
              <Link
                href={`/b/${subblueditName || post.subbluedit?.name}`}
                className="hover:text-light-text-primary transition-colors duration-150"
              >
                r/{subblueditName || post.subbluedit?.name}
              </Link>
              <span>•</span>
            </>
          )}
          <span>Posted by {post.user?.name || 'Anonymous'}</span>
          {post.createdAt && (
            <>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight mb-2">
          <Link
            href={`/b/${subblueditName || post.subbluedit?.name}/${post.id}`}
            className="hover:text-brand transition-colors duration-150"
          >
            {post.title}
          </Link>
        </h3>

        {/* Body */}
        <p className="text-sm text-light-text-primary leading-relaxed line-clamp-3 mb-3">
          {post.body}
        </p>

        {/* Footer */}
        <div className="flex items-center">
          <Link
            href={`/b/${subblueditName || post.subbluedit?.name}/${post.id}`}
            className="text-xs text-light-text-secondary hover:text-light-text-primary transition-colors duration-150 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.commentCount || 0} comments</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export { PostCard };
