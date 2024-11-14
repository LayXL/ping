import bridge, { EAdsFormats } from "@vkontakte/vk-bridge"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"
import { QueryProvider } from "./query-provider"
import { router } from "./router"
import { ThemeConfig } from "./theme-config"

bridge.send("VKWebAppInit").then(() => {})

bridge
  .send("VKWebAppCheckNativeAds", {
    ad_format: EAdsFormats.INTERSTITIAL,
  })
  .then(() => {})

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = createRoot(document.getElementById("root")!)

root.render(
  <StrictMode>
    <QueryProvider>
      <ThemeConfig>
        <RouterProvider router={router} />
      </ThemeConfig>
    </QueryProvider>
  </StrictMode>
)
