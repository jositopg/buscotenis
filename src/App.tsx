import { useState } from 'react'
import RunnerForm from './components/RunnerForm'
import Results from './components/Results'
import type { RunnerProfile, ScoredShoe } from './types'
import { getRecommendations } from './utils/recommend'

type View = 'form' | 'results'

export default function App() {
  const [view, setView] = useState<View>('form')
  const [results, setResults] = useState<ScoredShoe[]>([])
  const [profile, setProfile] = useState<RunnerProfile | null>(null)

  function handleSubmit(p: RunnerProfile) {
    setProfile(p)
    setResults(getRecommendations(p))
    setView('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleReset() {
    setView('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">👟</span>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">Running Shoes Advisor</h1>
            <p className="text-xs text-gray-400">Encuentra la zapatilla perfecta para ti</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {view === 'form' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tu perfil de corredor</h2>
              <p className="text-sm text-gray-500 mt-1">
                Rellena tus datos y te recomendaremos las mejores zapatillas de todas las marcas.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
              <RunnerForm onSubmit={handleSubmit} />
            </div>
          </>
        ) : (
          <Results
            results={results}
            profile={profile!}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-6 mt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400">
          Los precios son orientativos. Consulta disponibilidad en tiendas especializadas.
        </p>
      </footer>
    </div>
  )
}
