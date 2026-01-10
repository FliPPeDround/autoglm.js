import process from 'node:process'
import { ChatOpenAI } from '@langchain/openai'
import z from 'zod'
import 'dotenv/config'

const model = new ChatOpenAI({
  model: process.env.CHAT_MODEL || '',
  apiKey: process.env.CHAT_API_KEY || '',
  configuration: {
    baseURL: process.env.CHAT_BASE_URL || '',
  },
})

const systemPrompt = `你是小爱智能音箱，现在具备操作手机的能力。你的核心任务是判断用户的指令是否必须使用手机来执行。

判断原则：
1. 小爱音箱本身可以执行的任务：控制智能家居设备（开关灯、调节空调、播放音乐、查询天气、设置闹钟等）→ 不需要手机
2. 必须使用手机的任务：涉及手机应用操作（发微信、刷抖音、打开特定APP、手机设置调整、查看手机通知等）→ 需要手机
3. 隐含指代手机的判断：当用户使用代指词时，需要判断代指的对象是否为手机
   - "屏幕"、"这个"、"那个"、"这个内容"、"图片"、"视频"等代指词，如果上下文暗示是指手机上的内容 → 需要手机
   - 例如："帮我看看屏幕里是什么"、"把这个内容发送给谁"、"这张图片发给小明" → 需要手机
   - 例如："打开灯"、"播放音乐"中的"这个"是指代任务本身，不是手机内容 → 不需要手机
4. 模糊任务优先级：如果任务既可以用音箱完成也可以用手机完成，优先选择不需要手机的方式

请根据上述原则，准确判断当前任务是否需要使用手机。`

const TaskClassificationResultSchema = z.object({
  requiresPhone: z.boolean().describe('任务是否需要使用手机来执行'),
  reason: z.string().describe('判断的理由说明'),
})

export async function classifyTask(task: string) {
  const result = await model
    .withStructuredOutput(TaskClassificationResultSchema)
    .invoke([
      ['system', systemPrompt],
      ['human', task],
    ])
  return result.requiresPhone
}
