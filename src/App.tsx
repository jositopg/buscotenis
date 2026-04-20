import { useState } from 'react'
import RunnerForm from './components/RunnerForm'
import Results from './components/Results'
import Catalog from './components/Catalog'
import type { RunnerProfile, ScoredShoe } from './types'
import { getRecommendations } from './utils/recommend'

type Tab = 'advisor' | 'catalog'
type AdvisorView = 'form' | 'results'

export default function App() {
  const [tab, setTab] = useState<Tab>('advisor')
  const [advisorView, setAdvisorView] = useState<AdvisorView>('form')
  const [results, setResults] = useState<ScoredShoe[]>([])
  const [profile, setProfile] = useState<RunnerProfile | null>(null)

  function handleSubmit(p: RunnerProfile) {
    setProfile(p)
    setResults(getRecommendations(p))
    setAdvisorView('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleReset() {
    setAdvisorView('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function switchTab(t: Tab) {
    setTab(t)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <button onClick={() => switchTab('advisor')} className="flex items-center gap-2">
              <span className="text-2xl">👟</span>
              <span className="text-xl font-black tracking-tight text-gray-900">
                Busco<span className="text-green-600">tenis</span>
              </span>
            </button>
            <p className="text-xs text-gray-400 hidden sm:block">Encuentra la zapatilla perfecta para ti</p>
          </div>
          {/* Nav tabs */}
          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => switchTab('advisor')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === 'advisor'
                  ? 'border-green-500 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ✨ Recomendador
            </button>
            <button
              onClick={() => switchTab('catalog')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === 'catalog'
                  ? 'border-green-500 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Catálogo
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {tab === 'advisor' ? (
          advisorView === 'form' ? (
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
            <Results results={results} profile={profile!} onReset={handleReset} />
          )
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Catálogo de zapatillas</h2>
              <p className="text-sm text-gray-500 mt-1">
                {42} zapatillas de 15 marcas. Filtra por las características que más te importan.
              </p>
            </div>
            <Catalog />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 py-6 mt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400">
          Los precios son orientativos. Consulta disponibilidad en tiendas especializadas.
        </p>
      </footer>
    </div>
  )
}
