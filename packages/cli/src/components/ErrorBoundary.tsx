import type { ReactNode } from 'react'
import { Box, Text } from 'ink'
import { Component } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    console.error('Error caught by boundary:', error)
    console.error('Component stack:', errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return <>{this.props.fallback(this.state.error)}</>
      }

      return (
        <Box flexDirection="column" padding={2}>
          <Box marginBottom={1}>
            <Text color="red" bold>
              Application Error
            </Text>
          </Box>
          <Box marginBottom={1}>
            <Text color="white">
              {this.state.error.message}
            </Text>
          </Box>
          <Box>
            <Text color="gray" dimColor>
              Press /exit to quit and try again
            </Text>
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}

export function createErrorHandler(setHasError: (hasError: boolean) => void) {
  return (error: Error) => {
    console.error('Unhandled error:', error)
    setHasError(true)
  }
}
