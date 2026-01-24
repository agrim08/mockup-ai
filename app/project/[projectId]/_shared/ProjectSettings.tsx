'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { THEME_NAME_LIST, THEMES } from '@/data/Theme'
import { ProjectType } from '@/types/types'
import { Camera, Share, Sparkle } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props={
  projectDetail: ProjectType | undefined
}

const ProjectSettings = ({projectDetail}: Props) => {
  const [selectedTheme, setSelectedTheme] = useState('AURORA_INK')
  const [projectName, setProjectName] = useState(projectDetail?.projectName)
  const [userInput, setUserInput] = useState('')

  useEffect(() => {
    if(projectDetail){
      setProjectName(projectDetail?.projectName)
    }
  }, [projectDetail])

  return (
    <div className='w-[280px] p-6 border-r h-[90vh]'>
      <div className='mt-3'>
          <h2 className='text-sm mb-1'>Project Name</h2>
          <Input placeholder='Project Name'  value={projectName || ""} onChange={(e) => setProjectName(e.target.value)} />
      </div>

      <div className='mt-5'>
          <h2 className='text-sm mb-1'>Generate New Screen</h2>
          <Textarea placeholder='Enter Prompt to generate screen using AI' value={userInput}            onChange={(e) => setUserInput(e.target.value)} 
          />
          <Button size={'sm'} className='mt-3 w-full bg-primary hover:bg-primary/90 text-white shadow-sm transition-all'>
            <Sparkle className='w-4 h-4 mr-2' />
            Generate Screen
          </Button>
      </div>

      <div className='mt-8'>
          <h2 className='text-sm font-medium text-slate-700 dark:text-slate-300 mb-3'>Themes</h2>
          <div className='h-[200px] overflow-auto pr-2 space-y-2'>
              {THEME_NAME_LIST.map((theme, index) => (
                <div 
                  className={`border rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                    theme === selectedTheme 
                      ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`} 
                  onClick={() => setSelectedTheme(theme)} 
                  key={index}
                >
                  <h3 className={`mb-2 text-xs font-semibold ${theme === selectedTheme ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                    {theme}
                  </h3>
                    <div className='flex gap-2'>
                      <div className={`w-4 h-4 rounded-full`} style={{background: THEMES[theme]?.primary}}/>
                      <div className={`w-4 h-4 rounded-full`} style={{background: THEMES[theme]?.secondary}}/>
                      <div className={`w-4 h-4 rounded-full`} style={{background: THEMES[theme]?.accent}}/>
                      <div className={`w-4 h-4 rounded-full`} style={{background: THEMES[theme]?.background}}/>
                      <div className={`w-4 h-4 rounded-full`} style={{background: `linear-gradient(
                          135deg,
                          ${THEMES[theme]?.primary},
                          ${THEMES[theme]?.secondary},
                          ${THEMES[theme]?.accent},
                          ${THEMES[theme]?.background}
                        )`}}/>
                    </div>
                </div>
              ))}
          </div>
      </div>

      <div className='mt-8'>
          <h2 className='text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>Extras</h2>
          <div className='flex gap-2'>
            <Button className='cursor-pointer justify-start' variant={'outline'} size={'sm'}><Camera className='w-4 h-4 mr-2'/> Screenshot</Button>
            <Button className='cursor-pointer justify-start' variant={'outline'} size={'sm'}><Share className='w-4 h-4 mr-2'/> Share </Button>
          </div>
      </div>
    </div>
  )
}

export default ProjectSettings