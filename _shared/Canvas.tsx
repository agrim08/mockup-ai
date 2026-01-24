import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import React, { useState } from 'react'
import ScreenFrame from "./ScreenFrame";

const Canvas = () => {
    const [panningEnabled, setPanningEnabled] = useState(true); 
  return (
    <div className="w-full h-screen bg-gray-100"
        style={{
            backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
        }}
    >
        <TransformWrapper
            initialScale={1}
            initialPositionX={200}
            initialPositionY={100}
            limitToBounds={false}
            wheel={{step:0.8}}
            doubleClick={{disabled:false}}
            panning={{disabled: !panningEnabled}}
        >
            <TransformComponent
                wrapperStyle={{width:'100%', height:'100%'}}
            >
                <ScreenFrame x = {0} y = {0} setPanningEnabled={setPanningEnabled}/>
                <ScreenFrame x = {200} y = {200} setPanningEnabled={setPanningEnabled}/>
            </TransformComponent>
        </TransformWrapper>
    </div>
  )
}

export default Canvas