import { SettingContext } from '@/context/SettingContext';
import { THEMES, themeToCssVars } from '@/data/Theme';
import { ProjectType } from '@/types/types';
import { GripVertical } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
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

    const {settingDetails} = useContext(SettingContext)
    const themeObj = THEMES[settingDetails?.theme as keyof typeof THEMES ?? projectDetail?.theme as keyof typeof THEMES];
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [size, setSize] = useState({ width, height });

    useEffect(() => {
        setSize({ width, height });
    }, [width, height]);

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

    const measureIframeHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
        try {
            const doc = iframe.contentDocument;
            if (!doc) return;

            const headerH = 40;
            const htmlEl = doc.documentElement;
            const body = doc.body;

            const contentH = Math.max(
                htmlEl?.scrollHeight ?? 0,
                body?.scrollHeight ?? 0,
                htmlEl?.offsetHeight ?? 0,
                body?.offsetHeight ?? 0
            );

            const next = Math.min(Math.max(contentH + headerH, 160), 2000);

            setSize((s) =>
                Math.abs(s.height - next) > 2
                    ? { ...s, height: next }
                    : s
            );
        } catch {
                // if sandbox/origin blocks access, we can't measure
        }
    }, []);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const onLoad = () => {
            measureIframeHeight();

            // ✅ observe DOM changes inside iframe
            const doc = iframe.contentDocument;
            if (!doc) return;

            const observer = new MutationObserver(() => measureIframeHeight());
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true,
            });

            // ✅ re-check a few times for fonts/images/tailwind async layout
            const t1 = window.setTimeout(measureIframeHeight, 50);
            const t2 = window.setTimeout(measureIframeHeight, 200);
            const t3 = window.setTimeout(measureIframeHeight, 600);

            return () => {
                observer.disconnect();
                window.clearTimeout(t1);
                window.clearTimeout(t2);
                window.clearTimeout(t3);
            };
        };

        iframe.addEventListener("load", onLoad);
        window.addEventListener("resize", measureIframeHeight);

        return () => {
            iframe.removeEventListener("load", onLoad);
            window.removeEventListener("resize", measureIframeHeight);
        };
    }, [measureIframeHeight, htmlCode]);

  return (
    <Rnd
        default={{
            x,
            y,
            width,
            height
        }}
        size={size}
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
        onResizeStop={(_, __, ref, ___, position) => {setPanningEnabled(true);
            setSize({
                width: ref?.offsetWidth,
                height: ref?.offsetHeight
            });
        }}
    >

        <div className='drag-handle cursor-move p-2 bg-gray-100 flex items-center gap-2'>
            <GripVertical className='h-4 w-4 text-gray-500'/>Drag
        </div>
        <iframe 
            ref={iframeRef}
            className='w-full bg-white h-[calc(100%-40px)] rounded-2xl mt-5'
            sandbox='allow-same-origin allow-scripts'
            srcDoc={htmlCode}
        />
    </Rnd>
  )
}

export default ScreenFrame