import fs from 'fs-extra'

export async function updateJSON(path: string, data: Record<string, unknown>) {
  const config = await fs.readJson(path)
  Object.assign(config, data)
  await fs.outputJson(path, config, { spaces: 2 })
}
