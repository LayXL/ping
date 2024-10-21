import type { ReactNode } from "react"
import { useHaptic } from "../hooks/use-haptic"
import { cn } from "../utils/cn"

type ButtonProps = {
  disabled?: boolean
  variant?: "primary" | "secondary"
  label?: string
  after?: ReactNode
  onClick?: () => void
}

export const Button = (props: ButtonProps) => {
  const haptic = useHaptic()
  const variant = props.variant ?? "primary"

  return (
    <div
      className={cn(
        "h-16 flex items-center justify-center gap-2 rounded-full transition-colors",
        variant === "primary" &&
          "bg-accent hover:bg-opacity-80 active:bg-opacity-70 text-on-accent",
        variant === "secondary" &&
          "border border-accent hover:border-accent/80 active:border-accent/70 text-accent hover:text-accent/80 active:text-accent/70",
        props.disabled && "opacity-30 cursor-not-allowed"
      )}
      onClick={() => {
        haptic("selection")
        props.onClick?.()
      }}
    >
      <p children={props.label} className="text-lg font-medium" />
      {props.after}
    </div>
  )
}
