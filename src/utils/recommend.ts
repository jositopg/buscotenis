import type { RunnerProfile, ScoredShoe } from '../types'
import { shoes } from '../data/shoes'

function getBMI(weight: number, height: number): number {
  const heightM = height / 100
  return weight / (heightM * heightM)
}

function getCushioningNeeded(profile: RunnerProfile): ('minimal' | 'light' | 'moderate' | 'maximum')[] {
  const bmi = getBMI(profile.weight, profile.height)
  const heelStriker = profile.footStrike === 'heel'
  const highVolume = profile.weeklyKm > 60

  if (bmi > 30 || (heelStriker && bmi > 25)) return ['maximum', 'moderate']
  if (bmi > 25 || heelStriker) return ['maximum', 'moderate', 'light']
  if (highVolume && profile.footStrike === 'forefoot') return ['minimal', 'light', 'moderate']
  if (profile.footStrike === 'forefoot') return ['minimal', 'light', 'moderate']
  return ['moderate', 'light', 'maximum']
}

export function getRecommendations(profile: RunnerProfile): ScoredShoe[] {
  const bmi = getBMI(profile.weight, profile.height)
  const cushioningNeeded = getCushioningNeeded(profile)

  const hasBrandPreference = profile.preferredBrands.length > 0

  const scored: ScoredShoe[] = shoes
    .filter(shoe => {
      // Hard filters: terrain must match
      if (!shoe.terrain.includes(profile.terrain)) return false
      // Hard filter: pronation must match
      if (!shoe.pronation.includes(profile.pronation)) return false
      // Hard filter: weight limit
      if (profile.weight > shoe.weightLimit) return false
      // Hard filter: budget
      if (shoe.price > profile.budget) return false
      // Soft filter: if brand preference set, exclude other brands
      if (hasBrandPreference && !profile.preferredBrands.includes(shoe.brand)) return false
      return true
    })
    .map(shoe => {
      let score = 0
      const matchReasons: string[] = []

      // ── Brand preference bonus (0-10) ───────────────────────────────────
      if (hasBrandPreference && profile.preferredBrands.includes(shoe.brand)) {
        score += 10
        matchReasons.push(`Marca preferida: ${shoe.brand}`)
      }

      // ── Foot strike match (0-15) ─────────────────────────────────────────
      if (shoe.footStrike.includes(profile.footStrike)) {
        score += 15
        const labels: Record<string, string> = {
          heel: 'talón',
          midfoot: 'mediopié',
          forefoot: 'punta',
        }
        matchReasons.push(`Diseñada para pisada de ${labels[profile.footStrike]}`)
      }

      // ── Level match (0-10) ───────────────────────────────────────────────
      if (shoe.level.includes(profile.level)) {
        score += 10
        const labels: Record<string, string> = {
          beginner: 'principiantes',
          intermediate: 'corredores intermedios',
          advanced: 'corredores avanzados',
        }
        matchReasons.push(`Recomendada para ${labels[profile.level]}`)
      }

      // ── Goal match (0-20) ────────────────────────────────────────────────
      if (shoe.goals.includes(profile.goal)) {
        score += 20
        const labels: Record<string, string> = {
          speed: 'velocidad y ritmos rápidos',
          endurance: 'fondo y largas distancias',
          ultra: 'ultramaratón',
          daily: 'entrenamiento diario',
          competition: 'competición',
        }
        matchReasons.push(`Óptima para ${labels[profile.goal]}`)
      }

      // ── Cushioning suitability (0-15) ────────────────────────────────────
      const cushIndex = cushioningNeeded.indexOf(shoe.cushioning)
      if (cushIndex === 0) {
        score += 15
        if (bmi > 28) matchReasons.push('Amortiguación adecuada para tu peso corporal')
        else if (profile.footStrike === 'heel') matchReasons.push('Amortiguación óptima para pisada de talón')
        else matchReasons.push('Nivel de amortiguación ideal para tu perfil')
      } else if (cushIndex === 1) {
        score += 8
      } else if (cushIndex === 2) {
        score += 3
      }

      // ── Weekly km match (0-10) ───────────────────────────────────────────
      if (profile.weeklyKm >= shoe.weeklyKmMin) {
        score += 10
        if (shoe.weeklyKmMin >= 40) matchReasons.push('Pensada para corredores de alto volumen de entrenamiento')
      }

      // ── BMI bonus for high-cushion shoes ────────────────────────────────
      if (bmi > 27 && (shoe.cushioning === 'maximum' || shoe.cushioning === 'moderate')) {
        score += 5
        if (bmi > 30) matchReasons.push('Amortiguación extra recomendada para proteger tus articulaciones')
      }

      // ── Budget fit bonus (closer to budget = better) ─────────────────────
      const budgetRatio = shoe.price / profile.budget
      if (budgetRatio <= 0.6) score += 3
      else if (budgetRatio <= 0.8) score += 6
      else score += 10  // close to budget = full use of investment

      return { ...shoe, score, matchReasons }
    })

  // Sort by score desc, then by price asc as tiebreaker
  scored.sort((a, b) => b.score - a.score || a.price - b.price)

  return scored.slice(0, 5)
}
