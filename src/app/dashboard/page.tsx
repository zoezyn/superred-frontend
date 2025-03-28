export default function Dashboard() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Recent Discussions</h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-800 rounded-md">
              <h3 className="font-medium">Setting up Kubernetes locally</h3>
              <p className="text-sm text-gray-400 mt-1">Started by @devmaster</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-md">
              <h3 className="font-medium">AWS Lambda vs Azure Functions</h3>
              <p className="text-sm text-gray-400 mt-1">Started by @cloudninja</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Popular Topics</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>DevOps</span>
              <span className="text-green-400">↑ 12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>LocalLLM</span>
              <span className="text-green-400">↑ 8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Web Development</span>
              <span className="text-red-400">↓ 3%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Your Activity</h2>
          <div className="flex flex-col items-center justify-center h-40">
            <div className="text-4xl font-bold text-green-400">85%</div>
            <p className="text-gray-400 mt-2">Engagement rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}