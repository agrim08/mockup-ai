import React from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative">
        {/* Logo Container - Subtle gradient */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-indigo-500/20">
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-12" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-indigo-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 scale-90 group-hover:scale-110"></div>
      </div>
      
      {/* Brand Name */}
      <div className="flex items-center gap-2">
        <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          Mockup-AI
        </span>
        <Sparkles className="w-4 h-4 text-indigo-500 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out" />
      </div>
    </Link>
  )
}

export default Logo
