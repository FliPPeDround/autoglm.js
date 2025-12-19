import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import { isLinux, isMacOS, isWindows } from 'std-env'
import { exec } from 'tinyexec'
import unzip from 'unzipper'
import { __dirname } from '@/utils/dirname'

export class ADBAutoInstaller {
  private installPath: string
  private shell: string

  constructor() {
    this.installPath = this.getDefaultInstallPath() || path.join(os.homedir(), '.adb')
    this.shell = this.getCurrentShell()!
  }

  /**
   * 智能解析asset路径，兼容开发和生产环境
   */
  private resolveAssetPath(filename: string): string {
    const possiblePaths = [
      path.join(__dirname, '../asset', filename),
      path.join(__dirname, '../../asset', filename),
      path.join(process.cwd(), 'node_modules/autoglm.js/asset', filename),
    ]

    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath)) {
        return tryPath
      }
    }

    return path.join(__dirname, '../../asset', filename)
  }

  getCurrentShell() {
    const shellPath = process.env.SHELL
    if (!shellPath) {
      return isMacOS ? 'zsh' : 'bash'
    }
    if (shellPath.includes('bash')) {
      return 'bash'
    }
    if (shellPath.includes('zsh')) {
      return 'zsh'
    }
  }

  getDefaultInstallPath() {
    if (isWindows) {
      return path.join(process.env.ProgramFiles || os.homedir(), 'adb')
    }
    if (isMacOS) {
      return path.join(os.homedir(), '.adb')
    }
    if (isLinux) {
      return path.join(os.homedir(), '.adb')
    }
  }

  async install() {
    await fs.ensureDir(this.installPath)
    if (isMacOS) {
      await this.installOnMacOS()
      await this.setupEnvironmentVariables()
    }
    else if (isLinux) {
      await this.installOnLinux()
      await this.setupEnvironmentVariables()
    }
    else if (isWindows) {
      await this.installOnWindows()
      await this.setupEnvironmentVariables()
    }
  }

  async setupEnvironmentVariables() {
    if (isMacOS || isLinux) {
      await this.setupUnixEnv()
    }
    else if (isWindows) {
      await this.setupWindowsEnv()
    }
  }

  async check() {
    try {
      await exec('adb', ['version'])
      return true
    }
    catch {
      return false
    }
  }

  async installOnMacOS() {
    const zipPath = this.resolveAssetPath('platform-tools-latest-darwin.zip')
    const platformToolsPath = path.join(this.installPath, 'platform-tools')
    const adbPath = path.join(platformToolsPath, 'adb')

    // 检查ZIP文件是否存在
    if (!await fs.pathExists(zipPath)) {
      throw new Error(`macOS platform tools not found at: ${zipPath}. Please ensure the asset file exists.`)
    }

    // 如果adb文件已存在，则跳过安装
    if (await fs.pathExists(adbPath)) {
      return
    }

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzip.Extract({ path: this.installPath }))
        .on('close', async () => {
          try {
            // 给可执行文件添加执行权限
            const executables = ['adb', 'fastboot']

            for (const executable of executables) {
              const filePath = path.join(platformToolsPath, executable)
              try {
                await fs.chmod(filePath, 0o755)
              }
              catch {
                continue
              }
            }
            resolve()
          }
          catch (error) {
            reject(error)
          }
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }

  async installOnLinux() {
    const zipPath = this.resolveAssetPath('platform-tools-latest-linux.zip')
    const platformToolsPath = path.join(this.installPath, 'platform-tools')
    const adbPath = path.join(platformToolsPath, 'adb')

    // 检查ZIP文件是否存在
    if (!await fs.pathExists(zipPath)) {
      throw new Error(`Linux platform tools not found at: ${zipPath}. Please ensure the asset file exists.`)
    }

    // 如果adb文件已存在，则跳过安装
    if (await fs.pathExists(adbPath)) {
      return
    }

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzip.Extract({ path: this.installPath }))
        .on('close', async () => {
          try {
            // 给可执行文件添加执行权限
            const executables = ['adb', 'fastboot']

            for (const executable of executables) {
              const filePath = path.join(platformToolsPath, executable)
              try {
                await fs.chmod(filePath, 0o755)
              }
              catch {
                continue
              }
            }
            resolve()
          }
          catch (error) {
            reject(error)
          }
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }

  async installOnWindows() {
    const zipPath = this.resolveAssetPath('platform-tools-latest-windows.zip')
    const platformToolsPath = path.join(this.installPath, 'platform-tools')
    const adbPath = path.join(platformToolsPath, 'adb.exe')

    // 检查ZIP文件是否存在
    if (!await fs.pathExists(zipPath)) {
      throw new Error(`Windows platform tools not found at: ${zipPath}. Please ensure the asset file exists.`)
    }

    // 如果adb文件已存在，则跳过安装
    if (await fs.pathExists(adbPath)) {
      return
    }

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzip.Extract({ path: this.installPath }))
        .on('close', async () => {
          // Windows平台不需要额外设置执行权限
          resolve()
        })
        .on('error', (error) => {
          reject(new Error(`Failed to extract Windows platform tools: ${error.message}`))
        })
    })
  }

  private async setupUnixEnv() {
    let shellConfigPath = ''
    switch (this.shell) {
      case 'bash':
        shellConfigPath = path.join(os.homedir(), '.bashrc')
        break
      case 'zsh':
        shellConfigPath = path.join(os.homedir(), '.zshrc')
        break
      default:
        shellConfigPath = path.join(os.homedir(), '.profile')
        break
    }
    await fs.ensureFile(shellConfigPath)
    const platformToolsPath = path.join(this.installPath, 'platform-tools')
    const exportLine = `
# Add Android SDK platform-tools to PATH By AutoGLM
export PATH="$PATH:${platformToolsPath}"
`
    const content = await fs.readFile(shellConfigPath, 'utf8')
    if (!content.includes(platformToolsPath)) {
      await fs.appendFile(shellConfigPath, exportLine)
    }

    if (!process.env.PATH?.includes(platformToolsPath)) {
      process.env.PATH = `${process.env.PATH}:${platformToolsPath}`
    }
  }

  private async setupWindowsEnv() {
    const platformToolsPath = path.join(this.installPath, 'platform-tools')

    // 更新当前进程的PATH环境变量
    if (!process.env.PATH?.includes(platformToolsPath)) {
      process.env.PATH = `${process.env.PATH};${platformToolsPath}`
    }

    // 注意：修改Windows系统环境变量需要管理员权限，这里只修改当前进程的环境变量
    // 如果需要永久修改，可以考虑使用注册表或setx命令，但这需要管理员权限
  }
}
