import { useQuery } from "@tanstack/react-query"
import type { ClassValue } from "clsx"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import { useRef } from "react"
import { cn } from "../utils/cn"

type AnimationProps = {
  loop?: boolean
  animation: string
  width?: number | string | null
  height?: number | string | null
  className?: ClassValue
  size?: "default" | "large" | "unset"
}

export const Animation = ({
  loop = false,
  animation,
  className,
  ...props
}: AnimationProps) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  const width = props.size === "large" ? 200 : (props.width ?? 96)
  const height = props.size === "large" ? 200 : (props.height ?? 96)

  const { data } = useQuery({
    queryKey: ["lottie", animation],
    queryFn: () => fetch(animation).then((res) => res.json()),
    staleTime: Number.POSITIVE_INFINITY,
  })

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={data}
      className={cn(className)}
      style={{
        width: props.size === "unset" ? undefined : width,
        height: props.size === "unset" ? undefined : height,
      }}
      loop={loop}
      autoPlay={true}
    />
  )
}
