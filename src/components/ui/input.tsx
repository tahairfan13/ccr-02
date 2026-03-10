import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl bg-[#f5f5f5] px-4 py-2 text-[16px] md:text-[15px] text-[#1B1B1B] transition-all duration-200",
          "placeholder:text-[#b0b0b0]",
          "focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B1B1B]/10 focus:shadow-[0_0_0_1px_rgba(27,27,27,0.12)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
