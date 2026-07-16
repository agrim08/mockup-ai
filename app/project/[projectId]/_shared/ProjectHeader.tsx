import React, { useContext, useState } from 'react'
import Logo from '@/data/Logo'
import { Button } from '@/components/ui/button'
import { Loader2, Save, Play, Download } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { SettingContext } from '@/context/SettingContext'
import axios from 'axios'
import { toast } from 'sonner'
import { ProjectType, ScreenConfigType } from '@/types/types'
import PrototypePlayer from '@/_shared/PrototypePlayer'
import { THEMES } from '@/data/Theme'

type Props = {
  screenConfig?: ScreenConfigType[]
  projectDetail?: ProjectType
}

const ProjectHeader = ({ screenConfig = [], projectDetail }: Props) => {
  const { settingDetails } = useContext(SettingContext)
  const [loading, setLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const hasGeneratedScreens = screenConfig.some(s => !!s.code)
  const themeKey = projectDetail?.theme as keyof typeof THEMES
  const hasValidTheme = !!themeKey && !!THEMES[themeKey]

  const onSave = async () => {
    const details = settingDetails
    if (!details) {
      toast.error('No project details found to save')
      return
    }
    try {
      setLoading(true)
      await axios.put('/api/project', {
        projectName: details.projectName,
        theme: details.theme,
        projectId: details.projectId,
      })
      toast.success('Project saved successfully')
    } catch {
      toast.error('Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  const onExport = async () => {
    if (!projectDetail?.projectId) return
    try {
      setIsExporting(true)
      const res = await axios.get(`/api/project/design-export?projectId=${projectDetail.projectId}`)
      const data = res.data

      // Download JSON
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const jsonUrl = URL.createObjectURL(jsonBlob)
      const jsonLink = document.createElement('a')
      jsonLink.href = jsonUrl
      jsonLink.download = `${projectDetail.projectName ?? 'design'}-tokens.json`
      jsonLink.click()
      URL.revokeObjectURL(jsonUrl)

      toast.success('Design tokens exported!')
    } catch {
      toast.error('Failed to export design system')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <nav className="w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo on Left */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Action Buttons on Right */}
            <div className="flex items-center gap-3">
              {/* Export Design Tokens */}
              {hasGeneratedScreens && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm h-9 px-3 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={onExport}
                  disabled={isExporting}
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export
                </Button>
              )}

              {/* Play Prototype */}
              {hasGeneratedScreens && hasValidTheme && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm h-9 px-4 border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Play
                </Button>
              )}

              {/* Save */}
              <Button
                className="bg-rose-500 hover:bg-rose-600 cursor-pointer text-white font-medium px-5 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                onClick={onSave}
                disabled={loading}
              >
                <span className="flex items-center gap-1">
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {loading ? 'Saving...' : 'Save'}
                </span>
              </Button>
              <UserButton />
            </div>
          </div>
        </nav>
      </header>

      {/* Prototype Player Overlay */}
      {isPlaying && projectDetail && (
        <PrototypePlayer
          screenConfig={screenConfig}
          projectDetail={projectDetail}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </>
  )
}

export default ProjectHeader