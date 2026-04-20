export type Terrain = 'road' | 'trail' | 'track' | 'mixed'
export type Pronation = 'neutral' | 'overpronation' | 'supination'
export type FootStrike = 'heel' | 'midfoot' | 'forefoot'
export type Level = 'beginner' | 'intermediate' | 'advanced'
export type Goal = 'speed' | 'endurance' | 'ultra' | 'daily' | 'competition'
export type Cushioning = 'minimal' | 'light' | 'moderate' | 'maximum'
export type Support = 'neutral' | 'stability' | 'motion-control'

export interface RunnerProfile {
  weight: number        // kg
  height: number        // cm
  terrain: Terrain
  pronation: Pronation
  footStrike: FootStrike
  level: Level
  goal: Goal
  weeklyKm: number
  budget: number        // EUR max
}

export interface RunningShoe {
  id: string
  brand: string
  model: string
  price: number
  terrain: Terrain[]
  pronation: Pronation[]
  footStrike: FootStrike[]
  cushioning: Cushioning
  support: Support
  weightLimit: number   // max recommended runner weight in kg
  weeklyKmMin: number   // recommended minimum weekly km
  level: Level[]
  goals: Goal[]
  description: string
  pros: string[]
  image?: string
}

export interface ScoredShoe extends RunningShoe {
  score: number
  matchReasons: string[]
}
