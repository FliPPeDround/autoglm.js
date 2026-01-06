<a href="https://github.com/FliPPeDround/autoglm.js"><img src="./banner.svg" alt="banner" width="100%"/></a>

<a href="https://github.com/FliPPeDround/autoglm.js"><img src="https://img.shields.io/github/stars/FliPPeDround/autoglm.js?colorA=6A00FF&colorB=eee&style=for-the-badge"></a>
<a href="https://www.npmjs.com/package/autoglm.js"><img src="https://img.shields.io/npm/dm/autoglm.js?colorA=6A00FF&colorB=eee&style=for-the-badge"></a>
<a href="https://www.npmjs.com/package/autoglm.js"><img src="https://img.shields.io/npm/v/autoglm.js?colorA=6A00FF&colorB=eee&style=for-the-badge"></a>
<br/>

<p align="center">
<a href="./README_CN.md">中文文档</a>
</p>

<h4 align="center"></h4>

# [Open-AutoGLM](https://github.com/zai-org/Open-AutoGLM) Implementation in JavaScript

**AutoGLM.js is a powerful AI agent framework that can automatically control Android devices through natural language instructions to perform various complex mobile operation tasks.**

![cli.png](./cli.png)

## [`->TODO List<-`](./TODO.md) Welcome to contribute and provide feedback!

## 🚀 Quick Start

```bash
npx @autoglm.js/cli
```

> The model can directly use the [`autoglm-phone`](https://www.bigmodel.cn/glm-coding?ic=PWCU0E7KAJ) model provided for free by GLM.

## ✨ Features

- 🎯 **Natural Language Control**: Control mobile operations through simple text commands
- 📱 **Android Automation**: Supports screenshot analysis, app operations, UI interactions, and more
- 🧠 **Intelligent Decision Making**: Intelligent task planning and execution based on large language models
- 🔧 **Flexible Configuration**: Supports multiple invocation methods and configuration options
- 🌍 **Multi-language Support**: Built-in Chinese and English support
- 📦 **Multiple Usage Methods**: Provides three usage methods: CLI, API, and desktop application

### Environment Requirements

- Node.js >= 20.0.0

## 📖 Usage

AutoGLM.js provides three usage methods: **CLI Command Line Tool**, **Core API Integration**, and **Desktop Application [🚧 Under Construction]**.

### Method 1: CLI Command Line Tool

#### 1. Global Installation

```bash
# Install from npm
npm install -g @autoglm.js/cli
```

#### 2. Create Configuration File

Create `~/.autoglm/config.json` file:

```json
{
  "$schema": "https://unpkg.com/autoglm.js@latest/schema/agent-config.schema.json",
  "maxSteps": 200,
  "lang": "cn",
  "baseUrl": "https://open.bigmodel.cn/api/paas/v4/",
  "apiKey": "your-api-key-here",
  "model": "autoglm-phone",
  "deviceId": "your-device-id"
}
```

#### 3. Run CLI

```bash
autoglm
```

#### 4. Interactive Usage

CLI will launch an interactive interface where you can input natural language commands:

```
💬 Please enter task: Open WeChat and send "Hello" to Zhang San
```

### Method 2: Core API Integration

#### 1. Install Core Library

```bash
npm install autoglm.js
```

#### 2. Basic Usage

```javascript
import { AutoGLM } from 'autoglm.js'

// Create agent instance
const agent = new AutoGLM({
  maxSteps: 200,
  lang: 'cn',
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: 'your-api-key-here',
  model: 'autoglm-phone',
  deviceId: 'your-device-id'
})

// Execute task
agent.run('Open WeChat and send "Hello" to Zhang San')
```

#### 3. Event Listening

```javascript
import { AutoGLM, EventType } from 'autoglm.js'

const agent = new AutoGLM({
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: 'your-api-key-here',
  model: 'autoglm-phone',
})

// Listen to all events
agent.on('*', (type, data) => {
  console.log(`[${type}]`, data)
})

// Listen to specific events
agent.on(EventType.Thinking, (data) => {
  console.log('Thinking:', data)
})

agent.on(EventType.TaskComplete, (result) => {
  console.log('Task completed:', result)
})

// Execute task
agent.run('Open Douyin')
```

### Method 3: Desktop Application [WIP]

The desktop application is under development and will provide a graphical interface to use all features of AutoGLM.js. Welcome to contribute and provide feedback.

## ⚙️ Configuration Options

### Basic Configuration

| Parameter           | Type   | Default | Description                       |
| ------------------- | ------ | ------- | --------------------------------- |
| `maxSteps`          | number | 100     | Maximum number of execution steps |
| `lang`              | string | 'cn'    | Language setting ('cn' or 'en')   |
| `deviceId`          | string | -       | Android device ID                 |
| `systemPrompt`      | string | -       | Custom system prompt              |
| `screenshotQuality` | number | 80      | Screenshot quality (1-100)        |

### Model Configuration

| Parameter          | Type   | Default                    | Description                 |
| ------------------ | ------ | -------------------------- | --------------------------- |
| `baseUrl`          | string | 'http://localhost:8000/v1' | API base URL                |
| `apiKey`           | string | -                          | API key                     |
| `model`            | string | 'autoglm-phone'            | Model name                  |
| `maxTokens`        | number | 3000                       | Maximum token count         |
| `temperature`      | number | 0.0                        | Temperature parameter       |
| `topP`             | number | 0.85                       | Top P parameter             |
| `frequencyPenalty` | number | 0.2                        | Frequency penalty parameter |

## 📄 License

This project is open source under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Open-AutoGLM](https://github.com/zai-org/Open-AutoGLM) - Original project inspiration

## 📞 Support

- 💬 [Submit Issue](https://github.com/flippedround/autoglm.js/issues)
- 📧 Email: flippedround@qq.com
- 💖 [Sponsor Project](https://afdian.com/a/flippedround)

## 🙇🏻‍♂️[Sponsors](https://afdian.com/a/flippedround)

<p align="center">
  <a href="https://afdian.com/a/flippedround">
    <img alt="sponsors" src="https://cdn.jsdelivr.net/gh/FliPPeDround/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>

---

<div align="center">
  <p>If this project helps you, please give it a ⭐️ to support!</p>
  <p><b>Made with ❤️ by <a href="https://github.com/flippedround">@FliPPeDround</a></b></p>
</div>
