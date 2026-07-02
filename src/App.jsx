import { useState, useEffect } from 'react'
import PracticeCoach from './PracticeCoach'
import TasterFunnel from './TasterFunnel'

export default function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  // /try = free taster funnel
  // everything else = full practice coach
  if (path === '/try' || path === '/try/') {
    return <TasterFunnel />
  }

  return <PracticeCoach />
}
