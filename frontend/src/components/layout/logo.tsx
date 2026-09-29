import * as React from "react"
import { cn } from "../../lib/utils"

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Size preset of the logo
     * - sm: 28px icon
     * - md: 36px icon (default)
     * - lg: 44px icon
     * - xl: 56px icon
     */
    size?: "sm" | "md" | "lg" | "xl"
    /**
     * Whether to show only the icon without text
     */
    iconOnly?: boolean
    /**
     * Main brand title (default: "HRIS")
     */
    title?: string
    /**
     * Subtitle or tagline (default: "HR Management System")
     */
    subtitle?: string
    /**
     * Logo icon style variant:
     * - "gradient": High-end gradient squircle with connected H emblem (Recommended)
     * - "minimal": Transparent background, adaptive theme colors
     * - "hexagon": Modern tech hexagon badge
     */
    variant?: "gradient" | "minimal" | "hexagon"
    /**
     * If true, text will automatically collapse/hide in shadcn icon-collapsed sidebar
     */
    inSidebar?: boolean
}

export const LogoIcon = ({
    size = "md",
    variant = "gradient",
    className,
}: {
    size?: "sm" | "md" | "lg" | "xl"
    variant?: "gradient" | "minimal" | "hexagon"
    className?: string
}) => {
    const sizeMap = {
        sm: "size-7",
        md: "size-9",
        lg: "size-11",
        xl: "size-14",
    }

    const uniqueId = React.useId().replace(/:/g, "")

    if (variant === "minimal") {
        return (
            <svg
                viewBox='0 0 100 100'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className={cn(sizeMap[size], "shrink-0", className)}
                aria-label='HRIS Logo'
            >
                <circle cx='32' cy='22' r='7' className='fill-primary' />
                <rect
                    x='25'
                    y='34'
                    width='14'
                    height='42'
                    rx='7'
                    className='fill-primary'
                />
                <circle cx='68' cy='22' r='7' className='fill-primary' />
                <rect
                    x='61'
                    y='34'
                    width='14'
                    height='42'
                    rx='7'
                    className='fill-primary'
                />
                <path
                    d='M 32 58 C 46 58 50 46 68 46 C 72 46 72 53 68 53 C 54 53 50 65 32 65 C 28 65 28 58 32 58 Z'
                    className='fill-primary/70'
                />
            </svg>
        )
    }

    if (variant === "hexagon") {
        return (
            <svg
                viewBox='0 0 100 100'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className={cn(
                    sizeMap[size],
                    "shrink-0 drop-shadow-md",
                    className,
                )}
                aria-label='HRIS Logo'
            >
                <defs>
                    <linearGradient
                        id={`hexGrad-${uniqueId}`}
                        x1='0%'
                        y1='0%'
                        x2='100%'
                        y2='100%'
                    >
                        <stop offset='0%' stopColor='#3B82F6' />
                        <stop offset='50%' stopColor='#6366F1' />
                        <stop offset='100%' stopColor='#8B5CF6' />
                    </linearGradient>
                </defs>
                <polygon
                    points='50,4 92,26 92,74 50,96 8,74 8,26'
                    fill={`url(#hexGrad-${uniqueId})`}
                    stroke='rgba(255,255,255,0.25)'
                    strokeWidth='2'
                    strokeLinejoin='round'
                />
                <circle cx='35' cy='30' r='5.5' fill='#FFFFFF' />
                <rect
                    x='30'
                    y='39'
                    width='10'
                    height='30'
                    rx='5'
                    fill='#FFFFFF'
                />
                <circle cx='65' cy='30' r='5.5' fill='#FFFFFF' />
                <rect
                    x='60'
                    y='39'
                    width='10'
                    height='30'
                    rx='5'
                    fill='#FFFFFF'
                />
                <path
                    d='M 35 55 C 45 55 48 45 65 45 C 68 45 68 51 65 51 C 48 51 45 61 35 61 C 32 61 32 55 35 55 Z'
                    fill='#A5F3FC'
                />
            </svg>
        )
    }

    return (
        <svg
            viewBox='0 0 100 100'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(
                sizeMap[size],
                "shrink-0 transition-transform duration-300 hover:scale-105",
                className,
            )}
            aria-label='HRIS Logo'
        >
            <defs>
                <linearGradient
                    id={`bgGrad-${uniqueId}`}
                    x1='0%'
                    y1='0%'
                    x2='100%'
                    y2='100%'
                >
                    <stop offset='0%' stopColor='#4F46E5' />
                    <stop offset='55%' stopColor='#7C3AED' />
                    <stop offset='100%' stopColor='#06B6D4' />
                </linearGradient>
                <linearGradient
                    id={`bridgeGrad-${uniqueId}`}
                    x1='0%'
                    y1='100%'
                    x2='100%'
                    y2='0%'
                >
                    <stop offset='0%' stopColor='#A78BFA' />
                    <stop offset='100%' stopColor='#67E8F9' />
                </linearGradient>
                <filter
                    id={`shadow-${uniqueId}`}
                    x='-20%'
                    y='-20%'
                    width='140%'
                    height='140%'
                >
                    <feDropShadow
                        dx='0'
                        dy='3'
                        stdDeviation='3.5'
                        floodColor='#4F46E5'
                        floodOpacity='0.3'
                    />
                </filter>
            </defs>

            <rect
                width='100'
                height='100'
                rx='24'
                fill={`url(#bgGrad-${uniqueId})`}
                filter={`url(#shadow-${uniqueId})`}
            />

            <rect
                x='1.5'
                y='1.5'
                width='97'
                height='97'
                rx='22.5'
                stroke='#FFFFFF'
                strokeOpacity='0.3'
                strokeWidth='1.5'
                fill='none'
            />

            <g>
                <circle cx='33' cy='24' r='6' fill='#FFFFFF' />
                <rect
                    x='27.5'
                    y='34'
                    width='11'
                    height='38'
                    rx='5.5'
                    fill='#FFFFFF'
                />

                <circle cx='67' cy='24' r='6' fill='#FFFFFF' />
                <rect
                    x='61.5'
                    y='34'
                    width='11'
                    height='38'
                    rx='5.5'
                    fill='#FFFFFF'
                />

                <path
                    d='M 33 55 C 46 55 49 44 67 44 C 70 44 70 50 67 50 C 49 50 46 61 33 61 C 30 61 30 55 33 55 Z'
                    fill={`url(#bridgeGrad-${uniqueId})`}
                />
            </g>
        </svg>
    )
}

