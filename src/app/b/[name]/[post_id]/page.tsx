"use client";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import VoteButton from "../../../components/VoteButton";
import CommentList from "../../../components/CommentList";
import CreateCommentForm from "../../../components/CreateCommentForm";

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

  // Calculate post vote score
  const postVoteScore = post.votes?.reduce((sum: number, vote: { value: number }) => sum + vote.value, 0) || 0;

  // Find current user's vote on post
  const currentUserVote = post.votes?.find((vote: { user: { id: string } }) =>
    vote.user?.id === session?.user?.id
  )?.value || 0;

  const handleCommentCreated = () => {
    refetch();
  };

  const handleVoteChange = (commentId: string, newScore: number) => {
    // This would typically update the cache, but for now we'll refetch
    refetch();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/b/${sub.name}`} className="text-blue-600 hover:underline">b/{sub.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Post</span>
      </nav>

      {/* Post */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-start space-x-4">
          <VoteButton
            votableId={post.id}
            votableType="Post"
            currentVote={currentUserVote}
            score={postVoteScore}
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
              Posted by {post.user?.name || post.user?.email || "Anonymous"} in b/{sub.name}
            </div>
            <div className="text-gray-800 mb-4 whitespace-pre-wrap">{post.body}</div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Comments</h2>

        {/* Comment Form for logged-in users */}
        {session && (
          <CreateCommentForm
            postId={post.id}
            onCommentCreated={handleCommentCreated}
          />
        )}

        {/* Comments List */}
        <CommentList
          comments={post.comments || []}
          currentUserId={session?.user?.id}
          onVoteChange={handleVoteChange}
        />

        {!session && (
          <div className="text-center py-8 text-gray-500">
            <p>Please sign in to comment and vote.</p>
          </div>
        )}
      </div>
    </div>
  );
}
