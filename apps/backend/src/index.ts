import { cors } from "@elysiajs/cors"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { Elysia } from "elysia"
import { createContext } from "./context"
import { router } from "./routes"
import { vkPayments } from "./vkPayments"

export const app = new Elysia()
  .use(cors())
  .all("/api/*", (opts) =>
    fetchRequestHandler({
      endpoint: "/api",
      router: router,
      req: opts.request,
      createContext,
      onError:
        Bun.env.TEST !== "true"
          ? (opts) => console.error("Error:", opts.error)
          : undefined,
    })
  )
  .use(vkPayments)
  .listen(Bun.env.SERVER_PORT ?? 3000)

console.info(`Server is running at ${app.server?.hostname}:${app.server?.port}`)

// export const elysia = treaty<typeof app>("/")
