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
  Loader2,
  Laptop,
  Smartphone,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { THEME_NAME_LIST, THEMES } from '@/data/Theme'
import { categories } from '@/data/constants'
import axios from 'axios'
import Loading from '@/components/custom/Loading'
import { ProjectType } from '@/types/types'

const Hero = () => {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [selectedCategory, setSelectedCategory] = useState('Website')
  const [selectedTheme, setSelectedTheme] = useState<string>(THEME_NAME_LIST[0])
  const [userInput, setUserInput] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [userProjects, setUserProjects] = useState<ProjectType[]>([])
  const [fetchingProjects, setFetchingProjects] = useState(false)

  React.useEffect(() => {
    if (user) {
      fetchUserProjects()
    }
  }, [user])

  const fetchUserProjects = async () => {
    setFetchingProjects(true)
    try {
      const res = await axios.get('/api/project')
      setUserProjects(res.data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setFetchingProjects(false)
    }
  }

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
      theme: selectedTheme
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
            
            {/* Bottom Section with Selectors and Submit */}
            <InputGroupAddon align="block-end" className="border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between w-full gap-2 md:gap-4 mt-2">
                <div className='flex items-center gap-2'>
                  {/* Device Selector */}
                  <div className="flex-shrink-0">
                    <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val)} defaultValue='Website'>
                      <SelectTrigger className="h-10 w-32 md:w-40 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200">
                        <SelectValue placeholder="Device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WEBSITE">Website</SelectItem>
                        <SelectItem value="MOBILE">Mobile App</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Theme Selector */}
                  <div className="flex-shrink-0">
                    <Select value={selectedTheme} onValueChange={(val) => setSelectedTheme(val)} defaultValue={THEME_NAME_LIST[0]}>
                      <SelectTrigger className="h-10 w-32 md:w-40 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {THEME_NAME_LIST.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="button"
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSubmit()
                  }}
                  className="bg-rose-500 hover:bg-rose-600 cursor-pointer text-white font-semibold px-4 md:px-8 py-2 h-10 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center"
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
        <div className="animate-slide-up-fade mb-20" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              Your Projects
            </h2>
            {userProjects.length > 0 && (
              <span className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
                {userProjects.length} Projects
              </span>
            )}
          </div>
          
          {fetchingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-200/50 dark:border-slate-700/50" />
              ))}
            </div>
          ) : userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project, index) => {
                const themeColors = THEMES[project.theme as keyof typeof THEMES]
                return (
                  <div 
                    key={project.projectId}
                    onClick={() => router.push(`/project/${project.projectId}`)}
                    className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-5 cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  >
                    {/* Background Accent */}
                    <div 
                      className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:scale-150"
                      style={{ background: themeColors?.primary }}
                    />

                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {project.device === 'MOBILE' ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: themeColors?.primary }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {project.theme?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300 truncate">
                        {project.projectName || 'Untitled Project'}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed h-10">
                        {project.userInput}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50 relative z-10">
                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">
                          {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {[themeColors?.primary, themeColors?.secondary, themeColors?.accent].map((color, i) => (
                           <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" style={{ background: color }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 group">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">No projects found</h3>
              <p className="text-slate-400 dark:text-slate-500">Transform your creative spark into a stunning mockup right now!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero