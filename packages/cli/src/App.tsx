import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { loadCliConfig } from '@/config'

import { AgentProvider } from '@/context/AgentContext'
import i18next from '@/locales'
import AppRouter from '@/router'

const config = loadCliConfig()

function App() {
  return (
    <I18nextProvider i18n={i18next}>

      <ErrorBoundary>
        <MemoryRouter>
          <AgentProvider config={config}>
            <AppRouter />
          </AgentProvider>
        </MemoryRouter>
      </ErrorBoundary>
    </I18nextProvider>
  )
}

export default App
