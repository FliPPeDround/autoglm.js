export default {
  adb: {
    unInstalledHint: {
      message: '未安装 ADB 或未添加到 PATH 环境变量',
      hint: {
        message: '请安装 ADB 并添加到 PATH 环境变量',
        macOS: 'brew install android-platform-tools',
        linux: 'sudo apt install android-tools-adb',
        windows: '从 https://developer.android.com/studio/releases/platform-tools 下载并安装 ADB',
      },
    },
    deviceUnconnectedHint: {
      message: '设备未连接',
      hint: {
        step1: '1.在设备上启用开发者选项',
        step2: '2.在设备上启用 USB 调试',
        step3: '3.连接设备到计算机',
      },
    },
    keyboardUnInstalledHint: {
      message: 'ADB 键盘未安装',
      description: 'ADB 键盘是一个用于在自动在设备上输入文本的软件',
      confirmFalse: '请手动安装 ADB 键盘',
      confirmFalsehint: {
        step1: '1.从 https://github.com/senzhk/ADBKeyBoard/blob/master/ADBKeyboard.apk 下载并安装 ADB 键盘',
        step2: '3.在设置中找到“语言和输入”',
        step3: '4.在“语言和输入”中找到“ADB 键盘”',
        step4: '5.启用“ADB 键盘”',
      },
      hint: {
        question: '是否自动安装 ADB 键盘？',
      },
    },
    installKeyboard: {
      start: '正在安装 ADB 键盘（可能需要手动确认）...',
      success: 'ADB 键盘安装成功',
    },
  },
  model: {
    check: {
      empty: '该模型 API 未正确返回数据',
    },
  },
  cli: {
    options: {
      baseUrl: '模型 API 基础 URL',
      model: '模型名称',
      apikey: 'API 密钥',
      maxSteps: '最大推理步数',
      deviceId: 'ADB设备 ID',
    },
  },
}
