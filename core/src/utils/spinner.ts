import { spinner } from '@clack/prompts'

export type SpinnerInstance = ReturnType<typeof spinner>

export function createSpinner() {
  return spinner()
}

const defaultSpinner = createSpinner()

export default defaultSpinner
