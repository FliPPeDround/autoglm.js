import path from 'node:path'
import { __dirname, extractZip } from '@autoglm.js/shared'

export async function installADB(installPath: string) {
  const adbZipPath = path.join(__dirname, '../', 'platform-tools-latest-linux.zip')
  await extractZip(adbZipPath, installPath)
}
