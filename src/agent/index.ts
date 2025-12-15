import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import type { StepResult } from './types'
import type { AgentConfigType } from '@/config'
import consola from 'consola'
import { ActionHandler, finish } from '@/actions/handler'
import { parseAction } from '@/actions/parse'
import { getCurrentApp, getScreenshot } from '@/adb'
import { getAgentConfig } from '@/config'
import { getMessages } from '@/constants'
import { MessageBuilder, ModelClient } from '@/model/client'

export class PhoneAgent {
  private agentConfig: AgentConfigType
  private modelClient: ModelClient
  private actionHandler: ActionHandler
  private context: ChatCompletionMessageParam[] = []
  private stepCount: number = 0

  constructor(
    confirmationCallback?: (message: string) => Promise<boolean>,
    takeoverCallback?: (message: string) => Promise<void>,
  ) {
    this.agentConfig = getAgentConfig()
    this.modelClient = new ModelClient()
    this.actionHandler = new ActionHandler(
      this.agentConfig.deviceId,
      {
        confirmationCallback,
        takeoverCallback,
      },
    )
  }

  /**
   * Run the agent to complete a task.
   */
  async run(task: string): Promise<string> {
    // Reset state
    this.context = []
    this.stepCount = 0

    // First step with user prompt
    let result = await this._executeStep(task, true)

    if (result.finished) {
      return result.message || 'Task completed'
    }

    // Continue until finished or max steps reached
    while (this.stepCount < this.agentConfig.maxSteps) {
      result = await this._executeStep(undefined, false)

      if (result.finished) {
        return result.message || 'Task completed'
      }
    }

    return 'Max steps reached'
  }

  /**
   * Execute a single step of the agent.
   * Useful for manual control or debugging.
   */
  async step(task?: string): Promise<StepResult> {
    const isFirst = this.context.length === 0

    if (isFirst && !task) {
      throw new Error('Task is required for the first step')
    }

    return this._executeStep(task, isFirst)
  }

  /**
   * Reset the agent state for a new task.
   */
  reset(): void {
    this.context = []
    this.stepCount = 0
  }

  /**
   * Get the current conversation context.
   */
  getContext(): ChatCompletionMessageParam[] {
    return [...this.context]
  }

  /**
   * Get the current step count.
   */
  getStepCount(): number {
    return this.stepCount
  }

  /**
   * Execute a single step of the agent loop.
   */
  private async _executeStep(task?: string, isFirst: boolean = false): Promise<StepResult> {
    this.stepCount++

    // Capture current screen state
    const screenshot = await getScreenshot(this.agentConfig.deviceId)
    const currentApp = await getCurrentApp(this.agentConfig.deviceId)

    // Build messages
    if (isFirst) {
      // Add system message
      this.context.push(MessageBuilder.createSystemMessage(this.agentConfig.systemPrompt!))

      // Add user message with task and screen info
      const screenInfo = MessageBuilder.buildScreenInfo(currentApp)
      const textContent = `${task!}\n\n${screenInfo}`

      this.context.push(
        MessageBuilder.createUserMessage(textContent, screenshot.base64Data),
      )
    }
    else {
      // Add screen update message
      const screenInfo = MessageBuilder.buildScreenInfo(currentApp)
      const textContent = `** Screen Info **\n\n${screenInfo}`

      this.context.push(
        MessageBuilder.createUserMessage(textContent, screenshot.base64Data),
      )
    }

    // Get model response
    try {
      const msgs = getMessages(this.agentConfig.lang)
      consola.log(`\n${'='.repeat(50)}`)
      consola.log(`💭 ${msgs.thinking}:`)
      consola.log('-'.repeat(50))

      const response = await this.modelClient.request(this.context)

      // Parse action from response
      let action
      try {
        // Import dynamically to avoid circular dependency
        action = parseAction(response.action)
      }
      catch {
        // If parsing fails, use finish action
        action = finish(response.action)
      }

      if (this.agentConfig.verbose) {
        consola.log('-'.repeat(50))
        consola.log(`🎯 ${msgs.action}:`)
        consola.log(JSON.stringify(action, null, 2))
        consola.log(`${'='.repeat(50)}\n`)
      }

      // Remove image from context to save space
      this.context[this.context.length - 1] = MessageBuilder.removeImagesFromMessage(
        this.context[this.context.length - 1],
      )

      // Execute action
      const result = await this.actionHandler.execute(
        action,
        screenshot.width,
        screenshot.height,
      )

      // Add assistant response to context
      this.context.push(
        MessageBuilder.createAssistantMessage(
          `<think>${response.thinking}</think><answer>${response.action}</answer>`,
        ),
      )

      // Check if finished
      const finished = action._metadata === 'finish' || result.should_finish

      if (finished && this.agentConfig.verbose) {
        const msgs = getMessages(this.agentConfig.lang)
        consola.log(`\n` + `🎉 ${'='.repeat(48)}`)
        // Check if action is FinishAction before accessing message
        const actionMessage = action._metadata === 'finish' ? (action as any).message : undefined
        consola.log(
          `✅ ${msgs.task_completed}: ${result.message || actionMessage || msgs.done}`,
        )
        consola.log(`${'='.repeat(50)}\n`)
      }

      // Check if action is FinishAction before accessing message
      const actionMessage = action._metadata === 'finish' ? (action as any).message : undefined
      return {
        success: result.success,
        finished,
        action,
        thinking: response.thinking,
        message: result.message || actionMessage,
      }
    }
    catch (error) {
      if (this.agentConfig.verbose) {
        console.error(error)
      }
      return {
        success: false,
        finished: true,
        action: null,
        thinking: '',
        message: `Model error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }
}
