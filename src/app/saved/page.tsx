"use client"

import { supabase } from "@/lib/supabase";

const { data: { session }, error: authError } = await supabase.auth.getSession();
console.log("saved-page-session1: ", { data: session, error: authError });

export default function Saved() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Saved Items</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Running LLMs on consumer hardware</h2>
              <p className="text-gray-400 mt-2">
                A comprehensive guide to optimizing large language models for running on consumer-grade GPUs and CPUs.
              </p>
              <div className="mt-4 flex items-center">
                <span className="bg-red-300 text-black text-xs font-medium px-2 py-1 rounded">LocalLLM</span>
                <span className="text-gray-500 text-sm ml-4">Saved 2 days ago</span>
              </div>
            </div>
            <button className="text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">CI/CD Pipeline Best Practices</h2>
              <p className="text-gray-400 mt-2">
                Learn how to set up efficient CI/CD pipelines that improve your development workflow and reduce deployment errors.
              </p>
              <div className="mt-4 flex items-center">
                <span className="bg-yellow-300 text-black text-xs font-medium px-2 py-1 rounded">DevOps</span>
                <span className="text-gray-500 text-sm ml-4">Saved 1 week ago</span>
              </div>
            </div>
            <button className="text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 