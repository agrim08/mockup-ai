import React from 'react'
import Logo from '@/data/Logo'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

const ProjectHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo on Left */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Action Buttons on Right */}
          <div className="flex items-center gap-4">
            <Button 
              className="bg-rose-500 hover:bg-rose-600 cursor-pointer text-white font-medium px-5 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Save</span>
            </Button>
            <UserButton />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default ProjectHeader