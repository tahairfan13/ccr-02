import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-xl bg-[#f5f5f5] px-4 py-3 text-[16px] md:text-[15px] text-[#1B1B1B] transition-all duration-200",
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
Textarea.displayName = "Textarea"

export { Textarea }
