import { GameModeSelect } from "@/app/widgets/game-mode-select"
import { Game } from "@/shared/ui/game"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Home = () => {
  const navigate = useNavigate()

  const [mode, setMode] = useState<"classic" | "friend">("classic")

  return (
    <div className="h-full pb-safe-area-bottom">
      <div className="h-full p-4 flex flex-col gap-4">
        <div className="flex-1 -m-4 mb-0">
          <Game key={mode} mode={mode} isPreview />
        </div>

        <GameModeSelect
          mode={mode}
          onChangeMode={setMode}
          onPlay={() => navigate("/game", { state: { mode } })}
        />
      </div>
    </div>
  )
}
