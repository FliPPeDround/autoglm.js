import { version } from './../../package.json'

export const helpMessage = `
AutoGLM.js CLI v${version}

Usage:
  $ autoglm [options] <message>

Options:
  --help, -h      Show this help message
  --baseUrl      Model API base URL
  --model         Model name
  --apiKey        API key for model authentication
  --max-steps     Maximum steps per task
`
