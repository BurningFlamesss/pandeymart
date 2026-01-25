import { createFileRoute } from '@tanstack/react-router'
import Landing from '@/components/landing/Landing'

export const Route = createFileRoute('/')({ component: App })

function App() {


  return (
    <Landing>
      Hello
    </Landing>
  )
}
