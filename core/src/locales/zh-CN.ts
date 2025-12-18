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
        step2: '3.在设置中找到"语言和输入"',
        step3: '4.在"语言和输入"中找到"ADB 键盘"',
        step4: '5.启用"ADB 键盘"',
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
    language: '请选择语言',
    options: {
      baseUrl: '模型 API 基础 URL',
      model: '模型名称',
      apikey: 'API 密钥',
      maxSteps: '最大推理步数',
      deviceId: 'ADB设备 ID',
    },
  },
  prompt: {
    interactiveMode: 'AutoGLM.js 交互模式',
    model: '请输入模型名称',
    baseURL: '请输入模型 API 基础 URL',
    apiKey: '请输入模型 API 密钥',
    maxSteps: '请输入最大推理步数',
    done: '配置完成',
    cancel: '已取消配置',
    checking: '正在检查系统要求',
    task: '请描述您想要执行的任务',
    placeholder: '帮我预订一张明天去南通机票',
  },
  config: {
    errors: {
      fileNotFound: '配置文件不存在: ',
      invalidFormat: '配置文件必须是 JSON 格式，当前扩展名: ',
      jsonParseError: 'JSON 解析错误: ',
      fileReadError: '无法读取配置文件: ',
      permissionDenied: '没有权限读取配置文件: ',
      genericReadError: '读取配置文件时发生错误: ',
      schemaNotFound: '无法找到 schema 文件 agent-config.schema.json',
      validationFailed: '配置文件格式验证失败:\n',
      genericValidationError: '配置文件验证失败: ',
    },
  },
  think: '思考中',
  thinkDone: '思考完成',
  action: '执行动作',
  task_completed: '任务完成',
}
