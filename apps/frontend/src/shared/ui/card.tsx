import { Fragment, type ReactNode } from "react"
import { cn } from "../utils/cn"

type CardProps = {
  title?: ReactNode
  description?: ReactNode
  items?: {
    title: ReactNode
    description: ReactNode
  }[]
  variant?: "green" | "red"
}

export const Card = (props: CardProps) => {
  const variant = props.variant ?? "green"

  return (
    <div className="relative p-6 bg-inversed/5 rounded-[40px] border border-inversed/5 flex-col gap-4 flex overflow-hidden">
      <div
        className={cn(
          "absolute left-4 right-4 aspect-square bg-accent/25 rounded-full pointer-events-none bottom-0 translate-y-1/2 blur-[64px] animate-fade-in",
          variant === "green" && "bg-accent/25",
          variant === "red" && "bg-[#FF0004] bg-opacity-25"
        )}
      />

      <div className="justify-center items-center gap-2 flex z-10">
        <div className="flex-col justify-center items-center gap-1 flex">
          <p
            className="text-center text-2xl font-semibold"
            children={props.title}
          />
          <p
            className="text-center text-primary/30 text-sm font-medium"
            children={props.description}
          />
        </div>
      </div>
      <div className="py-4 bg-primary/30 rounded-2xl border border-inversed/5 items-center flex z-10">
        {props.items?.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Fragment key={index}>
            <div className="flex-1 flex-col justify-start items-center flex">
              <p className="text-lg font-semibold" children={item.title} />
              <p
                className="text-center text-white/30 text-xs font-normal"
                children={item.description}
              />
            </div>
            {index + 1 !== props.items?.length && (
              <div className="bg-inversed/50 h-full rounded-full w-px" />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
