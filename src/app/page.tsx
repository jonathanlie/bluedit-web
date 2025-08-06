import AuthButton from "./components/AuthButton";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-light-text-primary mb-4">Welcome to Bluedit</h1>
            <p className="text-light-text-secondary mb-6">
              A Reddit-like community platform where you can share, discuss, and discover content in communities you love.
            </p>
            <AuthButton />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-black rounded-lg p-4 sticky top-4">
            <h3 className="font-semibold text-white mb-3">About Bluedit</h3>
            <p className="text-sm text-gray-300 mb-4">
              Join communities, share posts, and engage in discussions with people who share your interests.
            </p>
            <div className="text-xs text-gray-400">
              <p>Create your own community</p>
              <p>Share and discover content</p>
              <p>Join the discussion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
