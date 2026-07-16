'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, Monitor, Smartphone, RotateCcw, Play } from 'lucide-react'
import { htmlWrapper } from '@/data/constants'
import { ProjectType, ScreenConfigType } from '@/types/types'
import { THEMES, Theme, parseTheme } from '@/data/Theme'
import { cn } from '@/lib/utils'

type Props = {
  screenConfig: ScreenConfigType[]
  projectDetail: ProjectType
  onClose: () => void
}

const PrototypePlayer = ({ screenConfig, projectDetail, onClose }: Props) => {
  const validScreens = screenConfig.filter(s => !!s.code)
  const firstScreenId = validScreens[0]?.screenId ?? ''

  const [activeScreenId, setActiveScreenId] = useState<string>(firstScreenId)
  const [navHistory, setNavHistory] = useState<string[]>([firstScreenId])
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const isMobile = projectDetail.device === 'MOBILE'
  const theme: Theme = parseTheme(projectDetail.theme)

  const activeScreen = validScreens.find(s => s.screenId === activeScreenId) ?? validScreens[0]

  useEffect(() => {
    const handleMessage = (event: MessageEvent<{ type: string; targetScreenId: string }>) => {
      if (event.data?.type === 'NAVIGATE_TO_SCREEN') {
        const targetId = event.data.targetScreenId
        const target = validScreens.find(s => s.screenId === targetId)
        if (target) {
          setActiveScreenId(targetId)
          setNavHistory(prev => [...prev, targetId])
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [validScreens])

  // Keyboard controls (Escape to close, Arrow keys to navigate)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      const currentIndex = validScreens.findIndex(s => s.screenId === activeScreenId)
      if (currentIndex === -1) return

      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % validScreens.length
        navigateTo(validScreens[nextIndex].screenId)
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + validScreens.length) % validScreens.length
        navigateTo(validScreens[prevIndex].screenId)
      }
    }

    // Bind parent window keydown
    window.addEventListener('keydown', handleKey)

    // Bind iframe keydown (since focus inside iframe eats keyboard events)
    const iframe = iframeRef.current
    let iframeDoc: Document | null = null
    const attachIframeListener = () => {
      try {
        iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document || null
        iframeDoc?.addEventListener('keydown', handleKey)
      } catch (err) {
        // cross-origin sandbox restrictions if any
      }
    }

    if (iframe) {
      iframe.addEventListener('load', attachIframeListener)
      // Attach immediately if already loaded
      attachIframeListener()
    }

    return () => {
      window.removeEventListener('keydown', handleKey)
      if (iframe) {
        iframe.removeEventListener('load', attachIframeListener)
      }
      try {
        iframeDoc?.removeEventListener('keydown', handleKey)
      } catch (err) {}
    }
  }, [activeScreenId, validScreens, onClose])

  const goBack = () => {
    if (navHistory.length <= 1) return
    const newHistory = navHistory.slice(0, -1)
    setNavHistory(newHistory)
    setActiveScreenId(newHistory[newHistory.length - 1])
  }

  const restart = () => {
    setActiveScreenId(firstScreenId)
    setNavHistory([firstScreenId])
  }

  const navigateTo = (screenId: string) => {
    setActiveScreenId(screenId)
    setNavHistory(prev => [...prev, screenId])
  }

  if (validScreens.length === 0) return null

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-between overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="w-full h-14 flex items-center justify-between px-6 border-b border-white/10 flex-shrink-0">
        {/* Left: Nav controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            disabled={navHistory.length <= 1}
            className="flex items-center gap-1 text-sm text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-white/15 select-none">|</span>
          <button
            onClick={restart}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart
          </button>
        </div>

        {/* Center: Screen name + device */}
        <div className="flex items-center gap-2">
          {isMobile
            ? <Smartphone className="w-4 h-4 text-white/30" />
            : <Monitor className="w-4 h-4 text-white/30" />
          }
          <span className="text-white/80 text-sm font-medium tracking-tight">
            {activeScreen?.screenName}
          </span>
          {navHistory.length > 1 && (
            <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
              {navHistory.length} steps
            </span>
          )}
        </div>

        {/* Right: Close */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── Device Frame ── */}
      <div className="flex-1 flex items-center justify-center py-6 px-4 overflow-hidden">
        <div
          className={cn(
            'relative shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden',
            isMobile ? 'rounded-[2.5rem] w-[390px] h-[844px]' : 'rounded-xl'
          )}
          style={!isMobile ? {
            width: 'min(1200px, calc(100vw - 2rem))',
            height: 'min(780px, calc(100vh - 200px))',
          } : undefined}
        >
          <iframe
            key={activeScreenId}
            ref={iframeRef}
            srcDoc={htmlWrapper(theme, activeScreen?.code ?? '')}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* ── Bottom: Screen Dots ── */}
      <div className="h-12 flex items-center justify-center gap-2 flex-shrink-0">
        {validScreens.map(s => (
          <button
            key={s.screenId}
            onClick={() => navigateTo(s.screenId)}
            title={s.screenName}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              s.screenId === activeScreenId
                ? 'w-6 bg-white'
                : 'w-1.5 bg-white/25 hover:bg-white/50'
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default PrototypePlayer
