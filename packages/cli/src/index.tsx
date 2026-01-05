#!/usr/bin/env node

import process from 'node:process'
import { render } from 'ink'
import minimist from 'minimist'
import App from './App'
import VersionPage from './pages/Version'

const argv = minimist(process.argv.slice(2), {
  alias: {
    version: ['v', 'V'],
  },
})

const { version } = argv

if (version) {
  render(
    <VersionPage onExit={() => process.exit(0)} />,
  )
}
else {
  render(<App />)
}
