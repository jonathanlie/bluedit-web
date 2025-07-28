"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

const CREATE_SUBBLUEDIT = gql`
  mutation CreateSubbluedit($name: String!, $description: String) {
    createSubbluedit(name: $name, description: $description) {
      id
      name
    }
  }
`;

export default function CreateSubblueditPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [createSubbluedit, { loading }] = useMutation(CREATE_SUBBLUEDIT);

  if (status === "loading") return <p>Loading...</p>;
  if (status !== "authenticated") return <p>You must be signed in to create a Subbluedit.</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await createSubbluedit({ variables: { name, description } });
      if (data?.createSubbluedit?.name) {
        router.push(`/b/${encodeURIComponent(data.createSubbluedit.name)}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create Subbluedit");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create a Subbluedit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Subbluedit"}
        </button>
      </form>
    </div>
  );
}