export function Logo({
    size = "md",
    iconOnly = false,
    title = "HRIS",
    subtitle = "HR Management System",
    variant = "gradient",
    inSidebar = false,
    className,
    ...props
}: LogoProps) {
    const textSizes = {
        sm: { title: "text-sm", subtitle: "text-[10px]" },
        md: { title: "text-base font-bold", subtitle: "text-xs" },
        lg: { title: "text-lg font-bold", subtitle: "text-xs" },
        xl: { title: "text-2xl font-extrabold", subtitle: "text-sm" },
    }

    return (
        <div
            className={cn(
                "flex items-center gap-3 select-none",
                inSidebar &&
                    "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0",
                className,
            )}
            {...props}
        >
            <LogoIcon size={size} variant={variant} />

            {!iconOnly && (
                <div
                    className={cn(
                        "flex flex-col min-w-0 text-left transition-opacity duration-200",
                        inSidebar && "group-data-[collapsible=icon]:hidden",
                    )}
                >
                    <div className='flex items-center gap-1.5 leading-none'>
                        <span
                            className={cn(
                                "tracking-tight font-heading bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent",
                                textSizes[size].title,
                            )}
                        >
                            {title}
                        </span>
                    </div>
                    {subtitle && (
                        <span
                            className={cn(
                                "text-muted-foreground tracking-normal truncate font-normal mt-0.5",
                                textSizes[size].subtitle,
                            )}
                        >
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

export default Logo
