<a href="https://github.com/FliPPeDround/autoglm.js"><img src="./banner.svg" alt="banner" width="100%"/></a>

<a href="https://github.com/FliPPeDround/autoglm.js"><img src="https://img.shields.io/github/stars/FliPPeDround/autoglm.js?colorA=6A00FF&colorB=eee&style=for-the-badge"></a>
<a href="https://www.npmjs.com/package/autoglm.js"><img src="https://img.shields.io/npm/dm/autoglm.js?colorA=6A00FF&colorB=eee&style=for-the-badge"></a>
<a href="https://www.npmjs.com/package/autoglm.js"><img src="https://img.shields.io/npm/v/autoglm.js?colorA=6A00FF&colorB=eee&style=for-the-badge"></a>
<br/>

# 基于 JavaScript 实现的 [Open-AutoGLM](https://github.com/zai-org/Open-AutoGLM) - 智能 AI 代理框架

> AutoGLM.js 是一个强大的 AI 代理框架，能够通过自然语言指令自动控制 Android 设备，执行各种复杂的手机操作任务。

![cli.png](./cli.png)

## 快速使用

```bash
npx @autoglm.js/cli
```

## ✨ 特性

- 🎯 **自然语言控制**: 通过简单的文字指令控制手机操作
- 📱 **Android 自动化**: 支持截图分析、应用操作、UI 交互等
- 🧠 **智能决策**: 基于大语言模型的智能任务规划和执行
- 🔧 **灵活配置**: 支持多种调用方式和配置选项
- 🌍 **多语言支持**: 内置中英文支持
- 📦 **多种使用方式**: 提供 CLI、API 和桌面应用三种使用方式

## 🏗️ 架构概览

AutoGLM.js 采用 Monorepo 架构，使用 pnpm workspace 和 Turbo 进行包管理和构建：

```
autoglm.js/
├── packages/
│   ├── core/           # 核心库 (autoglm.js)
│   ├── cli/            # CLI 工具 (@autoglm.js/cli)
│   └── shared/         # 共享工具 (@autoglm.js/shared)
├── desktop/            # 桌面应用 (@autoglm/desktop)
└── playground/         # 示例代码
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 10.25.0
- Android 设备（需要开启 USB 调试）
- ADB (Android Debug Bridge) 工具

### 安装

```bash
# 克隆仓库
git clone https://github.com/flippedround/autoglm.js.git

# 安装依赖
cd autoglm.js
pnpm install
```

## 📖 使用方式

AutoGLM.js 提供三种使用方式：**CLI 命令行工具**、**核心 API 集成** 和 **桌面应用**。

### 方式一：CLI 命令行工具

#### 1. 全局安装

```bash
# 从 npm 安装
npm install -g autoglm.js

# 或使用 npx 快捷运行
npx autoglm.js
```

#### 2. 创建配置文件

创建 `config.json` 文件：

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

#### 3. 运行 CLI

```bash
# 使用配置文件
autoglm -c config.json

# 或者直接运行（会进入交互式配置）
autoglm
```

#### 4. 交互式使用

CLI 会启动交互式界面，你可以输入自然语言指令：

```
💬 请输入任务：打开微信并给张三发送"你好"
```

### 方式二：核心 API 集成

#### 1. 安装核心库

```bash
npm install autoglm.js
```

#### 2. 基础使用

```javascript
import { AutoGLM } from 'autoglm.js'

// 创建代理实例
const agent = new AutoGLM({
  maxSteps: 200,
  lang: 'cn',
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: 'your-api-key-here',
  model: 'autoglm-phone',
  deviceId: 'your-device-id'
})

// 执行任务
agent.run('打开微信并给张三发送"你好"')
```

#### 3. 事件监听

```javascript
const agent = new AutoGLM({
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: 'your-api-key-here',
  model: 'autoglm-phone',
})

// 监听所有事件
agent.on('*', (type, data) => {
  console.log(`[${type}]`, data)
})

// 监听特定事件
agent.on('action', (data) => {
  console.log('执行动作:', data)
})

agent.on('task_complete', (result) => {
  console.log('任务完成:', result)
})

// 执行任务
agent.run('打开抖音')
```

#### 4. ADB 管理

```javascript
const agent = new AutoGLM({
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: 'your-api-key-here',
  model: 'autoglm-phone',
})

// 获取 ADB 管理器
const adb = agent.adb

// 获取连接的设备列表
const devices = await adb.getConnectedDevices()
console.log('已连接设备:', devices)

// 连接设备
await adb.connect('192.168.1.100:5555')

// 启用 TCP/IP 模式
await adb.enableTCPIP(5555, 'device-id')

// 检查键盘是否已安装
const isInstalled = await adb.isKeyboardInstalled()

// 安装键盘
await adb.installKeyboard()
```

#### 5. 系统检查

```javascript
const agent = new AutoGLM({
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: 'your-api-key-here',
  model: 'autoglm-phone',
})

// 检查系统要求
const systemCheck = await agent.checkSystemRequirements()
console.log('系统检查结果:', systemCheck)

// 检查模型 API
const apiCheck = await agent.checkModelApi()
console.log('API 检查结果:', apiCheck)
```

### 方式三：桌面应用 [WIP]

桌面应用正在开发中，将提供图形化界面来使用 AutoGLM.js 的所有功能。

```bash
# 开发模式
pnpm dev:desktop

# 构建
pnpm build:desktop

