import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { GameWrapper } from "./shared/ui/game-wrapper"

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameWrapper />
  </React.StrictMode>
)
