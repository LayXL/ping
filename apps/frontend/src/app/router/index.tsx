import { Game } from "@/pages/game"
import { Outlet, createBrowserRouter } from "react-router-dom"
import { Home } from "../../pages/home"

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="font-sans bg-gradient-to-b from-[#005143] to-[#001c1a] h-screen max-h-screen overflow-hidden">
        <Outlet />
      </div>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/game",
        element: <Game />,
      },
    ],
  },
])
