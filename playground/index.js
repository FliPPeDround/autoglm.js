import { AutoGLM, EventType } from 'autoglm.js'

async function main() {
  const agent = new AutoGLM({
    maxSteps: 100,
    lang: 'cn',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
    apiKey: '',
    model: 'autoglm-phone',
  })

  agent.on(EventType.ACTION, (_data) => {
    // console.log(data)
  })
  agent.run(`
    打开微信，给文件传输助手发一条旅行攻略：
# 滑雪场旅行攻略

## 滑雪场门票
- 滑雪场门票：约10元（摆渡车）
- 雪具租赁：雪服80元/人，护目镜30元/人，护具80元/人

**避雷建议：**
1. 景区内很多摆渡车都收费，需要注意
2. 雪景可能因为下雪而斑驳，需要找合适的拍照地点
3. 滑雪时间从拿雪具开始算，不是从进雪场开始
4. 景区天气变化较大，游客需要做好防雷准备
`)
}

main()
