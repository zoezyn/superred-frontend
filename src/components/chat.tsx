"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, X, Maximize2, Minimize2 } from 'lucide-react'
import GoogleGenAI from "google-genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // const llm = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const llm = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? '');
  const model = llm.getGenerativeModel({ model: "gemini-1.5-flash" });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await model.generateContent({
        // model: 'gemini-2.0-flash',
        contents: [
          ...messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        // prompt: userMessage,
        // temperature: 0.5,
        // maxTokens: 1000,
        // topP: 0.95,
        // topK: 40,
        
      })
  //     setMessages(prev => [...prev, { role: 'assistant', content: response.text() }])
  //   } catch (error) {
  //     console.error('Error:', error)
  //     setMessages(prev => [...prev, { 
  //       role: 'assistant', 
  //       content: 'Sorry, I encountered an error. Please try again.' 
  //     }])
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // return (
      // Replace with your actual API endpoint
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     message: userMessage,
      //     history: messages
      //   }),
      // })

      // if (!response.ok) throw new Error('Failed to fetch response')

      const data = await response//.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response.text() }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`transition-all duration-300 ${
      isExpanded 
        ? 'h-screen w-[350px] bg-zinc-900 border-l border-zinc-800' 
        : 'fixed top-4 right-4 z-50'
    }`}>
      {isExpanded ? (
        <>
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold">Chat Assistant</h2>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white"
            >
              <Minimize2 size={20} />
            </button>
          </div>

          <div className="flex flex-col h-[calc(100vh-144px)] p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-brand text-black ml-auto'
                    : 'bg-zinc-800 text-white'
                }`}
              >
                {message.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form 
            onSubmit={handleSubmit}
            className=" p-4 bg-zinc-900 border-t border-zinc-800"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="p-2 bg-brand text-black rounded-md hover:bg-opacity-90 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 text-gray-400 hover:text-white"
        >
          <QuestionAnswerIcon/>
        </button>
      )}
    </div>
  )
} 