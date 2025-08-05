"use client";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import VoteButton from "@/app/components/VoteButton";
import CommentList from "@/app/components/CommentList";
import CreateCommentForm from "@/app/components/CreateCommentForm";

const POST_DETAIL = gql`
  query PostDetail($postId: ID!) {
    postById(id: $postId) {
      id
      title
      body
      user {
        name
        email
      }
      votes {
        value
        user {
          id
        }
      }
      comments {
        id
        body
        user {
          name
          email
        }
        votes {
          value
          user {
            id
          }
        }
        replies {
          id
          body
          user {
            name
            email
          }
          votes {
            value
            user {
              id
            }
          }
        }
      }
      subbluedit {
        id
        name
        description
      }
    }
  }
`;

export default function PostDetailPage() {
  const { name, post_id } = useParams<{ name: string; post_id: string }>();
  const { data: session } = useSession();

  const { data, loading, error, refetch } = useQuery(POST_DETAIL, {
    variables: { postId: post_id },
    skip: !post_id
  });

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-red-600 text-center py-8">Error: {error.message}</p>;
  if (!data?.postById) return <p className="text-center py-8">Post not found.</p>;

  const post = data.postById;
  const sub = post.subbluedit;

  const postVoteScore = post.votes?.reduce((sum: number, vote: { value: number }) => sum + vote.value, 0) || 0;

  const currentUserVote = post.votes?.find((vote: { user: { id: string } }) =>
    vote.user?.id === session?.user?.id
  )?.value || 0;

  const handleCommentCreated = () => {
    refetch();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link href="/" className="text-brand hover:underline">Home</Link>
            <span className="mx-2 text-light-text-secondary">/</span>
            <Link href={`/b/${sub.name}`} className="text-brand hover:underline">b/{sub.name}</Link>
            <span className="mx-2 text-light-text-secondary">/</span>
            <span className="text-light-text-secondary">Post</span>
          </nav>

          {/* Post */}
          <div className="mb-6">
            <div className="flex">
              <div className="flex flex-col items-center mr-3 py-2 px-2">
                <VoteButton
                  votableId={post.id}
                  votableType="Post"
                  currentVote={currentUserVote}
                  score={postVoteScore}
                />
              </div>
              <div className="flex-1 py-2 pr-4">
                <h1 className="text-2xl font-bold mb-2 text-light-text-primary">{post.title}</h1>
                <div className="text-sm text-light-text-secondary mb-4">
                  Posted by {post.user?.name || post.user?.email || "Anonymous"} in b/{sub.name}
                </div>
                <div className="text-light-text-primary mb-4 whitespace-pre-wrap leading-relaxed">{post.body}</div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="overflow-hidden">
            <div className="px-4 py-3 border-b border-light-border">
              <h2 className="text-lg font-semibold text-light-text-primary">Comments</h2>
            </div>

            {/* Comment Form for logged-in users */}
            {session && (
              <div className="p-4 border-b border-light-border">
                <CreateCommentForm
                  postId={post.id}
                  onCommentCreated={handleCommentCreated}
                />
              </div>
            )}

            {/* Comments List */}
            <div className="p-4">
              <CommentList
                comments={post.comments || []}
                currentUserId={session?.user?.id}
              />

              {!session && (
                <div className="text-center py-8 text-light-text-secondary">
                  <p>Please sign in to comment and vote.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-black rounded-lg p-4 sticky top-4">
            <h3 className="font-semibold text-white mb-3">About b/{sub.name}</h3>
            <p className="text-sm text-gray-300 mb-4">{sub.description}</p>
            <div className="text-xs text-gray-400">
              <p>Created recently</p>
              <p>Public community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
