import { Box } from 'ink'
import { EventList } from '@/components/EventLog'
import TaskStatus from '@/components/TaskStatus'
import { useAgentContext } from '@/context/AgentContext'

export default function TaskList() {
  const { isRunning, currentTask, currentDeviceId } = useAgentContext()

  return (
    <Box flexDirection="column">
      <TaskStatus isRunning={isRunning} currentTask={currentTask} currentDeviceId={currentDeviceId} />
      <EventList />
    </Box>
  )
}
