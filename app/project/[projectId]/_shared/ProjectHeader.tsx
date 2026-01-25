import React, { useContext } from 'react'
import Logo from '@/data/Logo'
import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { SettingContext } from '@/context/SettingContext'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

const ProjectHeader = () => {
  const {settingDetails, setSettingDetails} = useContext(SettingContext)
  const [loading, setLoading] = useState(false)

  const onSave = async() => {
    try {
      setLoading(true)
      const res = await axios.put('/api/project', {
        projectName: settingDetails.projectName,
        theme: settingDetails.theme,
        projectId: settingDetails.projectId
      })
      setLoading(false)
      toast.success('Project saved successfully')
    } catch (error) {
      setLoading(false)
      toast.error('Failed to save project')
    }
  }

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <nav className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo on Left */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Action Buttons on Right */}
          <div className="flex items-center gap-4">
            <Button 
              className="bg-rose-500 hover:bg-rose-600 cursor-pointer text-white font-medium px-5 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
              onClick={onSave}
              disabled={loading}
            >
              <span className='flex items-center gap-1'> 
                {loading ? <Loader2 className='animate-spin' /> : <Save className='w-4 h-4' />}
                {loading ? 'Saving...' : 'Save'}
              </span>
            </Button>
            <UserButton />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default ProjectHeader