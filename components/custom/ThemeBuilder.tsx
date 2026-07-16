'use client'

import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Theme } from '@/data/Theme'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (themeJson: string) => void
  baseTheme: Theme
}

const ThemeBuilder = ({ isOpen, onClose, onSave, baseTheme }: Props) => {
  const [themeName, setThemeName] = useState('My Custom Theme')
  const [primary, setPrimary] = useState<string>(baseTheme.primary)
  const [background, setBackground] = useState<string>(baseTheme.background)
  const [card, setCard] = useState<string>(baseTheme.card)
  const [radius, setRadius] = useState<string>(baseTheme.radius)
  const [fontFamily, setFontFamily] = useState<string>(baseTheme.fontFamily || 'Inter, system-ui, sans-serif')
  
  const [activeColor, setActiveColor] = useState<'primary' | 'background' | 'card'>('primary')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!themeName.trim()) {
      toast.error("Please enter a theme name")
      return
    }

    setLoading(true)
    const customTheme = {
      ...baseTheme,
      primary,
      background,
      card,
      radius,
      fontFamily,
    }
    const themeJson = `CUSTOM:${JSON.stringify(customTheme)}`

    try {
      // Save globally for the user
      await axios.post('/api/user/themes', {
        themeName,
        themeData: themeJson
      })
      toast.success("Theme saved to your account!")
      onSave(themeJson)
      onClose()
    } catch (err) {
      toast.error("Failed to save custom theme")
    } finally {
      setLoading(false)
    }
  }

  const currentColor = activeColor === 'primary' ? primary : activeColor === 'background' ? background : card
  const setCurrentColor = (color: string) => {
    if (activeColor === 'primary') setPrimary(color)
    else if (activeColor === 'background') setBackground(color)
    else setCard(color)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Build Custom Theme</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Theme Name</Label>
            <Input 
              value={themeName} 
              onChange={(e) => setThemeName(e.target.value)} 
              placeholder="e.g. Acme Corp Brand"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label>Colors</Label>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant={activeColor === 'primary' ? 'default' : 'outline'} 
                    onClick={() => setActiveColor('primary')}
                    className="justify-start gap-3 w-full"
                  >
                    <div className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10" style={{ background: primary }} />
                    Primary
                  </Button>
                  <Button 
                    variant={activeColor === 'background' ? 'default' : 'outline'} 
                    onClick={() => setActiveColor('background')}
                    className="justify-start gap-3 w-full"
                  >
                    <div className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10" style={{ background: background }} />
                    Background
                  </Button>
                  <Button 
                    variant={activeColor === 'card' ? 'default' : 'outline'} 
                    onClick={() => setActiveColor('card')}
                    className="justify-start gap-3 w-full"
                  >
                    <div className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10" style={{ background: card }} />
                    Card
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Border Radius</Label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent text-sm"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                >
                  <option value="0px">0px (Sharp)</option>
                  <option value="0.25rem">4px (Small)</option>
                  <option value="0.5rem">8px (Medium)</option>
                  <option value="1rem">16px (Large)</option>
                  <option value="9999px">9999px (Pill)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Font Family</Label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent text-sm"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  <option value="Inter, system-ui, sans-serif">Inter (Modern Sans)</option>
                  <option value="Roboto, sans-serif">Roboto (Neutral Sans)</option>
                  <option value="Outfit, sans-serif">Outfit (Geometric Sans)</option>
                  <option value="Montserrat, sans-serif">Montserrat (Bold Sans)</option>
                  <option value="Lora, serif">Lora (Warm Serif)</option>
                  <option value="Playfair Display, serif">Playfair Display (Elegant Serif)</option>
                </select>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center">
              <HexColorPicker color={currentColor} onChange={setCurrentColor} />
              <Input 
                className="mt-4 uppercase text-center font-mono" 
                value={currentColor} 
                onChange={(e) => setCurrentColor(e.target.value)} 
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save as My Brand Theme
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ThemeBuilder
