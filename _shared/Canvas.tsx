import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import React, { useState } from 'react'
import ScreenFrame from "./ScreenFrame";
import { ProjectType, ScreenConfigType } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="w-full h-screen bg-gray-100"
        style={{
            backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
        }}
    >
        <TransformWrapper
            initialScale={0.7}
            minScale={0.5}
            maxScale={3}
            initialPositionX={50}
            initialPositionY={50}
            limitToBounds={false}
            wheel={{step:0.8}}
            doubleClick={{disabled:false}}
            panning={{disabled: !panningEnabled}}
        >
            <TransformComponent
                wrapperStyle={{width:'100%', height:'100%'}}
            >
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
                                className="bg-white rounded-3xl p-5 absolute shadow-sm overflow-hidden"
                                style={{
                                    width: SCREEN_WIDTH,
                                    height: SCREEN_HEIGHT,
                                    left: index * (SCREEN_WIDTH + gap),
                                    top: 0,
                                }}
                            >
                            {/* Status / Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <Skeleton className="h-4 w-16 rounded-full animate-pulse" />
                                    <Skeleton className="h-4 w-10 rounded-full animate-pulse" />
                                </div>

                            {/* Hero / Main block */}
                                <Skeleton className="h-32 w-full rounded-xl animate-pulse" />

                                {/* Content lines */}
                                <div className="mt-6 space-y-3">
                                    <Skeleton className="h-4 w-4/5 rounded-full animate-pulse" />
                                    <Skeleton className="h-4 w-3/5 rounded-full animate-pulse" />
                                    <Skeleton className="h-4 w-2/5 rounded-full animate-pulse" />
                                </div>

                            {/* Cards */}
                                <div className="mt-8 grid grid-cols-2 gap-3">
                                    <Skeleton className="h-20 rounded-xl animate-pulse" />
                                    <Skeleton className="h-20 rounded-xl animate-pulse" />
                                </div>

                            {/* Bottom CTA */}
                                <div className="absolute bottom-5 left-5 right-5">
                                    <Skeleton className="h-10 w-full rounded-xl animate-pulse" />
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </TransformComponent>
        </TransformWrapper>
    </div>
  )
}

export default Canvas