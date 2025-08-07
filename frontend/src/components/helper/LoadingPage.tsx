
export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        {/* Clean spinner */}
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

        {/* Simple text */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-black">
            Loading
          </h2>
          <p className="text-sm text-gray-600">
            Please wait a moment.
          </p>
        </div>

      </div>
    </div>
  );
}