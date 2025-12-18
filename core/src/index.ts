import type { AgentConfigType } from './config'
import { PhoneAgent } from './agent'
import { checkModelApi, checkSystemRequirements } from './check'
import { setAgentConfig } from './config'
import { emitter } from './utils/events'

export class AutoGLM {
  private phoneAgent: PhoneAgent

  private constructor(config?: AgentConfigType) {
    config && setAgentConfig({
      ...config,
      mode: 'api',
    })
    this.phoneAgent = new PhoneAgent()
  }

  public static async createAgent(config: AgentConfigType): Promise<AutoGLM> {
    setAgentConfig({
      ...config,
      mode: 'api',
    })
    const instance = new AutoGLM()
    await checkSystemRequirements()
    await checkModelApi()

    return instance
  }

  public run(task: string) {
    this.phoneAgent.run(task)
    return emitter
  }

  public checkModelApi() {
    return checkModelApi()
  }

  public checkSystemRequirements() {
    return checkSystemRequirements()
  }
}
