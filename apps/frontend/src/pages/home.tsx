import { Game } from "@/shared/ui/game"
import { trpc } from "@/shared/utils/trpc.ts"
import { GameModeSelect } from "@/widgets/game-mode-select"
import { Header } from "@/widgets/header.tsx"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Home = () => {
  const navigate = useNavigate()
  const selectedSkin = trpc.shop.getSelectedSkin.useQuery()
  const remainingScore = trpc.user.getRemainingScore.useQuery()

  trpc.user.updateData.useQuery(undefined, {
    staleTime: Number.POSITIVE_INFINITY,
  })

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
      <div className="flex-1 p-4 pt-0 flex flex-col gap-4 relative">
        {mode === "classic" && (
          <div className={"fixed w-full pt-3 left-0"}>
            <p className="text-center text-sm font-medium opacity-50">
              Вы получили {remainingScore.data?.remainingScore ?? 0}/100 баллов
              сегодня
            </p>
          </div>
        )}
        <div className="flex-1 -m-4 mb-0">
          <Game
            key={mode}
            mode={mode}
            isPreview
            skin={selectedSkin.data ?? "default"}
          />
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
