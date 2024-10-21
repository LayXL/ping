import { cn } from "@/shared/utils/cn"
import type { ClassValue } from "clsx"
import { type CSSProperties, useMemo } from "react"
import type { IconName } from "../types/icon-name"

export type IconProps = {
  name: IconName
  size?: number
  color?: string
  className?: ClassValue
}

export const Icon = (props: IconProps) => {
  const size = props.size ?? 24

  const styles = useMemo<CSSProperties>(
    () => ({
      "--size": `${size}px`,
      maskImage: `url(/icons/${props.name}.svg)`,
      maskPosition: "center center",
      maskSize: "var(--size)",
      color: props.color ?? "currentcolor",
    }),
    [size, props.name, props.color]
  )

  return (
    <span
      className={cn("block size-[var(--size)] bg-current", props.className)}
      style={styles}
    />
  )
}
