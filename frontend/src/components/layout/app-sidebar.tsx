"use client"

import * as React from "react"
import Link from "next/link"
import { NavMain } from "@/components/layout/nav-main"
import { Logo } from "@/components/layout/logo"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarHeader className='p-3 border-b border-sidebar-border/50'>
                <Link
                    href='/dashboard'
                    className='flex items-center group-data-[collapsible=icon]:justify-center transition-all'
                >
                    <Logo inSidebar size='md' />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
            </SidebarContent>
        </Sidebar>
    )
}
