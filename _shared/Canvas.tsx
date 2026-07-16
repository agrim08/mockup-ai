'use client'

import { TransformWrapper, TransformComponent, useControls, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import React, { useState, useRef, useEffect } from 'react'
import ScreenFrame from "./ScreenFrame";
import ScreenSkeleton from "./ScreenSkeleton";
import { ProjectType, ScreenConfigType } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, RefreshCcw, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
    projectDetail: ProjectType | undefined;
    screenConfig: ScreenConfigType[];
    loading?: boolean;
    generatingScreenId?: string | null;
}

const Canvas = ({projectDetail, screenConfig, loading, generatingScreenId}: Props) => {
  const [panningEnabled, setPanningEnabled] = useState(true);
  const isMobile = projectDetail?.device === 'MOBILE';
  const SCREEN_WIDTH = isMobile ? 400 : 1200;
  const SCREEN_HEIGHT = isMobile ? 844 : 900;
  const gap = isMobile ? 10 : 70;
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE_TO_SCREEN') {
        const targetScreenId = event.data.targetScreenId;
        const index = screenConfig.findIndex(s => s.screenId === targetScreenId);
        if (index !== -1) {
          const scale = 0.6;
          const xPos = -(index * (SCREEN_WIDTH + gap)) * scale + 150;
          transformRef.current?.setTransform(xPos, 50, scale, 300);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [screenConfig, SCREEN_WIDTH, gap]);

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div className="flex items-center gap-0.5 bg-white/20 backdrop-blur-lg px-1 py-0.5 rounded-lg border border-white/10 shadow-sm">
            <Button variant="ghost" size="icon" onClick={() => zoomIn()} className="h-6 w-6 rounded-md hover:bg-white/20 transition-colors">
                <Plus className="w-3 h-3 text-slate-700" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => zoomOut()} className="h-6 w-6 rounded-md hover:bg-white/20 transition-colors">
                <Minus className="w-3 h-3 text-slate-700" />
            </Button>
            <div className="w-[1px] h-3 bg-slate-400/30 mx-0.5" />
            <Button variant="ghost" size="icon" onClick={() => resetTransform()} className="h-6 w-6 rounded-md hover:bg-white/20 transition-colors">
                <RefreshCcw className="w-2.5 h-2.5 text-slate-700" />
            </Button>
        </div>
    );
  };

  const ScreenNavigator = () => {
    const { setTransform } = useControls();

    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1 bg-white/40 backdrop-blur-2xl rounded-xl border border-white/30 shadow-2xl max-w-[90vw]">
        <div className="px-1">
          <Controls />
        </div>
        
        <div className="w-[1px] h-5 bg-slate-400/20 hidden md:block" />

        <div className="flex gap-0.5 overflow-x-auto scrollbar-hide py-0.5 px-1 max-w-full">
            {screenConfig.map((screen, index) => (
            <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => {
                const scale = 0.6;
                const xPos = -(index * (SCREEN_WIDTH + gap)) * scale + 150;
                setTransform(xPos, 50, scale);
                }}
                className="whitespace-nowrap flex items-center gap-1.5 hover:bg-white/30 transition-all rounded-lg border border-transparent hover:border-white/20 px-2 py-0.5 h-7 group"
            >
                <div className="w-4 h-4 bg-primary/20 rounded-md flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <span className="text-[8px] font-bold text-primary">{index + 1}</span>
                </div>
                <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] font-bold text-slate-800 truncate max-w-[90px] leading-none text-nowrap">
                        {screen?.screenName || `Screen ${index + 1}`}
                    </span>
                </div>
            </Button>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gray-100 overflow-hidden relative"
        style={{
            backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
        }}
    >
        <TransformWrapper
            ref={transformRef}
            initialScale={0.5}
            minScale={0.05}
            maxScale={3}
            centerOnInit={true}
            limitToBounds={false}
            wheel={{step:0.8}}
            doubleClick={{disabled:false}}
            panning={{disabled: !panningEnabled}}
        >
            {() => (
        <>
            <ScreenNavigator />
            <TransformComponent
                wrapperStyle={{width:'100%', height:'100%'}}
            >
                <div className="flex" style={{ width: screenConfig.length * (SCREEN_WIDTH + gap) }}>
                {screenConfig.map((screen, index) => (
                    <React.Fragment key={index}>
                        {screen?.code ? (
                            <ScreenFrame
                                x={index * (SCREEN_WIDTH + gap)}
                                y={0}
                                height={SCREEN_HEIGHT}
                                width={SCREEN_WIDTH}
                                setPanningEnabled={setPanningEnabled}
                                html={screen?.code}
                                projectDetail={projectDetail}
                                screen={screen}
                            />
                        ) : (
                            <ScreenSkeleton
                                x={index * (SCREEN_WIDTH + gap)}
                                y={0}
                                width={SCREEN_WIDTH}
                                height={SCREEN_HEIGHT}
                                screenName={screen.screenName}
                                purpose={screen.purpose}
                                isGenerating={generatingScreenId === screen.screenId}
                            />
                        )}
                    </React.Fragment>
                ))}
                </div>
            </TransformComponent>
            </>
        )}
        </TransformWrapper>
    </div>
  )
}

export default Canvas