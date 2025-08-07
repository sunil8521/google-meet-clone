
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Simple 404 number */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-black tracking-tight">404</h1>
          <h2 className="text-xl font-medium text-black">Page not found</h2>
        </div>
        
        {/* Clean description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        {/* Clean buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button 
            onClick={() => window.history.back()}
            className="flex-1 bg-black text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            Go back
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-white text-black text-sm font-medium py-2 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}