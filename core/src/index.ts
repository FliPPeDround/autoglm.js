import type { AgentConfigType } from './config'
import type { AgentContext } from './context'
import { PhoneAgent } from './agent'
import { checkModelApi, checkSystemRequirements } from './check'
import { createAgentContext } from './context'

export class AutoGLM {
  private ctx: AgentContext
  private phoneAgent: PhoneAgent

  private constructor(ctx: AgentContext) {
    this.ctx = ctx
    this.phoneAgent = new PhoneAgent(ctx)
  }

  public static async createAgent(config: AgentConfigType): Promise<AutoGLM> {
    const ctx = createAgentContext({
      ...config,
      mode: 'api',
    })
    const instance = new AutoGLM(ctx)
    await checkSystemRequirements(ctx.configStore, ctx.t)
    await checkModelApi(ctx.configStore, ctx.t)

    return instance
  }

  public run(task: string) {
    this.phoneAgent.run(task)
    return this.ctx.emitter
  }

  public checkModelApi() {
    return checkModelApi(this.ctx.configStore, this.ctx.t)
  }

  public checkSystemRequirements() {
    return checkSystemRequirements(this.ctx.configStore, this.ctx.t)
  }
}
