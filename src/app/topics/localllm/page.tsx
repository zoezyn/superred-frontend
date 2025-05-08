import Link from "next/link";

export default function LocalLLMTopic() {
  return (
    <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 p-6">
        <div className="flex items-center mb-8">
          <Link href="/" className="text-gray-400 mr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="bg-red-300 text-black font-bold py-1 px-3 rounded">
            LocalLLM
          </div>
        </div>

        <div className="space-y-4">
          {/* Discussion thread cards */}
          <div className="bg-green-800 bg-opacity-30 border border-green-700 rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">Best models for running on consumer hardware</h2>
                <div className="mt-4 text-gray-300">
                  <p>I am looking for recommendations on which LLM models work best on consumer hardware. I have an RTX 3080 with 10GB VRAM and would like to run something comparable to GPT-3.5 locally. Any suggestions?</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-green-800 bg-opacity-30 border border-green-700 rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">Optimizing inference speed with llama.cpp</h2>
                <div className="mt-4 text-gray-300">
                  <p>I have been experimenting with different quantization methods in llama.cpp and wanted to share my findings on optimizing for speed vs. quality. Here is what I have learned so far...</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat sidebar */}
      <div className="w-80 border-l border-gray-800 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="flex-1 mb-4 overflow-auto">
          {/* Chat messages would go here */}
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Chat with reddit posts..." 
            className="w-full bg-gray-900 border border-gray-700 rounded-full py-2 pl-4 pr-10 text-white"
          />
          <button className="absolute right-3 top-2 text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 