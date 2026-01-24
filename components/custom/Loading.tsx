import React from 'react'

interface LoadingProps {
  loading: boolean;
  message?: string;
}

const Loading = ({ loading, message }: LoadingProps) => {
  if (!loading) return null;

  return (
    <div className='fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm'>
        <div className='flex flex-col items-center gap-6'>
            {/* Elegant, Minimalist Spinner */}
            <div className='relative w-12 h-12'>
                {/* Track */}
                <div className='absolute inset-0 rounded-full border-[3px] border-slate-200 dark:border-slate-800' />
                {/* Active Segment */}
                <div className='absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin' />
            </div>
            
            {message && (
                <div className='flex flex-col items-center gap-2'>
                     <p className='text-base font-medium text-slate-900 dark:text-slate-100 animate-pulse'>
                        {message}
                    </p>
                    {/* Minimal Progress Bar (Optional, can just use the dots) */}
                    <div className='flex gap-1.5'>
                        <span className='w-1 h-1 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]' />
                        <span className='w-1 h-1 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]' />
                        <span className='w-1 h-1 rounded-full bg-primary/60 animate-bounce' />
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default Loading
