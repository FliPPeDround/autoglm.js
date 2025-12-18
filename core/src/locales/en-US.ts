export default {
  adb: {
    unInstalledHint: {
      message: 'ADB is not installed or not added to PATH environment variable',
      hint: {
        message: 'Please install ADB and add it to PATH environment variable',
        macOS: 'brew install android-platform-tools',
        linux: 'sudo apt install android-tools-adb',
        windows: 'Download and install ADB from https://developer.android.com/studio/releases/platform-tools',
      },
    },
    deviceUnconnectedHint: {
      message: 'Device is not connected',
      hint: {
        step1: '1. Enable Developer Options on the device',
        step2: '2. Enable USB Debugging on the device',
        step3: '3. Connect the device to the computer',
      },
    },
    keyboardUnInstalledHint: {
      message: 'ADB Keyboard is not installed',
      description: 'ADB Keyboard is a software used to automatically input text on the device',
      confirmFalse: 'Please manually install ADB Keyboard',
      confirmFalsehint: {
        step1: '1. Download and install ADB Keyboard from https://github.com/senzhk/ADBKeyBoard/blob/master/ADBKeyboard.apk',
        step2: '3. Find "Language and Input" in Settings',
        step3: '4. Find "ADB Keyboard" in "Language and Input"',
        step4: '5. Enable "ADB Keyboard"',
      },
      hint: {
        question: 'Do you want to automatically install ADB Keyboard?',
      },
    },
    installKeyboard: {
      start: 'Installing ADB Keyboard (manual confirmation may be required)...',
      success: 'ADB Keyboard installed successfully',
    },
  },
  model: {
    check: {
      empty: 'The model API did not return data correctly',
    },
  },
  cli: {
    language: 'Please select language',
    options: {
      baseUrl: 'Model API Base URL',
      model: 'Model Name',
      apikey: 'API Key',
      maxSteps: 'Maximum Reasoning Steps',
      deviceId: 'ADB Device ID',
    },
  },
  prompt: {
    interactiveMode: 'AutoGLM.js Interactive Mode',
    model: 'Please enter model name',
    baseURL: 'Please enter model API base URL',
    apiKey: 'Please enter model API key',
    maxSteps: 'Please enter maximum reasoning steps',
    done: 'Configuration completed',
    cancel: 'Configuration cancelled',
    checking: 'Checking system requirements',
    task: 'Please describe the task you want to perform',
    placeholder: 'Help me book a flight to Nantong for tomorrow',
  },
  config: {
    errors: {
      fileNotFound: 'Configuration file does not exist: ',
      invalidFormat: 'Configuration file must be in JSON format, current extension: ',
      jsonParseError: 'JSON parsing error: ',
      fileReadError: 'Unable to read configuration file: ',
      permissionDenied: 'No permission to read configuration file: ',
      genericReadError: 'Error occurred while reading configuration file: ',
      schemaNotFound: 'Cannot find schema file agent-config.schema.json',
      validationFailed: 'Configuration file format validation failed:\n',
      genericValidationError: 'Configuration file validation failed: ',
    },
  },
  think: 'Thinking',
  thinkDone: 'Thinking completed',
  action: 'Execute action',
  task_completed: 'Task completed',
}
