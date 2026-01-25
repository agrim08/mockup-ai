'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SettingContext } from '@/context/SettingContext'
import { THEME_NAME_LIST, THEMES } from '@/data/Theme'
import { ProjectType } from '@/types/types'
import { Camera, Share, Sparkle, ChevronLeft, ChevronRight, Layout, Palette, PlusCircle, Loader2 } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import html2canvas from 'html2canvas'
import axios from 'axios'
import { toast } from 'sonner'

type Props={
  projectDetail: ProjectType | undefined
}

const ProjectSettings = ({projectDetail}: Props) => {
  const [selectedTheme, setSelectedTheme] = useState('AURORA_INK')
  const [projectName, setProjectName] = useState(projectDetail?.projectName)
  const [userInput, setUserInput] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const {settingDetails, setSettingDetails} = useContext(SettingContext)

  useEffect(() => {
    if(projectDetail){
      setProjectName(projectDetail?.projectName)
      setSelectedTheme(projectDetail?.theme as string)
    }
  }, [projectDetail])

  const onThemeSelect = (theme: string) => {
    setSelectedTheme(theme)
    setSettingDetails((prev: any) => ({
      ...prev,
      theme: theme
    }))
  }

  const handleScreenshot = async () => {
    try {
      setIsCapturing(true)
      const iframes = document.querySelectorAll('iframe')
      if (iframes.length === 0) {
        toast.error("No screens found to capture")
        setIsCapturing(false)
        return
      }

      toast.loading("Capturing project preview...", { id: 'screenshot' })

      const capturedImages: HTMLCanvasElement[] = []
      
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i]
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) continue
        
        const body = doc.body
        const canvas = await html2canvas(body, {
          useCORS: true,
          scale: 0.5, // Scale down for performance and storage
          backgroundColor: '#ffffff'
        })
        capturedImages.push(canvas)
      }

      if (capturedImages.length === 0) {
        toast.dismiss('screenshot')
        setIsCapturing(false)
        return
      }

      // Stitch images together
      const gap = 40
      const totalWidth = capturedImages.reduce((acc, canvas) => acc + canvas.width, 0) + (capturedImages.length - 1) * gap
      const maxHeight = Math.max(...capturedImages.map(canvas => canvas.height))

      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = totalWidth + 100 // Padding
      finalCanvas.height = maxHeight + 100
      const ctx = finalCanvas.getContext('2d')
      if (!ctx) throw new Error("Could not get context")

      // Fill background
      ctx.fillStyle = '#f8fafc' // Slate 50
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)

      let currentX = 50
      capturedImages.forEach((canvas) => {
        // Draw shadow
        ctx.shadowColor = 'rgba(0,0,0,0.1)'
        ctx.shadowBlur = 20
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 10
        
        ctx.drawImage(canvas, currentX, 50)
        currentX += canvas.width + gap
      })

      const base64Image = finalCanvas.toDataURL('image/png')

      // Download
      const link = document.createElement('a')
      link.href = base64Image
      link.download = `${projectName || 'project'}-mockup.png`
      link.click()

      // Save to DB
      await axios.put('/api/project', {
        projectId: projectDetail?.projectId,
        logo: base64Image
      })

      toast.success("Project screenshot saved and downloaded!", { id: 'screenshot' })
    } catch (error) {
      console.error("Screenshot error:", error)
      toast.error("Failed to capture screenshot", { id: 'screenshot' })
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className={cn(
      'transition-all duration-300 ease-in-out border-r h-[92vh] bg-white relative flex flex-col pt-4',
      isCollapsed ? 'w-20' : 'w-[280px]'
    )}>
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className='absolute -right-3 top-8 bg-white border rounded-full p-1 shadow-md hover:scale-110 transition-all z-10 cursor-pointer'
      >
        {isCollapsed ? <ChevronRight className='w-4 h-4'/> : <ChevronLeft className='w-4 h-4'/>}
      </button>

      <div className={cn(
        'flex flex-col h-full overflow-hidden'
      )}>
        {/* Project Name Section */}
        <div className={cn('px-6 transition-all duration-300', isCollapsed ? 'opacity-100 flex justify-center mt-2' : 'mt-3')}>
            {!isCollapsed ? (
              <>
                <h2 className='text-sm mb-1 font-medium flex items-center gap-2'>
                  <Layout className='w-4 h-4'/> Project Name
                </h2>
                <Input 
                  placeholder='Project Name' 
                  value={projectName || ""} 
                  onChange={(e) =>{ 
                    setProjectName(e.target.value)
                    setSettingDetails((prev: any) => ({
                      ...prev,
                      projectName: e.target.value
                    }))
                  }} 
                />
              </>
            ) : (
              <div className='p-2 bg-slate-50 rounded-lg group relative cursor-pointer'>
                <Layout className='w-6 h-6 text-slate-600'/>
                <div className='absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl'>
                  {projectName || 'Project Name'}
                </div>
              </div>
            )}
        </div>

        {/* Generate Screen Section */}
        <div className={cn('px-6 transition-all duration-300', isCollapsed ? 'flex justify-center mt-8' : 'mt-8')}>
            {!isCollapsed ? (
              <>
                <h2 className='text-sm mb-1 font-medium flex items-center gap-2'>
                  <PlusCircle className='w-4 h-4'/> Generate Screen
                </h2>
                <Textarea 
                  placeholder='Enter Prompt to generate screen using AI' 
                  className='text-sm min-h-[100px]'
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)} 
                />
                <Button size={'sm'} className='mt-3 w-full bg-primary hover:bg-primary/90 text-white shadow-sm transition-all'>
                  <Sparkle className='w-4 h-4 mr-2' />
                  Generate Screen
                </Button>
              </>
            ) : (
              <div 
                className='p-2 bg-primary/10 rounded-lg group relative cursor-pointer hover:bg-primary/20 transition-colors'
                onClick={() => setIsCollapsed(false)}
              >
                <Sparkle className='w-6 h-6 text-primary'/>
                <div className='absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl'>
                  Generate Screen
                </div>
              </div>
            )}
        </div>

        {/* Themes Section */}
        <div className={cn('px-6 flex flex-col flex-1 transition-all duration-300', isCollapsed ? 'items-center mt-8' : 'mt-8 overflow-hidden')}>
            {!isCollapsed ? (
              <>
                <h2 className='text-sm font-medium text-slate-700 mb-3 flex items-center gap-2'>
                  <Palette className='w-4 h-4'/> Themes
                </h2>
                <div className='flex-1 overflow-y-auto pr-2 space-y-2 max-h-[300px] scrollbar-thin scrollbar-thumb-slate-200'>
                    {THEME_NAME_LIST.map((theme, index) => (
                      <div 
                        className={cn(
                          'border rounded-xl p-3 cursor-pointer transition-all duration-200',
                          theme === selectedTheme 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        )} 
                        onClick={() => onThemeSelect(theme)} 
                        key={index}
                      >
                        <h3 className={cn('mb-2 text-[10px] font-bold uppercase tracking-wider', theme === selectedTheme ? 'text-primary' : 'text-slate-500')}>
                          {theme.replace('_', ' ')}
                        </h3>
                          <div className='flex gap-1.5'>
                            <div className='w-3 h-3 rounded-full' style={{background: THEMES[theme]?.primary}}/>
                            <div className='w-3 h-3 rounded-full' style={{background: THEMES[theme]?.secondary}}/>
                            <div className='w-3 h-3 rounded-full' style={{background: THEMES[theme]?.accent}}/>
                            <div className='w-3 h-3 rounded-full border border-slate-100' style={{background: THEMES[theme]?.background}}/>
                          </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className='p-2 bg-slate-50 rounded-lg group relative cursor-pointer hover:bg-slate-100 transition-colors'>
                <Palette className='w-6 h-6 text-slate-600'/>
                <div className='absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl'>
                  Change Theme
                </div>
              </div>
            )}
        </div>

        {/* Extras / Footnote Section */}
        <div className={cn('px-6 pb-6 mt-auto transition-all duration-300', isCollapsed ? 'flex flex-col items-center gap-4' : 'border-t pt-6')}>
            {!isCollapsed ? (
              <>
                <h2 className='text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3'>Extras</h2>
                <div className='flex gap-2'>
                  <Button 
                    className='flex-1 cursor-pointer' 
                    variant={'outline'} 
                    size={'sm'}
                    disabled={isCapturing}
                    onClick={handleScreenshot}
                  >
                    {isCapturing ? <Loader2 className='w-3.5 h-3.5 animate-spin mr-2'/> : <Camera className='w-3.5 h-3.5 mr-2'/>}
                    Shot
                  </Button>
                  <Button className='flex-1 cursor-pointer' variant={'outline'} size={'sm'}><Share className='w-3.5 h-3.5 mr-2'/> Share</Button>
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center gap-4'>
                 <div 
                  className='p-2 hover:bg-slate-50 rounded-lg group relative cursor-pointer'
                  onClick={handleScreenshot}
                 >
                  {isCapturing ? <Loader2 className='w-5 h-5 animate-spin text-slate-500'/> : <Camera className='w-5 h-5 text-slate-500'/>}
                  <div className='absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl'>
                    Take Screenshot
                  </div>
                </div>
                <div className='p-2 hover:bg-slate-50 rounded-lg group relative cursor-pointer'>
                  <Share className='w-5 h-5 text-slate-500'/>
                  <div className='absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl'>
                    Share Project
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default ProjectSettings