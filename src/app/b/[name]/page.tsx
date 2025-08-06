"use client";
import { useSession } from "next-auth/react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { PostCard } from "@/components/ui/PostCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SUBBLUEDIT_FIELDS, POST_FIELDS } from "@/lib/graphql/fragments";

// Type for raw post data from GraphQL (before transformation)
interface RawPost {
  id: string;
  title: string;
  body: string;
  user?: {
    name: string;
  };
  comments?: Array<{
    id: string;
    body: string;
    user?: {
      name: string;
    };
  }>;
  votes?: Array<{
    value: number;
    user?: {
      id: string;
    };
  }>;
}

const SUBBLUEDIT_BY_NAME = gql`
  ${SUBBLUEDIT_FIELDS}
  query SubblueditByName($name: String!) {
    subblueditByName(name: $name) {
      ...SubblueditFields
    }
  }
`;

const CREATE_POST = gql`
  ${POST_FIELDS}
  mutation CreatePost($subblueditName: String!, $title: String!, $body: String) {
    createPost(subblueditName: $subblueditName, title: $title, body: $body) {
      ...PostFields
    }
  }
`;

export default function SubblueditPage() {
  const { name } = useParams<{ name: string }>();
  const { data: session, status } = useSession();
  const { data, loading, error } = useQuery(SUBBLUEDIT_BY_NAME, {
    variables: { name },
    skip: !name
  });
  const [createPost, { loading: creating }] = useMutation(CREATE_POST);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState("");

  if (loading) return (
    <div className="max-w-content mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-light-border rounded mb-4"></div>
        <div className="h-4 bg-light-border rounded mb-8"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-light-border rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-content mx-auto px-4 py-8">
      <Card className="border-red-200 bg-red-50">
        <div className="p-6">
          <p className="text-red-800">Error: {error.message}</p>
        </div>
      </Card>
    </div>
  );

  if (!data?.subblueditByName) return (
    <div className="max-w-content mx-auto px-4 py-8">
      <Card>
        <div className="p-6">
          <p className="text-light-text-secondary">Subbluedit b/{name} not found.</p>
        </div>
      </Card>
    </div>
  );

  const sub = data.subblueditByName;

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      await createPost({
        variables: { subblueditName: sub.name, title, body },
        update: (cache, { data }) => {
          // Update the subbluedit's posts in the cache
          cache.modify({
            id: cache.identify({ __typename: 'Subbluedit', name: sub.name }),
            fields: {
              posts(existingPosts = []) {
                // Add the new post to the beginning of the list
                return [data.createPost, ...existingPosts];
              }
            }
          });
        }
      });
      setTitle("");
      setBody("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Failed to create post");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          {/* Subbluedit Header */}
          <div className="mb-6">
            <div className="p-4">
              <h1 className="text-2xl font-semibold mb-2">b/{sub.name}</h1>
              <p className="text-light-text-secondary">{sub.description}</p>
            </div>
          </div>

          {/* Create Post Form */}
          {status === "authenticated" && (
            <div className="mb-6">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Create a Post</h2>
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-light-text-primary">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-light-border rounded-md bg-black text-light-text-primary transition-colors duration-150"
                      placeholder="Post title..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-light-text-primary">
                      Body
                    </label>
                    <textarea
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-light-border rounded-md bg-black text-light-text-primary transition-colors duration-150 resize-none"
                      placeholder="What's on your mind?"
                    />
                  </div>
                  {formError && (
                    <p className="text-red-600 text-sm">{formError}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={creating}
                    className="w-full sm:w-auto"
                  >
                    {creating ? "Posting..." : "Create Post"}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {status !== "authenticated" && (
            <div className="mb-6">
              <div className="p-6">
                <p className="text-light-text-secondary text-center">
                  Sign in to create a post.
                </p>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="overflow-hidden">
            <div className="px-4 py-3 border-b border-light-border">
              <h2 className="text-lg font-semibold text-light-text-primary">
                Posts
              </h2>
            </div>

            {sub.posts.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-light-text-secondary">No posts yet. Be the first to post!</p>
              </div>
            ) : (
              <div>
                {sub.posts.map((post: RawPost) => {
                  // Calculate vote score from votes array
                  const score = post.votes?.reduce((sum, vote) => sum + vote.value, 0) || 0;

                  // Find current user's vote (assuming session.user.id exists)
                  const currentUserVote = post.votes?.find(vote =>
                    vote.user?.id === session?.user?.id
                  )?.value || 0;

                  return (
                    <PostCard
                      key={post.id}
                      post={{
                        id: post.id,
                        title: post.title,
                        body: post.body,
                        score,
                        userVote: currentUserVote,
                        user: post.user,
                        commentCount: post.comments?.length || 0,
                      }}
                      subblueditName={sub.name}
                      showSubbluedit={false}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-black rounded-lg p-4 sticky top-4">
            <h3 className="font-semibold text-white mb-3">About b/{sub.name}</h3>
            <p className="text-white mb-4">{sub.description}</p>
            <div className="text-sm text-gray-300 space-y-1">
              <p>Created recently</p>
              <p>Public community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

