import { Fragment, type ReactNode } from "react"

type CardProps = {
  title?: ReactNode
  description?: ReactNode
  items?: {
    title: ReactNode
    description: ReactNode
  }[]
}

export const Card = (props: CardProps) => {
  return (
    <div className="p-4 bg-inversed/5 rounded-[32px] border border-inversed/5 flex-col gap-4 flex">
      <div className="justify-center items-center gap-2 flex">
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
      <div className="py-4 bg-primary/30 rounded-2xl border border-inversed/5 items-center flex">
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
