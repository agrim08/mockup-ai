'use client'

import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import React, { useState } from 'react'
import ScreenFrame from "./ScreenFrame";
import { ProjectType, ScreenConfigType } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, RefreshCcw, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
    projectDetail: ProjectType | undefined;
    screenConfig: ScreenConfigType[];
    loading?: boolean;
}

const Canvas = ({projectDetail, screenConfig, loading}: Props) => {
  const [panningEnabled, setPanningEnabled] = useState(true);
  const isMobile = projectDetail?.device === 'MOBILE';
  const SCREEN_WIDTH = isMobile ? 400 : 1200;
  const SCREEN_HEIGHT = isMobile ? 844 : 900;
  const gap = isMobile ? 10 : 70;

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-sm">
            <Button variant="ghost" size="icon" onClick={() => zoomIn()} className="h-8 w-8 rounded-lg hover:bg-slate-100">
                <Plus className="w-4 h-4 text-slate-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => zoomOut()} className="h-8 w-8 rounded-lg hover:bg-slate-100">
                <Minus className="w-4 h-4 text-slate-600" />
            </Button>
            <div className="w-[1px] h-4 bg-slate-200 mx-1" />
            <Button variant="ghost" size="icon" onClick={() => resetTransform()} className="h-8 w-8 rounded-lg hover:bg-slate-100">
                <RefreshCcw className="w-3.5 h-3.5 text-slate-600" />
            </Button>
        </div>
    );
  };

  const ScreenNavigator = () => {
    const { setTransform } = useControls();

    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 p-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl max-w-[95vw]">
        <Controls />
        
        <div className="w-[1px] h-8 bg-slate-200 hidden md:block" />

        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
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
                className="whitespace-nowrap flex items-center gap-2 hover:bg-slate-50 transition-all rounded-xl border border-transparent hover:border-slate-200 px-3 py-1.5 h-10 group"
            >
                <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                </div>
                <div className="flex flex-col items-start text-left">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">
                        {screen?.screenName ? 'Screen' : 'Waiting'}
                    </span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[120px] leading-tight text-nowrap">
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
                            />
                        ) : (
                            <div
                                className="bg-white rounded-[2.5rem] p-8 absolute shadow-xl border border-slate-100 overflow-hidden"
                                style={{
                                    width: SCREEN_WIDTH,
                                    height: SCREEN_HEIGHT,
                                    left: index * (SCREEN_WIDTH + gap),
                                    top: 0,
                                }}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <Skeleton className="h-6 w-32 rounded-full" />
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                </div>
                                <Skeleton className="h-[200px] w-full rounded-3xl mb-8" />
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full rounded-full" />
                                    <Skeleton className="h-4 w-4/5 rounded-full" />
                                    <Skeleton className="h-4 w-2/3 rounded-full" />
                                </div>
                                <div className="mt-12 grid grid-cols-2 gap-6">
                                    <Skeleton className="h-32 rounded-3xl" />
                                    <Skeleton className="h-32 rounded-3xl" />
                                </div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <Skeleton className="h-14 w-full rounded-2xl" />
                                </div>
                            </div>
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