# 运行
pnpm start
```

## ⚙️ 配置选项

### 基础配置

| 参数           | 类型   | 默认值 | 说明                    |
| -------------- | ------ | ------ | ----------------------- |
| `maxSteps`     | number | 100    | 最大执行步骤数          |
| `lang`         | string | 'cn'   | 语言设置 ('cn' 或 'en') |
| `deviceId`     | string | -      | Android 设备 ID         |
| `systemPrompt` | string | -      | 自定义系统提示词        |

### 模型配置

| 参数               | 类型   | 默认值                     | 说明          |
| ------------------ | ------ | -------------------------- | ------------- |
| `baseUrl`          | string | 'http://localhost:8000/v1' | API 基础地址  |
| `apiKey`           | string | -                          | API 密钥      |
| `model`            | string | 'autoglm-phone'            | 模型名称      |
| `maxTokens`        | number | 3000                       | 最大 token 数 |
| `temperature`      | number | 0.0                        | 温度参数      |
| `topP`             | number | 0.85                       | Top P 参数    |
| `frequencyPenalty` | number | 0.2                        | 频率惩罚参数  |

## 🔧 开发指南

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/flippedround/autoglm.js.git

# 安装依赖
pnpm install

# 开发模式（所有包）
pnpm dev

# 开发 CLI
pnpm dev:cli

# 开发核心库
pnpm dev:core

# 开发桌面应用
pnpm dev:desktop
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建 CLI
pnpm build:cli

# 构建核心库
pnpm build:core

# 构建桌面应用
pnpm build:desktop
```

### 测试

```bash
# 运行测试
pnpm test

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 修复代码
pnpm lint:fix
```

### 发布

```bash
# 发布核心库
pnpm release:core

# 发布 ADB 工具（Windows）
pnpm release:adb_w

# 发布 ADB 工具（Linux）
pnpm release:adb_l

# 发布 ADB 工具（macOS）
pnpm release:adb_d
```

## 📁 项目结构

```
autoglm.js/
├── packages/
│   ├── core/                 # 核心库
│   │   ├── src/
│   │   │   ├── actions/      # 动作处理
│   │   │   ├── adb/          # ADB 管理
│   │   │   ├── agent/        # 代理核心
│   │   │   ├── check/        # 系统检查
│   │   │   ├── constants/    # 常量定义
│   │   │   ├── context/      # 上下文管理
│   │   │   ├── model/        # 模型客户端
│   │   │   └── utils/        # 工具函数
│   │   └── package.json
│   ├── cli/                  # CLI 工具
│   │   ├── src/
│   │   │   ├── commands/     # 命令定义
│   │   │   ├── components/   # React 组件
│   │   │   ├── config/       # 配置管理
│   │   │   ├── context/      # 上下文
│   │   │   ├── hooks/        # 自定义 Hooks
│   │   │   ├── layouts/      # 布局
│   │   │   ├── locales/      # 国际化
│   │   │   ├── pages/        # 页面
│   │   │   ├── router/       # 路由
│   │   │   └── store/        # 状态管理
│   │   └── package.json
│   └── shared/               # 共享工具
│       └── src/
├── desktop/                 # 桌面应用
│   ├── src/
│   │   ├── main/            # Electron 主进程
│   │   ├── preload/         # 预加载脚本
│   │   └── renderer/        # 渲染进程（Vue）
│   └── package.json
├── playground/              # 示例代码
├── turbo.json              # Turbo 配置
├── pnpm-workspace.yaml     # pnpm workspace 配置
└── package.json            # 根 package.json
```

## 📋 示例任务

### 社交应用

- "打开微信，给张三发送'晚上一起吃饭吗'"
- "在微博上搜索'科技新闻'并点赞第一条"
- "打开QQ，查看未读消息"

### 日常操作

- "设置明天早上7点的闹钟"
- "打开相机拍照并保存"
- "查看今天的天气预报"

### 信息查询

- "在百度上搜索'Node.js最新版本'"
- "打开浏览器访问github.com"
- "查看手机存储空间"

## 🔍 调试与故障排除

### 常见问题

1. **设备连接失败**

   ```bash
   # 检查 ADB 连接
   adb devices

   # 确保 USB 调试已开启
   adb shell settings put global adb_enabled 1
   ```

2. **截图权限问题**

   ```bash
   # 授予截图权限
   adb shell pm grant com.android.systemui android.permission.READ_FRAME_BUFFER
   ```

3. **模型 API 错误**
   - 检查 API 密钥是否正确
   - 确认网络连接正常
   - 验证模型名称是否支持

### 调试模式

```javascript
// 监听所有事件
agent.on('*', (event, data) => {
  console.log(`[${event}]`, data)
})
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交规范

- 使用清晰的提交信息
- 添加适当的测试用例
- 更新相关文档
- 遵循代码风格规范

### 开发流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 计划

- [ ] 完善文档
- [ ] 参数更加完善
- [ ] 增加cli模式交互
- [ ] 支持鸿蒙系统
- [ ] 实现桌面应用

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Open-AutoGLM](https://github.com/zai-org/Open-AutoGLM) - 原始项目灵感

## 📞 支持

- 💬 [提交 Issue](https://github.com/flippedround/autoglm.js/issues)
- 📧 邮件: flippedround@qq.com
- 💖 [赞助项目](https://afdian.com/a/flippedround)

## 🙇🏻‍♂️[Sponsors](https://afdian.com/a/flippedround)

<p align="center">
  <a href="https://afdian.com/a/flippedround">
    <img alt="sponsors" src="https://cdn.jsdelivr.net/gh/FliPPeDround/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>

---

<div align="center">
  <p>如果这个项目对你有帮助，请给个 ⭐️ 支持一下！</p>
  <p><b>Made with ❤️ by <a href="https://github.com/flippedround">@FliPPeDround</a></b></p>
</div>
