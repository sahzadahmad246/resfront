const HomeLoader = () => {
    return (
      <div className="w-full min-h-screen bg-white">
        {/* Header Skeleton with pink background */}
        <div className="bg-rose-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-rose-200 animate-pulse rounded" />
              <div className="h-5 w-32 bg-rose-200 animate-pulse rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 bg-rose-200 animate-pulse rounded" />
              <div className="h-5 w-5 bg-rose-200 animate-pulse rounded" />
            </div>
          </div>
          
          {/* Search Bar Skeleton */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 bg-rose-200 animate-pulse rounded-full" />
            </div>
            <div className="h-12 w-full bg-rose-100 animate-pulse rounded-lg" />
          </div>
        </div>
  
        {/* Menu Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-4 w-24 bg-gray-100 animate-pulse rounded text-center" />
              <div className="h-4 w-32 bg-gray-100 animate-pulse rounded text-center" />
            </div>
          ))}
        </div>
  
        {/* Suggested Section Title */}
        <div className="p-4">
          <div className="h-6 w-40 bg-gray-100 animate-pulse rounded mb-6" />
        </div>
  
        {/* Suggested Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="w-full aspect-[4/3] bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
  
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-white">
          <div className="flex justify-around items-center p-4">
            <div className="w-6 h-6 bg-rose-500 animate-pulse rounded" />
            <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
            <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
            <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
  
        {/* Delivery Notice (if needed) */}
        <div className="fixed top-20 left-4 right-4 md:left-1/4 md:right-1/4">
          <div className="bg-white rounded-lg p-4 shadow-lg flex justify-between items-center">
            <div className="h-4 w-48 bg-gray-100 animate-pulse rounded" />
            <div className="h-8 w-24 bg-emerald-100 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  };
  
  export default HomeLoader;