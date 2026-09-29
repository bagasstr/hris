"use client"

import Link from "next/link"
import { Logo } from "@/components/layout/logo"

interface NavbarProps {
    className?: string
}

export function Navbar({ className }: NavbarProps) {
    return (
        <header
            className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className ?? ""}`}
        >
            <div className='container flex h-14 items-center justify-between px-4'>
                <Link
                    href='/dashboard'
                    className='flex items-center gap-2 hover:opacity-90 transition-opacity'
                >
                    <Logo size='sm' />
                </Link>
                <div className='flex items-center gap-3'>
                    {/* User / Action Buttons */}
                </div>
            </div>
        </header>
    )
}

export default Navbar
