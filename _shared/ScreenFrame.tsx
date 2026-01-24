import { THEMES, themeToCssVars } from '@/data/Theme';
import { ProjectType } from '@/types/types';
import { GripVertical } from 'lucide-react';
import React from 'react'
import { Rnd } from 'react-rnd'

interface Props {
    x: number;
    y: number;
    setPanningEnabled: (enabled: boolean) => void;
    width: number;
    height: number;
    html: string | undefined;
    projectDetail: ProjectType | undefined;
}

const ScreenFrame = ({x, y, setPanningEnabled, width, height, html, projectDetail}: Props) => {

    const selectedTheme = projectDetail?.theme as any;
    const themeObj = THEMES[selectedTheme as keyof typeof THEMES] || THEMES.AURORA_INK;

  const htmlCode = `
        <!doctype html>
        <html>
        <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <!-- Google Font -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

        <!-- Tailwind + Iconify -->
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
        <style>
            ${themeToCssVars(themeObj)}
        </style>
        </head>
        <body class="bg-[var(--background)] text-[var(--foreground)] w-full">
        ${html ?? ""}
        </body>
        </html>
    `;

  return (
    <Rnd
        default={{
            x,
            y,
            width,
            height
        }}
        dragHandleClassName='drag-handle'
        enableResizing={{
            bottomLeft: true,
            bottomRight: true,
            topLeft: true,
            topRight: true,
        }}

        onDragStart={() => setPanningEnabled(false)}
        onDragStop={() => setPanningEnabled(true)}
        onResizeStart={() => setPanningEnabled(false)}
        onResizeStop={() => setPanningEnabled(true)}
    >

        <div className='drag-handle cursor-move p-2 bg-gray-100 flex items-center gap-2'>
            <GripVertical className='h-4 w-4 text-gray-500'/>Drag
        </div>
        <iframe 
            className='w-full bg-white h-[calc(100%-40px)] rounded-2xl mt-5'
            sandbox='allow-same-origin allow-scripts'
            srcDoc={htmlCode}
        />
    </Rnd>
  )
}

export default ScreenFrame