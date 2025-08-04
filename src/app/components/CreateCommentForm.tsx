"use client";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      body
      user {
        name
        email
      }
    }
  }
`;

interface CreateCommentFormProps {
  postId: string;
  onCommentCreated?: () => void;
}

export default function CreateCommentForm({ postId, onCommentCreated }: CreateCommentFormProps) {
  const [createComment, { loading }] = useMutation(CREATE_COMMENT);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!body.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      await createComment({
        variables: {
          postId,
          body: body.trim()
        }
      });

      setBody("");
      onCommentCreated?.();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create comment");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4">
      <h3 className="text-lg font-semibold mb-3 text-light-text-primary">Add a Comment</h3>
      <div className="mb-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What are your thoughts?"
          className="w-full border border-light-border rounded-lg px-3 py-2 bg-black text-light-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors duration-150"
          rows={3}
          required
        />
      </div>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <button
        type="submit"
        disabled={loading || !body.trim()}
        className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
