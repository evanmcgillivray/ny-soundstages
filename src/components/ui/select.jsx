import React from "react"

export function Select({ className, children, ...props }) {
  return (
    <select
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function SelectTrigger({ className, children, ...props }) {
  return (
    <div className={`relative ${className}`} {...props}>
      {children}
    </div>
  )
}

export function SelectContent({ className, children, ...props }) {
  return (
    <div className={`absolute mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${className}`} {...props}>
      {children}
    </div>
  )
}

export function SelectItem({ className, children, ...props }) {
  return (
    <div className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function SelectValue({ className, children, ...props }) {
  return <span className={className} {...props}>{children}</span>
}