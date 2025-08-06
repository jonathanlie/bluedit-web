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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-light-text-primary">Create a Subbluedit</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-light-text-primary">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full border border-light-border px-3 py-2 rounded-md bg-black text-light-text-primary transition-colors duration-150"
                  placeholder="Subbluedit name..."
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-light-text-primary">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-light-border px-3 py-2 rounded-md bg-black text-light-text-primary transition-colors duration-150 resize-none"
                  placeholder="Describe your community..."
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                className="bg-brand text-white px-4 py-2 rounded-md hover:bg-brand/90 transition-colors duration-150 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Subbluedit"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-black rounded-lg p-4 sticky top-4">
            <h3 className="font-semibold text-white mb-3">Creating a Community</h3>
            <p className="text-sm text-gray-300 mb-4">
              Subbluedits are communities where people can share and discuss topics they&apos;re passionate about.
            </p>
            <div className="text-xs text-gray-400 space-y-2">
              <p>• Choose a unique name</p>
              <p>• Write a clear description</p>
              <p>• Be respectful and inclusive</p>
              <p>• Follow community guidelines</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
