"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { SIDEBAR_GROUPS, type SidebarGroupItem } from "@/constants/navigation"

interface NavMainProps {
    groups?: SidebarGroupItem[]
}

export function NavMain({ groups = SIDEBAR_GROUPS }: NavMainProps) {
    const pathname = usePathname()

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup key={group.label}>
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        tooltip={item.title}
                                        render={<Link href={item.href} />}
                                    >
                                        <Icon className='size-4' />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                    {item.badge && (
                                        <SidebarMenuBadge>
                                            {item.badge}
                                        </SidebarMenuBadge>
                                    )}
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    )
}
