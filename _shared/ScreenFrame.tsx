import { GripVertical } from 'lucide-react';
import React from 'react'
import { Rnd } from 'react-rnd'

interface Props {
    x: number;
    y: number;
    setPanningEnabled: (enabled: boolean) => void;
}

const ScreenFrame = ({x, y, setPanningEnabled}: Props) => {
  return (
    <Rnd
        default={{
            x,
            y,
            width:320,
            height:200
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
        <div className='bg-white'>
            <h2>Example</h2>
        </div>
    </Rnd>
  )
}

export default ScreenFrame