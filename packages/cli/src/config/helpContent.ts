import type { HelpContentMap } from '../types/help'
import { ErrorCode } from 'autoglm.js'

export const helpContentMap: HelpContentMap = {
  [ErrorCode.ADB_DEVICE_UNCONNECTED]: {
    title: 'help.adbDeviceUnconnected.title',
    titleColor: 'red',
    errorCode: ErrorCode.ADB_DEVICE_UNCONNECTED,
    sections: [
      {
        title: 'help.adbDeviceUnconnected.problemDescription',
        items: [
          { text: 'help.adbDeviceUnconnected.deviceUnconnected', important: true },
          { text: 'help.adbDeviceUnconnected.checkSteps' },
        ],
      },
      {
        title: 'help.adbDeviceUnconnected.solution',
        items: [
          { step: 1, text: 'help.adbDeviceUnconnected.ensureConnected', important: true },
          { step: 2, text: 'help.adbDeviceUnconnected.enableDeveloperOptions' },
          { text: 'help.adbDeviceUnconnected.aboutPhone' },
          { text: 'help.adbDeviceUnconnected.tapVersion' },
          { step: 3, text: 'help.adbDeviceUnconnected.enableUsbDebugging' },
          { text: 'help.adbDeviceUnconnected.developerOptions' },
          { text: 'help.adbDeviceUnconnected.turnOnUsbDebugging' },
          { step: 4, text: 'help.adbDeviceUnconnected.authorizeUsbDebugging' },
          { text: 'help.adbDeviceUnconnected.allowUsbDebugging' },
          { text: 'help.adbDeviceUnconnected.alwaysAllow' },
          { step: 5, text: 'help.adbDeviceUnconnected.checkConnection' },
          { text: 'help.adbDeviceUnconnected.reconnectUsb' },
          { text: 'help.adbDeviceUnconnected.fileTransferMode' },
        ],
      },
      {
        title: 'help.adbDeviceUnconnected.commonIssues',
        items: [
          { text: 'help.adbDeviceUnconnected.noUsbDebuggingOption' },
          { text: 'help.adbDeviceUnconnected.secureSettings' },
          { text: 'help.adbDeviceUnconnected.directConnection' },
          { text: 'help.adbDeviceUnconnected.dataCable' },
        ],
      },
    ],
    footer: {
      text: 'help.adbDeviceUnconnected.footer',
      color: 'green',
    },
  },
}

export const defaultHelpContent = {
  title: 'help.title',
  titleColor: 'blue',
  sections: [
    {
      title: 'help.genericHelp',
      items: [
        { text: 'help.noSpecificHelp' },
        { text: 'help.contactSupport' },
      ],
    },
  ],
}
