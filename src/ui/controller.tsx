import { gameConfig } from "../config"

export const Controller = () => {
  return (
    <div
      className="bg-white rounded-full"
      style={{
        width: gameConfig.controllerSize,
        height: gameConfig.controllerHeight,
      }}
    />
  )
}
