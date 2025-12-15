import process from 'node:process'
import { helpMessage } from '@/constants/helpMessage'

const actions = {
  help: () => {
    console.log(helpMessage)
    process.exit(0)
  },
}

export function commandAction(argv: any) {
  if (argv.help) {
    actions.help()
  }
}
