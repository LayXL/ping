import type { ReactNode } from "react"

type ButtonProps = {
  label?: string
  after?: ReactNode
  onClick?: () => void
}

export const Button = (props: ButtonProps) => {
  return (
    <div
      className="h-16 flex items-center justify-center gap-2 bg-accent rounded-full hover:bg-opacity-80 active:bg-opacity-70 transition-colors"
      onClick={props.onClick}
    >
      <p
        children={props.label}
        className="text-on-accent text-lg font-medium"
      />
      {props.after}
    </div>
  )
}
