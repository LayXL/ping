import { GameModeSelect } from "@/app/widgets/game-mode-select"
import { trpc } from "@/shared/utils/trpc.ts"
import { motion } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useHaptic } from "../hooks/use-haptic"
import { Button } from "./button"
import { Card } from "./card"
import { Game } from "./game"

enum ScreenState {
  GAME = 0,
  GAME_OVER = 1,
}

type GameWrapperProps = {
  mode: "classic" | "friend"
  id?: number
  coinSpawnAt?: Date
}

export const GameWrapper = (props: GameWrapperProps) => {
  const endGameMutation = trpc.game.end.useMutation()

  const navigate = useNavigate()
  const haptic = useHaptic()

  const [state, setState] = useState<ScreenState>(ScreenState.GAME)
  const [score, setScore] = useState(0)

  return (
    <div className="relative size-full flex flex-col">
      <Game
        mode={props.mode}
        onDead={(score) => {
          setState(ScreenState.GAME_OVER)
          setScore(score)
          haptic("error")

          if (props.id) {
            endGameMutation.mutate({
              gameId: props.id,
              score,
            })
          }
        }}
        withOffset={state === ScreenState.GAME}
        gameId={props.id}
        coinSpawnAt={props.coinSpawnAt}
      />

      <motion.div
        className="pointer-events-none"
        initial={{ opacity: 1, height: 352 }}
        animate={{ opacity: 0, height: 0 }}
      >
        <div className="p-4">
          <GameModeSelect mode={props.mode} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: state === ScreenState.GAME_OVER ? 1 : 0,
          height: state === ScreenState.GAME_OVER ? 428 : 0,
        }}
      >
        <div className="p-4 flex flex-col gap-4">
          <Card
            variant="red"
            title="Игра окончена"
            description="Ваш счёт"
            items={[
              {
                title: score,
                description: "Результат",
              },
            ]}
          />
          <div className="flex flex-col gap-2">
            <Button label="Продолжить" onClick={() => navigate("/")} />
            {/* <Button
              variant="secondary"
              label="Поделиться"
              onClick={() => {
                // TODO
                navigate("/")
              }}
            /> */}
          </div>
          <p className="text-primary/75 font-medium text-sm text-center">
            Поделитесь результатом с друзьями
          </p>
        </div>
      </motion.div>
    </div>
  )
}
