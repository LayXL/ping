import { motion, useAnimationControls } from "framer-motion"
import { useEffect, useState } from "react"

type PointsProps = {
  value: number
}

export const Points = (props: PointsProps) => {
  const [displayValue, setDisplayValue] = useState(props.value)

  const animationControls = useAnimationControls()

  useEffect(() => {
    setDisplayValue(props.value)

    if (props.value > 0) {
      animationControls.start({
        scale: [1.5, 1],
        color: ["#00ff00", "#fff"],
      })
    }
  }, [animationControls, props.value])

  return (
    <motion.div
      animate={animationControls}
      transition={{ duration: 0.3 }}
      className="text-2xl font-bold text-center"
      children={displayValue}
    />
  )
}
