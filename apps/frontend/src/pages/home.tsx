import { Game } from "@/shared/ui/game"
import { trpc } from "@/shared/utils/trpc.ts"
import { GameModeSelect } from "@/widgets/game-mode-select"
import { Header } from "@/widgets/header.tsx"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Home = () => {
  const navigate = useNavigate()

  const [mode, setMode] = useState<"classic" | "friend">("classic")

  const startGameMutation = trpc.game.start.useMutation({
    onSuccess: (data) => {
      if (!data) return
      navigate("/game", {
        state: {
          mode,
          id: data.id,
          coinSpawnAt: data.nextCoinSpawnAt?.getTime(),
        },
      })
    },
  })

  return (
    <div className="h-full flex flex-col pb-safe-area-bottom">
      <Header />
      <div className="flex-1 p-4 pt-0 flex flex-col gap-4">
        <div className="flex-1 -m-4 mb-0">
          <Game key={mode} mode={mode} isPreview />
        </div>

        <GameModeSelect
          mode={mode}
          onChangeMode={setMode}
          onPlay={() => {
            if (mode === "classic") startGameMutation.mutate()
            else navigate("/game", { state: { mode } })
          }}
          isLoading={startGameMutation.isPending}
        />
      </div>
    </div>
  )
}
