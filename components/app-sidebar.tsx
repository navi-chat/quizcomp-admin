"use client"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const sidebarItems = [
  {
    label: "HOME",
    href: "/",
    icon: <Image src="/icons/home.png" alt="logo" width={100} height={100} className="w-10 h-10" />
  },
  {
    label: "THUMBNAILS",
    href: "/thumbnails",
    icon: <Image src="/icons/thumbnail.png" alt="logo" width={100} height={100} className="w-10 h-10 p-1" />
  },
]

const AppSidebar = () => {
    const pathname = usePathname();
  return (
    <div className="fixed top-0 left-0 h-screen w-3xs bg-sidebar border-r-2 border-r-border p-4">
      <div className="flex items-center py-2 px-2 gap-2 mb-4">
        <Image src="/icon.png" alt="logo" width={32} height={32} className="w-10 h-10" />
        <h1 className="text-2xl font-black text-primary">QuizComp</h1>
      </div>
      <div className="flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <Link href={item.href} key={item.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${pathname === item.href ? "bg-secondary/5 border-2 border-secondary/50 text-secondary font-semibold" : "hover:bg-accent-foreground/10"}`}>
            {item.icon}
            <span className="text-base">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AppSidebar
