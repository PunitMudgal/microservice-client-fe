import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm"
  /** Adds hover lift, shadow growth, and a top accent line reveal. */
  interactive?: boolean
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-interactive={interactive ? "" : undefined}
      className={cn(
        // Base: uses card tokens so it still respects the theme, plus a soft
        // shadow and subtle ring that reads well on the cream storefront bg.
        "group/card relative flex flex-col gap-(--card-spacing) overflow-hidden rounded-2xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 shadow-[0_10px_30px_-12px_rgba(84,47,16,0.10)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        // Interactive: gentle lift + deeper shadow, with a thin top accent that
        // slides in on hover. Matches the storefront's hover idiom.
        "data-[interactive]:hover:-translate-y-1.5 data-[interactive]:hover:shadow-[0_24px_48px_-16px_rgba(84,47,16,0.22)] data-[interactive]:hover:ring-foreground/15 data-[interactive]:focus-visible:outline-none data-[interactive]:focus-visible:ring-2 data-[interactive]:focus-visible:ring-[#b85625] data-[interactive]:focus-visible:ring-offset-2",
        "before:data-[interactive]:pointer-events-none before:data-[interactive]:absolute before:data-[interactive]:inset-x-0 before:data-[interactive]:top-0 before:data-[interactive]:h-0.5 before:data-[interactive]:origin-left before:data-[interactive]:scale-x-0 before:data-[interactive]:bg-[#f4b544] before:data-[interactive]:transition-transform before:data-[interactive]:duration-700 before:data-[interactive]:ease-[cubic-bezier(0.32,0.72,0,1)] before:data-[interactive]:content-[''] before:data-[interactive]:hover:scale-x-100",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-2 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base font-semibold tracking-[-0.01em] text-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm leading-relaxed text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing) [&:not(:first-child)]:pt-0", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
