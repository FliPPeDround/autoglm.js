# [WIP]AutoGLM

由js实现的[Open-AutoGLM](https://github.com/zai-org/Open-AutoGLM)

```shell
pnpm i
pnpm dev

node dist/cli.mjs -c config.json
```

### 配置文件[config.json]
```json [config.json]
{
  "maxSteps": 200,
  "lang": "cn",
  "baseUrl": "https://open.bigmodel.cn/api/paas/v4/",
  "apiKey": "xxxxxxxxxxxxxxx",
  "model": "autoglm-phone"
}
```
