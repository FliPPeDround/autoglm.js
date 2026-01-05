import type { AutoGLM } from 'autoglm.js'
import type { NavigateFunction } from 'react-router'
import { ErrorCode } from 'autoglm.js'
import fs from 'fs-extra'
import { AUTOGLM_CONFIG_FILEPATH } from '@/constants'

export interface InitializationResult {
  version: string
  devices: Awaited<ReturnType<AutoGLM['adb']['getConnectedDevices']>>
  systemCheck: boolean
  apiCheck: boolean
  currentDeviceId?: string
}

export interface InitializeAgentOptions {
  agent: AutoGLM
  config: { deviceId?: string }
  navigate: NavigateFunction
  setVersion: (version: string) => void
  setDevices: (devices: Awaited<ReturnType<AutoGLM['adb']['getConnectedDevices']>>) => void
  setSystemCheck: (check: boolean) => void
  setApiCheck: (check: boolean) => void
  setCurrentDeviceId: (deviceId: string | undefined) => void
}

export async function initializeAgent(options: InitializeAgentOptions) {
  const { agent, navigate, config, setVersion, setDevices, setSystemCheck, setApiCheck, setCurrentDeviceId } = options

  await ensureConfigFileExists(AUTOGLM_CONFIG_FILEPATH, config)

  const version = await fetchVersionInfo(agent)
  setVersion(version)

  const { deviceId } = await fetchDevices(agent, config, setDevices)
  if (deviceId !== undefined) {
    setCurrentDeviceId(deviceId)
  }

  // ensure adb platform tools
  await ensureADBAble(agent, navigate)
  setSystemCheck(true)
  const apiCheck = await checkModelApi(agent)
  setApiCheck(apiCheck)
}

enum SystemStatus {
  CHECKING,
  NEED_INSTALL,
  NEED_DEVICE,
  NEED_INSTALL_KEYBOARD,
  READY,
}

async function ensureADBAble(agent: AutoGLM, navigate: NavigateFunction): Promise<void> {
  let status: SystemStatus = SystemStatus.CHECKING

  while (status !== SystemStatus.READY) {
    switch (status) {
      case SystemStatus.CHECKING: {
        const result = await agent.checkSystemRequirements()
        if (result.success) {
          status = SystemStatus.READY
        }
        else if (result.code === ErrorCode.ADB_NOT_INSTALLED) {
          status = SystemStatus.NEED_INSTALL
        }
        else if (result.code === ErrorCode.ADB_DEVICE_UNCONNECTED) {
          status = SystemStatus.NEED_DEVICE
        }
        else if (result.code === ErrorCode.ADB_KEYBOARD_UNINSTALLED) {
          status = SystemStatus.NEED_INSTALL_KEYBOARD
        }
        break
      }

      case SystemStatus.NEED_INSTALL: {
        await agent.adb.install()
        status = SystemStatus.CHECKING
        break
      }

      case SystemStatus.NEED_INSTALL_KEYBOARD: {
        navigate('/install-keyboard')
        const res = await agent.adb.installKeyboard()
        if (res.success) {
          navigate('/')
          status = SystemStatus.CHECKING
        }
        else {
          throw new Error(res.message)
        }
        break
      }

      case SystemStatus.NEED_DEVICE: {
        navigate('/help', { state: { code: ErrorCode.ADB_DEVICE_UNCONNECTED } })
        status = SystemStatus.CHECKING
        break
      }
    }
  }
}

async function ensureConfigFileExists(configPath: string, defaultConfig: Record<string, unknown>): Promise<void> {
  if (!fs.existsSync(configPath)) {
    await fs.outputJson(configPath, defaultConfig, { spaces: 2 })
  }
}

async function checkModelApi(agent: AutoGLM): Promise<boolean> {
  try {
    const result = await agent.checkModelApi()
    return result.success
  }
  catch {
    return false
  }
}

async function fetchVersionInfo(agent: AutoGLM): Promise<string> {
  try {
    const versionInfo = await agent.adb.getVersion()
    return versionInfo.success ? `v${versionInfo.version || 'Not Installed'}` : 'Not Installed'
  }
  catch {
    return 'Error'
  }
}

async function fetchDevices(
  agent: AutoGLM,
  config: { deviceId?: string },
  setDevices: (devices: Awaited<ReturnType<AutoGLM['adb']['getConnectedDevices']>>) => void,
): Promise<{ devices: Awaited<ReturnType<AutoGLM['adb']['getConnectedDevices']>>, deviceId?: string }> {
  try {
    const deviceList = await agent.adb.getConnectedDevices()
    setDevices(deviceList)

    let deviceId: string | undefined
    if (deviceList.length > 0 && !config.deviceId) {
      deviceId = deviceList[0].deviceId
      agent.updateConfig({ deviceId })
    }

    return { devices: deviceList, deviceId }
  }
  catch {
    setDevices([])
    return { devices: [] }
  }
}
