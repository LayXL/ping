import { readdirSync, watch } from "node:fs"
import path from "node:path"

export const startWatcher = () => {
  const watcher = watch(import.meta.dir, { recursive: true }, (_, filename) => {
    if (filename?.startsWith("routes/")) codegen()
  })

  codegen()
}

export const codegen = async () => {
  console.info("Updating changes")

  const dirs = getRoutes()

  for (const dir of dirs) {
    const files = getFiles(`routes/${dir}`)

    const codegen = files
      .filter((file) => file !== "index.ts")
      .map((file) => `export * from "./${file}"`)
      .join("\n")

    if (
      files.length > 0 &&
      (await Bun.file(
        path.join(import.meta.dir, `routes/${dir}/index.ts`)
      ).text()) !== codegen
    ) {
      await Bun.write(
        path.join(import.meta.dir, `routes/${dir}/index.ts`),
        codegen
      )
    }
  }
}

const getRoutes = () => {
  return readdirSync(path.join(import.meta.dir, "routes"), {
    withFileTypes: true,
  })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name)
}

const getFiles = (pathEntry: string) => {
  return readdirSync(path.join(import.meta.dir, pathEntry), {
    withFileTypes: true,
  })
    .filter((file) => file.isFile())
    .map((file) => file.name)
}
