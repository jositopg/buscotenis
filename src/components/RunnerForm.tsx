import { useState } from 'react'
import type { RunnerProfile, Terrain, Pronation, FootStrike, Level, Goal } from '../types'

interface Props {
  onSubmit: (profile: RunnerProfile) => void
}

const ALL_BRANDS = [
  'Nike', 'Adidas', 'Brooks', 'ASICS', 'Saucony',
  'New Balance', 'Hoka', 'On', 'Mizuno', 'Salomon',
  'Altra', 'Puma', 'Under Armour', 'Scott', 'La Sportiva',
]

const defaultProfile: RunnerProfile = {
  weight: 70,
  height: 175,
  terrain: 'road',
  pronation: 'neutral',
  footStrike: 'heel',
  level: 'beginner',
  goal: 'daily',
  weeklyKm: 20,
  budget: 150,
  preferredBrands: [],
}

export default function RunnerForm({ onSubmit }: Props) {
  const [form, setForm] = useState<RunnerProfile>(defaultProfile)

  function set<K extends keyof RunnerProfile>(key: K, value: RunnerProfile[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const bmi = form.weight / Math.pow(form.height / 100, 2)
  const bmiLabel =
    bmi < 18.5 ? 'Bajo peso'
    : bmi < 25 ? 'Peso normal'
    : bmi < 30 ? 'Sobrepeso'
    : 'Obesidad'
  const bmiColor =
    bmi < 18.5 ? 'text-blue-600'
    : bmi < 25 ? 'text-green-600'
    : bmi < 30 ? 'text-yellow-600'
    : 'text-red-600'

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit(form) }}
      className="space-y-8"
    >
      {/* ── Datos físicos ── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-sm flex items-center justify-center font-bold">1</span>
          Datos físicos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
            <input
              type="number" min={40} max={200}
              value={form.weight}
              onChange={e => set('weight', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
            <input
              type="number" min={140} max={220}
              value={form.height}
              onChange={e => set('height', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          IMC: <span className={`font-semibold ${bmiColor}`}>{bmi.toFixed(1)} — {bmiLabel}</span>
        </p>
      </section>

      {/* ── Tipo de terreno ── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-sm flex items-center justify-center font-bold">2</span>
          Tipo de terreno
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { value: 'road', label: 'Asfalto', icon: '🏙️', desc: 'Ciudad y carretera' },
            { value: 'trail', label: 'Trail', icon: '⛰️', desc: 'Montaña y tierra' },
            { value: 'track', label: 'Pista', icon: '🏟️', desc: 'Pista de atletismo' },
            { value: 'mixed', label: 'Mixto', icon: '🌿', desc: 'Asfalto y caminos' },
          ] as { value: Terrain; label: string; icon: string; desc: string }[]).map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('terrain', opt.value)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                form.terrain === opt.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{opt.icon}</div>
              <div className="text-sm font-semibold text-gray-800">{opt.label}</div>
              <div className="text-xs text-gray-500">{opt.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Biomecánica ── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-sm flex items-center justify-center font-bold">3</span>
          Biomecánica
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de pisada</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'heel', label: 'Talón', icon: '🦶', desc: 'Apoya el talón primero' },
                { value: 'midfoot', label: 'Mediopié', icon: '👟', desc: 'Apoya el centro del pie' },
                { value: 'forefoot', label: 'Punta', icon: '💨', desc: 'Apoya la punta primero' },
              ] as { value: FootStrike; label: string; icon: string; desc: string }[]).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('footStrike', opt.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.footStrike === opt.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <div className="text-sm font-semibold text-gray-800">{opt.label}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pronación</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'neutral', label: 'Neutra', icon: '✅', desc: 'El pie no rota en exceso' },
                { value: 'overpronation', label: 'Pronador', icon: '↩️', desc: 'El pie rota hacia dentro' },
                { value: 'supination', label: 'Supinador', icon: '↪️', desc: 'El pie rota hacia fuera' },
              ] as { value: Pronation; label: string; icon: string; desc: string }[]).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('pronation', opt.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.pronation === opt.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <div className="text-sm font-semibold text-gray-800">{opt.label}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Nivel y objetivo ── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-sm flex items-center justify-center font-bold">4</span>
          Nivel y objetivo
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel como corredor</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'beginner', label: 'Principiante', icon: '🌱', desc: 'Menos de 1 año corriendo' },
                { value: 'intermediate', label: 'Intermedio', icon: '🏃', desc: '1-5 años corriendo' },
                { value: 'advanced', label: 'Avanzado', icon: '🏅', desc: 'Más de 5 años, competiciones' },
              ] as { value: Level; label: string; icon: string; desc: string }[]).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('level', opt.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.level === opt.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <div className="text-sm font-semibold text-gray-800">{opt.label}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo principal</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {([
                { value: 'daily', label: 'Entrenamiento diario', icon: '📅' },
                { value: 'endurance', label: 'Fondo / largas distancias', icon: '🛣️' },
                { value: 'speed', label: 'Velocidad', icon: '⚡' },
                { value: 'competition', label: 'Competición', icon: '🏆' },
                { value: 'ultra', label: 'Ultra / montaña', icon: '🌄' },
              ] as { value: Goal; label: string; icon: string }[]).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('goal', opt.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    form.goal === opt.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <div className="text-xs font-semibold text-gray-800">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Preferencia de marca ── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-sm flex items-center justify-center font-bold">5</span>
          Preferencia de marca
        </h2>
        <p className="text-xs text-gray-400 mb-3 ml-9">Opcional — selecciona una o varias. Si no seleccionas ninguna se muestran todas.</p>
        <div className="flex flex-wrap gap-2">
          {ALL_BRANDS.map(brand => {
            const selected = form.preferredBrands.includes(brand)
            return (
              <button
                key={brand}
                type="button"
                onClick={() => {
                  const next = selected
                    ? form.preferredBrands.filter(b => b !== brand)
                    : [...form.preferredBrands, brand]
                  set('preferredBrands', next)
                }}
                className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  selected
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {selected && <span className="mr-1">✓</span>}{brand}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Volumen y presupuesto ── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-sm flex items-center justify-center font-bold">6</span>
          Volumen y presupuesto
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kilómetros semanales: <span className="text-green-600 font-bold">{form.weeklyKm} km</span>
            </label>
            <input
              type="range" min={0} max={150} step={5}
              value={form.weeklyKm}
              onChange={e => set('weeklyKm', Number(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 km</span><span>150 km</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presupuesto máximo: <span className="text-green-600 font-bold">{form.budget} €</span>
            </label>
            <input
              type="range" min={80} max={280} step={10}
              value={form.budget}
              onChange={e => set('budget', Number(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>80 €</span><span>280 €</span>
            </div>
          </div>
        </div>
      </section>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-base shadow-sm"
      >
        Ver mis recomendaciones
      </button>
    </form>
  )
}
