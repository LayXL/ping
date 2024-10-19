import { Button } from "@/shared/ui/button"
import { Card } from "@/shared/ui/card"

type GameModeSelectProps = {
  onPlay?: () => void
}

export const GameModeSelect = (props: GameModeSelectProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Card
        title="Обычный"
        description="Управляй платформой и отбивай шар"
        items={[
          {
            title: "0",
            description: "Последняя игра",
          },
          {
            title: "0",
            description: "Рекорд",
          },
        ]}
      />

      <Button label="Играть" onClick={props.onPlay} />

      <p className="text-primary/75 font-medium text-sm text-center">
        Выберите режим игры
      </p>
    </div>
  )
}
