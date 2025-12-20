import type { ConnectionType } from './constants'

/**
 * Device information.
 */
export interface DeviceInfo {
  deviceId: string
  status: 'device' | 'unauthorized' | 'offline'
  connectionType: ConnectionType
  model?: string
}

/**
 * Screenshot data.
 */
export class Screenshot {
  constructor(
    public base64Data: string,
    public width: number,
    public height: number,
  ) {}
}

/**
 * ADB keyboard check result.
 */
export interface ADBKeyboardCheckResult {
  success: boolean
  message: string
}
