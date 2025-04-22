'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const sidebarGroupVariants = cva("flex flex-col space-y-1", {
  variants: {
    collapsible: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    collapsible: false,
  },
})

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarGroupVariants>
>(({ className, collapsible, ...props }, ref) => (
  <div ref={ref} className={cn(sidebarGroupVariants({ collapsible }), className)} {...props} />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-2 py-1.5  font-semibold leading-none', className)} {...props} />
  ),
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-1 py-2", className)} {...props} />,
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const sidebarMenuVariants = cva("grid gap-1.5", {
  variants: {
    variant: {
      default: "",
      secondary: "",
    },
    size: {
      default: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarMenuVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div ref={ref} className={cn(sidebarMenuVariants({ variant, size }), className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

const sidebarMenuItemVariants = cva("relative flex items-center rounded-md", {
  variants: {
    size: {
      default: "",
      lg: "h-11",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarMenuItemVariants>
>(({ className, size, ...props }, ref) => (
  <div ref={ref} className={cn(sidebarMenuItemVariants({ size }), className)} {...props} />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  'flex  items-center gap-2 rounded-md px-2 py-1.5  font-medium transition-colors outline-none data-[active=true]:bg-base-200',
  {
    variants: {
      size: {
        default: "",
        lg: "h-11 px-3 text-base",
      },
      isActive: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof sidebarMenuButtonVariants>
>(({ className, size, isActive, ...props }, ref) => (
  <button ref={ref} className={cn(sidebarMenuButtonVariants({ size, isActive }), className)} {...props} />
))
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { showOnHover?: boolean }
>(
  ({ className, showOnHover, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-md border border-base-300 bg-base-100 text-base-content opacity-0 transition-opacity group-hover/sidebar-menu-item:opacity-100",
        showOnHover && "group-hover/sidebar-menu-item:opacity-100",
        className,
      )}
      {...props}
    />
  ),
)
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('h-px  bg-base-300', className)} {...props} />
)
SidebarSeparator.displayName = "SidebarSeparator"

interface SidebarContextValue {
  collapsed: {
    mobile: boolean
    desktop: boolean
  }
  setCollapsed: React.Dispatch<
    React.SetStateAction<{
      mobile: boolean
      desktop: boolean
    }>
  >
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: {
    mobile?: boolean
    desktop?: boolean
  }
}

function SidebarProvider({ children, defaultCollapsed }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState({
    mobile: defaultCollapsed?.mobile ?? true,
    desktop: defaultCollapsed?.desktop ?? false,
  })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

const sidebarVariants = cva(
  "relative flex h-full flex-col overflow-hidden data-[collapsible=both]:transition-[max-width] data-[collapsible=desktop]:transition-[max-width] data-[collapsible=icon]:transition-[max-width] data-[collapsible=icon]:data-[collapsed=true]:w-[--sidebar-icon-width] data-[collapsible=mobile]:md:transition-[max-width] data-[collapsible=none]:transition-none",
  {
    variants: {
      collapsible: {
        both: "w-[--sidebar-width] data-[collapsed=true]:w-[--sidebar-icon-width]",
        desktop: "w-[--sidebar-width] md:data-[collapsed=true]:w-[--sidebar-icon-width]",
        icon: "w-[--sidebar-width]",
        mobile: "w-[--sidebar-width] data-[collapsed=true]:w-0 md:data-[collapsed=true]:w-[--sidebar-width]",
        none: "w-[--sidebar-width]",
      },
    },
    defaultVariants: {
      collapsible: "both",
    },
  },
)

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  defaultCollapsed?: {
    mobile?: boolean
    desktop?: boolean
  }
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsible = "both", defaultCollapsed, ...props }, ref) => {
    const { collapsed, setCollapsed, isMobile } = useSidebar()

    React.useEffect(() => {
      if (defaultCollapsed) {
        setCollapsed((prev) => ({
          ...prev,
          ...(defaultCollapsed.mobile !== undefined ? { mobile: defaultCollapsed.mobile } : {}),
          ...(defaultCollapsed.desktop !== undefined ? { desktop: defaultCollapsed.desktop } : {}),
        }))
      }
    }, [defaultCollapsed, setCollapsed])

    return (
      <div
        ref={ref}
        className={cn(sidebarVariants({ collapsible }), "group/sidebar", className)}
        data-collapsed={isMobile ? collapsed.mobile : collapsed.desktop ? true : undefined}
        data-collapsible={collapsible}
        style={{
          "--sidebar-width": "240px",
          "--sidebar-icon-width": "4rem",
        } as React.CSSProperties}
        {...props}
      />
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 px-2 py-2", className)} {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-1 flex-col gap-2 overflow-auto", className)} {...props} />
  ),
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 px-2 py-2", className)} {...props} />
  ),
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { collapsed, setCollapsed, isMobile } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          "absolute right-0 top-0 h-full w-[12px] translate-x-1/2 cursor-col-resize touch-none select-none bg-transparent opacity-0 transition-opacity group-hover/sidebar:opacity-100",
          className,
        )}
        onPointerDown={(e) => {
          if (e.button !== 0) return

          e.preventDefault()
          e.stopPropagation()

          const target = e.target as HTMLDivElement
          const rect = target.getBoundingClientRect()
          const offsetX = e.clientX - rect.left

          const onPointerMove = (e: PointerEvent) => {
            const width = e.clientX - offsetX
            const minWidth = 64
            const maxWidth = 480

            if (width < minWidth) {
              setCollapsed((prev) => ({
                ...prev,
                desktop: true,
              }))
            } else if (width > minWidth && width < maxWidth) {
              setCollapsed((prev) => ({
                ...prev,
                desktop: false,
              }))
              target.parentElement!.style.setProperty("--sidebar-width", `${width}px`)
            }
          }

          const onPointerUp = () => {
            document.removeEventListener("pointermove", onPointerMove)
            document.removeEventListener("pointerup", onPointerUp)
          }

          document.addEventListener("pointermove", onPointerMove)
          document.addEventListener("pointerup", onPointerUp)
        }}
        {...props}
      />
    )
  },
)
SidebarRail.displayName = "SidebarRail"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { collapsed, setCollapsed, isMobile } = useSidebar()

    return (
      <button
        ref={ref}
        className={cn("h-8 w-8 rounded-md border bg-muted p-1 text-muted-foreground", className)}
        onClick={() => {
          if (isMobile) {
            setCollapsed((prev) => ({
              ...prev,
              mobile: !prev.mobile,
            }))
          } else {
            setCollapsed((prev) => ({
              ...prev,
              desktop: !prev.desktop,
            }))
          }
        }}
        {...props}
      >
          <Sidebar />
        {/*Toggle Sidebar*/}
      </button>
    )
  },
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { collapsed, isMobile } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-1 flex-col",
          isMobile && collapsed.mobile && "ml-0",
          isMobile && !collapsed.mobile && "ml-[--sidebar-width]",
          !isMobile && collapsed.desktop && "ml-[--sidebar-icon-width]",
          !isMobile && !collapsed.desktop && "ml-[--sidebar-width]",
          "transition-[margin]",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarInset.displayName = "SidebarInset"

const SidebarMenuBadge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'ml-auto inline-flex items-center rounded-full px-2.5 py-0.5  font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className,
      )}
      {...props}
    />
  ),
)
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSub = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("grid gap-1.5 pl-4", className)} {...props} />,
)
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex items-center", className)} {...props} />
  ),
)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'flex  items-center gap-2 rounded-md px-2 py-1.5  font-medium transition-colors hover:bg-base-200 data-[active=true]:bg-base-200',
        className,
      )}
      {...props}
    />
  ),
)
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarMenuAction,
  useSidebar,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
}

