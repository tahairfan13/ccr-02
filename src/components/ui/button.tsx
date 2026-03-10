import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
          variant === "default" && "bg-[#1B1B1B] text-white hover:bg-[#2a2a2a] active:bg-[#111] px-6 py-2.5",
          variant === "outline" && "bg-transparent text-[#3a3a3a] hover:bg-[#f5f5f5] active:bg-[#ebebeb] px-5 py-2.5",
          variant === "ghost" && "bg-transparent text-[#707070] hover:text-[#1B1B1B] hover:bg-[#f5f5f5] px-4 py-2",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
