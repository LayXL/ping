import type { ReactNode } from "react"
import { cn } from "../utils/cn"

type CardProps = {
  children?: ReactNode
  variant?: "default" | "red"
  color?: string
}

export const PrimitiveCard = (props: CardProps) => {
  const variant = props.variant ?? "default"

  return (
    <div className="relative bg-inversed/5 rounded-[40px] border border-inversed/5 overflow-hidden grid">
      <div
        className={cn(
          "absolute left-4 right-4 aspect-square bg-accent/25 rounded-full pointer-events-none bottom-0 translate-y-1/2 blur-[64px] animate-fade-in transition-colors",
          variant === "default" && "bg-accent/25",
          variant === "red" && "bg-[#FF0004] bg-opacity-25",
          props.color && "bg-[var(--color)]"
        )}
        style={{
          "--color": props.color,
        }}
      />

      <div className="z-10">{props.children}</div>
    </div>
  )
}
