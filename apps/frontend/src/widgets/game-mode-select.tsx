import { useHaptic } from "@/shared/hooks/use-haptic.ts"
import { Button } from "@/shared/ui/button.tsx"
import { Icon } from "@/shared/ui/icon.tsx"
import { PrimitiveCard } from "@/shared/ui/primitive-card.tsx"
import { cn } from "@/shared/utils/cn.ts"
import { isMobile } from "react-device-detect"

type Mode = "classic" | "friend"

type GameModeSelectProps = {
  onPlay?: () => void
  mode: Mode
  onChangeMode?: (mode: Mode) => void
  isLoading?: boolean
}

const modesDescription = {
  classic: {
    title: "Классический",
    description: "Управляй платформой и отбивай шар",
  },
  friend: {
    title: "Дружеский",
    description: "Отбивай общий мяч с другом",
  },
} as const

export const GameModeSelect = (props: GameModeSelectProps) => {
  const haptic = useHaptic()

  return (
    <div className="flex flex-col gap-4">
      <PrimitiveCard>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center">
            <div
              onClick={() => {
                haptic("selection")

                const modes = Object.keys(modesDescription)
                const i = modes.findIndex((key) => key === props.mode)

                props.onChangeMode?.(
                  modes[
                    i === 0 ? modes.length - 1 : (i - 1) % modes.length
                  ] as Mode
                )
              }}
            >
              <Icon
                name={"chevron-left"}
                size={36}
                className="bg-accent hover:bg-accent/70 active:bg-accent/50"
              />
            </div>
            <p
              className="text-2xl font-semibold flex-1 text-center"
              children={modesDescription[props.mode].title}
            />
            <div
              onClick={() => {
                haptic("selection")

                const modes = Object.keys(modesDescription)
                const i = modes.findIndex((key) => key === props.mode)

                props.onChangeMode?.(modes[(i + 1) % modes.length] as Mode)
              }}
            >
              <Icon
                name={"chevron-right"}
                size={36}
                className="bg-accent hover:bg-accent/70 active:bg-accent/50"
              />
            </div>
          </div>
          <p
            className="text-primary/30 text-sm font-medium text-center"
            children={modesDescription[props.mode].description}
          />
        </div>
      </PrimitiveCard>

      <div className="flex items-center justify-center gap-3">
        {Object.keys(modesDescription).map((key) => (
          <div
            key={key}
            className={cn(
              "size-2 rounded-full bg-inversed transition-colors",
              props.mode === key && "bg-accent"
            )}
            onClick={() => props.onChangeMode?.(key as Mode)}
          />
        ))}
      </div>

      {props.mode === "friend" && !isMobile ? (
        <Button disabled label="Только на смартфоне" onClick={props.onPlay} />
      ) : (
        <Button
          loading={props.isLoading}
          label="Играть"
          onClick={props.onPlay}
        />
      )}

      <p className="text-primary/75 font-medium text-sm text-center">
        Выберите режим игры
      </p>
    </div>
  )
}
