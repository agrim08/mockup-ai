'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  Plane, 
  GraduationCap, 
  Wallet, 
  ShoppingCart, 
  ClipboardList, 
  UtensilsCrossed,
  Baby,
  Sparkles,
  Send,
  ArrowRightIcon,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { categories } from '@/data/constants'
import axios from 'axios'
import Loading from '@/components/custom/Loading'

const Hero = () => {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Website')
  const [userInput, setUserInput] = useState<string>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!isLoaded) {
      return
    }
    
    if (!user) {
      router.push('/sign-in')
      return
    }
    
    if (!userInput || userInput.trim() === '') {        
      return
    }

    const projectId = crypto.randomUUID()
    setLoading(true)
    const res = await axios.post('/api/project', {
      projectId,
      userInput,
      device: selectedCategory,
    })  
    
    router.push('/project/' + projectId)
    setLoading(false)
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; hover: string; icon: string }> = {
      indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-950/50', icon: 'text-indigo-600 dark:text-indigo-400' },
      amber: { bg: 'bg-amber-50 dark:bg-amber-950/30', hover: 'hover:bg-amber-100 dark:hover:bg-amber-950/50', icon: 'text-amber-600 dark:text-amber-400' },
      slate: { bg: 'bg-slate-50 dark:bg-slate-800/30', hover: 'hover:bg-slate-100 dark:hover:bg-slate-800/50', icon: 'text-slate-600 dark:text-slate-400' },
      blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', hover: 'hover:bg-blue-100 dark:hover:bg-blue-950/50', icon: 'text-blue-600 dark:text-blue-400' },
      rose: { bg: 'bg-rose-50 dark:bg-rose-950/30', hover: 'hover:bg-rose-100 dark:hover:bg-rose-950/50', icon: 'text-rose-600 dark:text-rose-400' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', hover: 'hover:bg-orange-100 dark:hover:bg-orange-950/50', icon: 'text-orange-600 dark:text-orange-400' },
      yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-950/50', icon: 'text-yellow-600 dark:text-yellow-400' },
    }
    return colors[color] || colors.indigo
  }

  return (
    <section className="relative pb-20 px-4 sm:px-6 lg:px-8 p-10 mt-20 md:px-24 lg:px-48 xl:px-60">
      <Loading loading={loading} message={'Creating your project...'} />
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none"></div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto">
         <div className="z-10 flex min-h-28 items-center justify-center">
            <div
                className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                )}
            >
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span>✨ Introducing Mockup-AI</span>
                    <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedShinyText>
            </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl font-bold text-center mb-6 animate-slide-up-fade">
          <span className="text-slate-900 dark:text-white">Design High Quality </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400">
            Website and Mobile App Designs
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-center text-lg text-slate-600 dark:text-slate-400 mb-4 max-w-2xl mx-auto animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
          Imagine your idea and turn it into reality
        </p>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-16 animate-slide-up-fade" style={{ animationDelay: '300ms' }}>
          <InputGroup className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-md border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all duration-300 h-auto p-4">
            {/* Main Textarea */}
            <InputGroupTextarea 
              placeholder="Enter what design you want to create"
              rows={2}
              className="text-base resize-none"
              value={userInput}
              onChange={(e) => setUserInput(e?.target?.value)}
            />
            
            {/* Bottom Section with Theme Selector and Submit */}
            <InputGroupAddon align="block-end" className="border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between w-full gap-4">
                {/* Theme Selector */}
                <div className="flex-shrink-0">
                  <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val)} defaultValue='website'>
                    <SelectTrigger className="h-10 w-40 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Mobile App">Mobile App</SelectItem>
                      <SelectItem value="Dashboard">Dashboard</SelectItem>
                      <SelectItem value="Landing Page">Landing Page</SelectItem>
                      <SelectItem value="E-Commerce">E-Commerce</SelectItem>
                      <SelectItem value="Portfolio">Portfolio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  <Button
                    type="button"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSubmit()
                    }}
                    className="bg-rose-500 hover:bg-rose-600 cursor-pointer text-white font-semibold px-8 py-2 h-10 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    {loading ? <Loader2 className='animate-spin'/> : <Send className="w-4 h-4" />}
                  </Button>
              </div>
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Category Cards */}
        <div className="max-w-4xl mx-auto mb-12 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {categories.map((category, index) => {
            const Icon = category.icon
            const colorClasses = getColorClasses(category.color)
            
            return (
              <div
                key={category.name}
                className={`group cursor-pointer animate-slide-up-fade`}
                style={{ animationDelay: `${400 + index * 50}ms` }}
                onClick={() => setUserInput(category.description)}
              >
                <div className={`${colorClasses.bg} ${colorClasses.hover} rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700`}>
                  <div className="flex justify-center mb-3">
                    <div className={`w-12 h-12 ${colorClasses.bg} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <Icon className={`w-6 h-6 ${colorClasses.icon} transition-transform duration-300 group-hover:scale-110`} />
                    </div>
                  </div>
                  <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
            )
          })}
          </div>
        </div>

        {/* Your Projects Section */}
        <div className="animate-slide-up-fade" style={{ animationDelay: '800ms' }}>
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Your Projects</h2>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 text-center hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300">
            <p className="text-slate-400 dark:text-slate-500">No projects yet. Start creating your first mockup!</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero