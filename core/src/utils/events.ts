import type { Emitter } from 'mitt'
import dayjs from 'dayjs'
import mitt from 'mitt'

// 定义事件数据的结构
export interface EventData {
  message: any
  time: string
}

// 定义事件类型
export const EventTypes = {
  THINKING: 'thinking',
  ACTION: 'action',
  TASK_COMPLETE: 'task_complete',
} as const

export type EventType = typeof EventTypes[keyof typeof EventTypes]

// 创建带类型的 emitter
export type MittEvents = Record<EventType, EventData>

export function createEmitter() {
  return mitt<MittEvents>()
}

export const emitter = createEmitter()

export function emit(event: EventType, data: any, target: Emitter<MittEvents> = emitter) {
  target.emit(event, {
    message: data,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
  })
}
