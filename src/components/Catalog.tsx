import { useState, useMemo } from 'react'
import { shoes } from '../data/shoes'
import type { Terrain, Pronation, Cushioning, Support, Level, Goal } from '../types'

const ALL_BRANDS = [...new Set(shoes.map(s => s.brand))].sort()

interface Filters {
  search: string
  brands: string[]
  terrain: Terrain | ''
  pronation: Pronation | ''
  cushioning: Cushioning | ''
  support: Support | ''
  level: Level | ''
  goal: Goal | ''
  maxPrice: number
}

const defaultFilters: Filters = {
  search: '',
  brands: [],
  terrain: '',
  pronation: '',
  cushioning: '',
  support: '',
  level: '',
  goal: '',
  maxPrice: 280,
}

const cushioningLabel: Record<string, string> = {
  minimal: 'Mínima', light: 'Ligera', moderate: 'Moderada', maximum: 'Máxima',
}
const supportLabel: Record<string, string> = {
  neutral: 'Neutra', stability: 'Estabilidad', 'motion-control': 'Control movimiento',
}
const terrainLabel: Record<string, string> = {
  road: 'Asfalto', trail: 'Trail', track: 'Pista', mixed: 'Mixto',
}
const pronationLabel: Record<string, string> = {
  neutral: 'Neutra', overpronation: 'Pronador', supination: 'Supinador',
}
const levelLabel: Record<string, string> = {
  beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado',
}
const goalLabel: Record<string, string> = {
  speed: 'Velocidad', endurance: 'Fondo', ultra: 'Ultra', daily: 'Diario', competition: 'Competición',
}

function activeCount(f: Filters): number {
  return [
    f.brands.length > 0,
    f.terrain !== '',
    f.pronation !== '',
    f.cushioning !== '',
    f.support !== '',
    f.level !== '',
    f.goal !== '',
    f.maxPrice < 280,
  ].filter(Boolean).length
}

export default function Catalog() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [showFilters, setShowFilters] = useState(false)

  function setF<K extends keyof Filters>(key: K, val: Filters[K]) {
    setFilters(prev => ({ ...prev, [key]: val }))
  }

  function toggleBrand(brand: string) {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }))
  }

  function toggleFilter<T extends string>(key: keyof Filters, val: T) {
    setFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }))
  }

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase()
    return shoes.filter(shoe => {
      if (q && !`${shoe.brand} ${shoe.model}`.toLowerCase().includes(q)) return false
      if (filters.brands.length > 0 && !filters.brands.includes(shoe.brand)) return false
      if (filters.terrain && !shoe.terrain.includes(filters.terrain)) return false
      if (filters.pronation && !shoe.pronation.includes(filters.pronation)) return false
      if (filters.cushioning && shoe.cushioning !== filters.cushioning) return false
      if (filters.support && shoe.support !== filters.support) return false
      if (filters.level && !shoe.level.includes(filters.level)) return false
      if (filters.goal && !shoe.goals.includes(filters.goal)) return false
      if (shoe.price > filters.maxPrice) return false
      return true
    })
  }, [filters])

  const active = activeCount(filters)

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Buscar marca o modelo..."
            value={filters.search}
            onChange={e => setF('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            showFilters || active > 0
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-300 text-gray-600 hover:border-gray-400'
          }`}
        >
          <span>Filtros</span>
          {active > 0 && (
            <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {active}
            </span>
          )}
        </button>
        {active > 0 && (
          <button
            onClick={() => setFilters(defaultFilters)}
            className="px-3 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            title="Limpiar filtros"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-5">

          {/* Marcas */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Marca</p>
            <div className="flex flex-wrap gap-2">
              {ALL_BRANDS.map(brand => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                    filters.brands.includes(brand)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Terreno + Pronación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Terreno</p>
              <div className="flex flex-wrap gap-2">
                {(['road', 'trail', 'track', 'mixed'] as Terrain[]).map(v => (
                  <button key={v} onClick={() => toggleFilter('terrain', v)}
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                      filters.terrain === v ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>{terrainLabel[v]}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pronación</p>
              <div className="flex flex-wrap gap-2">
                {(['neutral', 'overpronation', 'supination'] as Pronation[]).map(v => (
                  <button key={v} onClick={() => toggleFilter('pronation', v)}
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                      filters.pronation === v ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>{pronationLabel[v]}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Amortiguación + Soporte */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Amortiguación</p>
              <div className="flex flex-wrap gap-2">
                {(['minimal', 'light', 'moderate', 'maximum'] as Cushioning[]).map(v => (
                  <button key={v} onClick={() => toggleFilter('cushioning', v)}
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                      filters.cushioning === v ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>{cushioningLabel[v]}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Soporte</p>
              <div className="flex flex-wrap gap-2">
                {(['neutral', 'stability', 'motion-control'] as Support[]).map(v => (
                  <button key={v} onClick={() => toggleFilter('support', v)}
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                      filters.support === v ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>{supportLabel[v]}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Nivel + Objetivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nivel</p>
              <div className="flex flex-wrap gap-2">
                {(['beginner', 'intermediate', 'advanced'] as Level[]).map(v => (
                  <button key={v} onClick={() => toggleFilter('level', v)}
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                      filters.level === v ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>{levelLabel[v]}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Objetivo</p>
              <div className="flex flex-wrap gap-2">
                {(['daily', 'endurance', 'speed', 'competition', 'ultra'] as Goal[]).map(v => (
                  <button key={v} onClick={() => toggleFilter('goal', v)}
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                      filters.goal === v ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>{goalLabel[v]}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Precio */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Precio máximo: <span className="text-green-600 font-bold">{filters.maxPrice} €</span>
            </p>
            <input
              type="range" min={80} max={280} step={10}
              value={filters.maxPrice}
              onChange={e => setF('maxPrice', Number(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>80 €</span><span>280 €</span>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-800">{filtered.length}</span> zapatilla{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
        {active > 0 && <span className="text-gray-400"> · {active} filtro{active !== 1 ? 's' : ''} activo{active !== 1 ? 's' : ''}</span>}
      </p>

      {/* Shoe grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <div className="text-4xl">🔍</div>
          <p className="text-gray-500 text-sm">Ninguna zapatilla cumple los filtros aplicados.</p>
          <button onClick={() => setFilters(defaultFilters)} className="text-green-600 text-sm font-medium hover:underline">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(shoe => (
            <article key={shoe.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{shoe.brand}</p>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">{shoe.model}</h3>
                </div>
                <span className="text-lg font-bold text-green-600 shrink-0">{shoe.price} €</span>
              </div>

              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{shoe.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {shoe.terrain.map(t => (
                  <span key={t} className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full">{terrainLabel[t]}</span>
                ))}
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{cushioningLabel[shoe.cushioning]}</span>
                <span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full">{supportLabel[shoe.support]}</span>
                {shoe.pronation.map(p => (
                  <span key={p} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{pronationLabel[p]}</span>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-x-3 gap-y-1">
                {shoe.pros.slice(0, 2).map((pro, i) => (
                  <p key={i} className="text-xs text-gray-400 flex items-start gap-1">
                    <span className="shrink-0 mt-0.5">•</span>{pro}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
