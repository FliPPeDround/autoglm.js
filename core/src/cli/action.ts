import process from 'node:process'
import { helpMessage } from '@/cli/helpMessage'
import { loadConfigFile } from './config/loader'

const actions = {
  help: () => {
    console.log(helpMessage)
    process.exit(0)
  },
  config: (configPath: string) => {
    return loadConfigFile(configPath)
  },
}

export function commandAction(argv: any) {
  if (argv.help) {
    actions.help()
  }

  if (argv.config) {
    return actions.config(argv.config)
  }
}
