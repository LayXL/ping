import NumberFlow from "@number-flow/react"
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
      // animationControls._start({ scale: [1.5, 1] })
    }
  }, [animationControls, props.value])

  return (
    <motion.div
      animate={animationControls}
      transition={{ duration: 0.3 }}
      className="text-[128px] font-black opacity-50 text-center mix-blend-soft-light"
    >
      <NumberFlow value={displayValue} />
    </motion.div>
  )
}
