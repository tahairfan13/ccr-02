import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-12 w-full rounded-xl bg-[#f5f5f5] px-4 py-2 text-[16px] md:text-[15px] text-[#1B1B1B] transition-all duration-200 appearance-none",
          "focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B1B1B]/10 focus:shadow-[0_0_0_1px_rgba(27,27,27,0.12)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2212%22%20height%3d%2212%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%23999%22%20stroke-width%3d%222.5%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpath%20d%3d%22m6%209%206%206%206-6%22%2f%3e%3c%2fsvg%3e')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
