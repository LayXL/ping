import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { GameWrapper } from "./ui/game-wrapper"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameWrapper />
  </React.StrictMode>
)
