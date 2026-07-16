'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SettingContext } from '@/context/SettingContext'
import { THEME_NAME_LIST, THEMES } from '@/data/Theme'
import { ProjectType, ScreenConfigType } from '@/types/types'
import { Camera, Share, Sparkle, ChevronLeft, ChevronRight, Layout, Palette, PlusCircle, Loader2 } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import html2canvas from 'html2canvas'
import axios from 'axios'
import { toast } from 'sonner'
import { RefreshDataContext } from '@/context/RefreshDataContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ThemeBuilder from '@/components/custom/ThemeBuilder'
import { parseTheme } from '@/data/Theme'

type Props={
  projectDetail: ProjectType | undefined
  screenConfig: ScreenConfigType[]
}

const ProjectSettings = ({projectDetail, screenConfig}: Props) => {
  const [selectedTheme, setSelectedTheme] = useState('AURORA_INK')
  const [projectName, setProjectName] = useState(projectDetail?.projectName)
  const [userInput, setUserInput] = useState('')
  const [targetScreen, setTargetScreen] = useState('new-screen')
  const [loading, setLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const {settingDetails, setSettingDetails} = useContext(SettingContext)
  const {refreshData, setRefreshData} = useContext(RefreshDataContext)

  const [isThemeBuilderOpen, setIsThemeBuilderOpen] = useState(false)
  const [customThemes, setCustomThemes] = useState<{themeName: string, themeData: string}[]>([])

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await axios.get('/api/user/themes')
        setCustomThemes(res.data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchThemes()
  }, [])

  useEffect(() => {
    if(projectDetail){
      setProjectName(projectDetail?.projectName)
      setSelectedTheme(projectDetail?.theme as string)
    }
  }, [projectDetail])

  const onThemeSelect = (theme: string) => {
    setSelectedTheme(theme)
    setSettingDetails((prev: ProjectType | null) => {
      if (!prev) return null;
      return {
        ...prev,
        theme: theme
      };
    })
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

  const handleGenerateOrEdit = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      setLoading(true);

      if (targetScreen === 'new-screen') {
        toast.loading("Generating screen configuration...", { id: 'sidebar-action' });
        await axios.post('/api/generate-new-screen', {
          projectId: projectDetail?.projectId,
          userInput: userInput,
        });
        toast.success("New screen configuration created! Generating UI...", { id: 'sidebar-action' });
      } else {
        toast.loading("Regenerating screen UI...", { id: 'sidebar-action' });
        const selectedScreen = screenConfig.find(s => s.screenId === targetScreen);
        if (!selectedScreen) {
          toast.error("Selected screen not found", { id: 'sidebar-action' });
          setLoading(false);
          return;
        }

        await axios.post('/api/edit-screen', {
          projectId: projectDetail?.projectId,
          screenId: selectedScreen.screenId,
          oldCode: selectedScreen.code,
          userInput: userInput,
        });
        toast.success("Screen updated successfully!", { id: 'sidebar-action' });
      }

      setUserInput('');
      setRefreshData({ method: 'screenConfig', date: Date.now() });
    } catch (error) {
      console.error("Sidebar action error:", error);
      toast.error("Action failed. Please try again.", { id: 'sidebar-action' });
    } finally {
      setLoading(false);
    }
  };

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
        'flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
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
                    setSettingDetails((prev: ProjectType | null) => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        projectName: e.target.value
                      };
                    })
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
                <h2 className='text-sm mb-1.5 font-medium flex items-center gap-2'>
                  <PlusCircle className='w-4 h-4'/> Target Screen
                </h2>
                <Select value={targetScreen} onValueChange={(val) => setTargetScreen(val)}>
                  <SelectTrigger className="w-full text-sm mb-3">
                    <SelectValue placeholder="Select target screen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new-screen">Generate New Screen</SelectItem>
                    {screenConfig && screenConfig.map((screen) => (
                      <SelectItem key={screen.screenId} value={screen.screenId}>
                        Edit: {screen.screenName || 'Untitled Screen'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <h2 className='text-sm mb-1.5 font-medium flex items-center gap-2'>
                  <Sparkle className='w-4 h-4'/> AI Prompt Instructions
                </h2>
                <Textarea 
                  placeholder={
                    targetScreen === 'new-screen' 
                      ? 'Describe the new screen you want to add...' 
                      : 'Describe the changes you want to apply to this screen...'
                  }
                  className='text-sm min-h-[100px]'
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)} 
                />
                <Button 
                  size={'sm'} 
                  onClick={handleGenerateOrEdit} 
                  disabled={loading}
                  className='mt-3 w-full bg-primary hover:bg-primary/90 text-white shadow-sm transition-all'
                >
                  {loading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <Sparkle className='w-4 h-4 mr-2' />
                  )}
                  {targetScreen === 'new-screen' ? 'Generate Screen' : 'Edit Screen'}
                </Button>
              </>
            ) : (
              <div 
                className='p-2 bg-primary/10 rounded-lg group relative cursor-pointer hover:bg-primary/20 transition-colors'
                onClick={() => setIsCollapsed(false)}
              >
                <Sparkle className='w-6 h-6 text-primary'/>
                <div className='absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl'>
                  {targetScreen === 'new-screen' ? 'Generate Screen' : 'Edit Screen'}
                </div>
              </div>
            )}
        </div>

        {/* Themes Section */}
        <div className={cn('px-6 flex flex-col transition-all duration-300', isCollapsed ? 'items-center mt-8' : 'mt-8')}>
            {!isCollapsed ? (
              <>
                <h2 className='text-sm font-medium text-slate-700 mb-3 flex items-center gap-2'>
                  <Palette className='w-4 h-4'/> Themes
                </h2>
                <div className='overflow-y-auto pr-2 space-y-2 max-h-[220px] scrollbar-thin scrollbar-thumb-slate-200'>
                    {THEME_NAME_LIST.map((theme, index) => (
                      <div 
                        className={cn(
                          'border rounded-xl p-3 cursor-pointer transition-all duration-200',
                          theme === selectedTheme 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        )} 
                        onClick={() => onThemeSelect(theme)} 
                        key={`default-${index}`}
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

                    {customThemes.map((ct, index) => {
                      const parsed = parseTheme(ct.themeData)
                      return (
                        <div 
                          className={cn(
                            'border rounded-xl p-3 cursor-pointer transition-all duration-200',
                            ct.themeData === selectedTheme 
                              ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                              : 'border-slate-100 hover:border-slate-200 bg-white'
                          )} 
                          onClick={() => onThemeSelect(ct.themeData)} 
                          key={`custom-${index}`}
                        >
                          <h3 className={cn('mb-2 text-[10px] font-bold uppercase tracking-wider', ct.themeData === selectedTheme ? 'text-primary' : 'text-slate-500')}>
                            {ct.themeName}
                          </h3>
                            <div className='flex gap-1.5'>
                              <div className='w-3 h-3 rounded-full' style={{background: parsed.primary}}/>
                              <div className='w-3 h-3 rounded-full' style={{background: parsed.secondary}}/>
                              <div className='w-3 h-3 rounded-full' style={{background: parsed.accent}}/>
                              <div className='w-3 h-3 rounded-full border border-slate-100' style={{background: parsed.background}}/>
                            </div>
                        </div>
                      )
                    })}

                    <Button 
                      variant="outline" 
                      className="w-full text-xs border-dashed text-slate-500"
                      onClick={() => setIsThemeBuilderOpen(true)}
                    >
                      <PlusCircle className="w-3 h-3 mr-1" /> Custom Theme
                    </Button>
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

      <ThemeBuilder 
        isOpen={isThemeBuilderOpen} 
        onClose={() => setIsThemeBuilderOpen(false)} 
        baseTheme={parseTheme(selectedTheme)}
        onSave={(newThemeJson) => {
          onThemeSelect(newThemeJson)
          // Refetch custom themes to include the new one in the list
          axios.get('/api/user/themes').then(res => setCustomThemes(res.data))
        }}
      />
    </div>
  )
}

export default ProjectSettings