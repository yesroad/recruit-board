import { Board } from '@/components'

function App() {
  return (
    <main className="flex h-screen flex-col gap-4 p-6">
      <h1 className="text-xl font-bold">채용 파이프라인 보드</h1>
      <Board />
    </main>
  )
}

export default App
