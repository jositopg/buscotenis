import { ScoredShoe, RunnerProfile } from '../types'

interface Props {
  results: ScoredShoe[]
  profile: RunnerProfile
  onReset: () => void
}

const cushioningLabel: Record<string, string> = {
  minimal: 'Mínima',
  light: 'Ligera',
  moderate: 'Moderada',
  maximum: 'Máxima',
}

const supportLabel: Record<string, string> = {
  neutral: 'Neutra',
  stability: 'Estabilidad',
  'motion-control': 'Control movimiento',
}

const terrainLabel: Record<string, string> = {
  road: 'Asfalto',
  trail: 'Trail',
  track: 'Pista',
  mixed: 'Mixto',
}

function ScoreBar({ score }: { score: number }) {
  // score goes roughly 0–80, normalize to 100
  const pct = Math.min(100, Math.round((score / 80) * 100))
  const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-500 w-8 text-right">{pct}%</span>
    </div>
  )
}

export default function Results({ results, profile, onReset }: Props) {
  const bmi = (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)

  if (results.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-5xl">😕</div>
        <h2 className="text-xl font-semibold text-gray-800">Sin resultados</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          No hemos encontrado zapatillas que encajen con tu perfil y presupuesto. Prueba a aumentar el presupuesto o cambiar algún filtro.
        </p>
        <button
          onClick={onReset}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
        >
          Volver al formulario
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumen del perfil */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
        <span><strong>Peso:</strong> {profile.weight} kg</span>
        <span><strong>Altura:</strong> {profile.height} cm</span>
        <span><strong>IMC:</strong> {bmi}</span>
        <span><strong>Terreno:</strong> {terrainLabel[profile.terrain]}</span>
        <span><strong>Pisada:</strong> {profile.footStrike}</span>
        <span><strong>Km/sem:</strong> {profile.weeklyKm}</span>
        <span><strong>Presupuesto:</strong> {profile.budget} €</span>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {results.length} zapatillas recomendadas
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
        >
          ← Editar perfil
        </button>
      </div>

      <div className="space-y-4">
        {results.map((shoe, index) => (
          <article
            key={shoe.id}
            className={`rounded-2xl border-2 overflow-hidden ${
              index === 0
                ? 'border-green-400 shadow-md'
                : 'border-gray-200'
            }`}
          >
            {index === 0 && (
              <div className="bg-green-500 text-white text-xs font-bold px-4 py-1 flex items-center gap-1">
                <span>⭐</span> Mejor opción para tu perfil
              </div>
            )}
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{shoe.brand}</p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{shoe.model}</h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-bold text-green-600">{shoe.price} €</div>
                  <div className="text-xs text-gray-400">precio aprox.</div>
                </div>
              </div>

              {/* Score bar */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Compatibilidad con tu perfil</p>
                <ScoreBar score={shoe.score} />
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">{shoe.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {cushioningLabel[shoe.cushioning]}
                </span>
                <span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {supportLabel[shoe.support]}
                </span>
                {shoe.terrain.map(t => (
                  <span key={t} className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {terrainLabel[t]}
                  </span>
                ))}
              </div>

              {/* Match reasons */}
              {shoe.matchReasons.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3 space-y-1">
                  {shoe.matchReasons.map((reason, i) => (
                    <p key={i} className="text-xs text-green-800 flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0">✓</span>
                      {reason}
                    </p>
                  ))}
                </div>
              )}

              {/* Pros */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {shoe.pros.map((pro, i) => (
                  <p key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                    <span className="text-gray-300 shrink-0 mt-0.5">•</span>
                    {pro}
                  </p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        onClick={onReset}
        className="w-full border border-gray-300 hover:border-gray-400 text-gray-600 font-medium py-2.5 px-5 rounded-xl transition-colors text-sm"
      >
        Hacer otra búsqueda
      </button>
    </div>
  )
}
