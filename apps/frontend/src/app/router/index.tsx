import { Outlet, createBrowserRouter } from "react-router-dom"
import { Home } from "../../pages/home"

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="font-sans bg-gradient-to-b from-[#001f1a] to-[#02151c] h-screen max-h-screen overflow-hidden">
        <Outlet />
      </div>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
])
