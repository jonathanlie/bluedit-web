"use client";
import { useSession } from "next-auth/react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useParams } from "next/navigation";

const SUBBLUEDIT_BY_NAME = gql`
  query SubblueditByName($name: String!) {
    subblueditByName(name: $name) {
      id
      name
      description
      posts {
        id
        title
        body
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($subblueditId: ID!, $title: String!, $body: String) {
    createPost(subblueditId: $subblueditId, title: $title, body: $body) {
      id
      title
      body
    }
  }
`;

export default function SubblueditPage() {
  const { name } = useParams<{ name: string }>();
  const { data: session, status } = useSession();
  const { data, loading, error, refetch } = useQuery(SUBBLUEDIT_BY_NAME, {
    variables: { name },
    skip: !name
  });
  const [createPost, { loading: creating }] = useMutation(CREATE_POST);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;
  if (!data?.subblueditByName) return <p>Subbluedit b/{name} not found.</p>;

  const sub = data.subblueditByName;

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      await createPost({ variables: { subblueditId: sub.id, title, body } });
      setTitle("");
      setBody("");
      refetch();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Failed to create post");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-2">b/{sub.name}</h1>
      <p className="mb-6 text-gray-700">{sub.description}</p>
      <h2 className="text-xl font-semibold mb-2">Posts</h2>
      <ul className="mb-6 space-y-4">
        {sub.posts.length === 0 && <li className="text-gray-500">No posts yet.</li>}
        {sub.posts.map((post: { id: string; title: string; body: string }) => (
          <li key={post.id} className="border rounded p-3">
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {status === "authenticated" && (
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold">Create a Post</h3>
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Body</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          {formError && <p className="text-red-600">{formError}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={creating}
          >
            {creating ? "Posting..." : "Create Post"}
          </button>
        </form>
      )}
      {status !== "authenticated" && (
        <p className="text-gray-500 mt-4">Sign in to create a post.</p>
      )}
    </div>
  );
}
