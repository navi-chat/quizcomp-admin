import React, { ReactNode } from 'react'

const Header = ({ title, buttons }: { title: string, buttons?: ReactNode }) => {
  return (
    <header className='w-full h-16 bg-card border-b border-border'>
      <div className='flex items-center justify-between px-5 h-full'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <div className='flex gap-2'>
            {buttons}
        </div>
      </div>
    </header>
  )
}

export default Header
