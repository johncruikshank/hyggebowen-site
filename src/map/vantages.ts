export type Vantage = 'overview' | 'road' | 'playground' | 'plan'

export const VANTAGES: { id: Vantage; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'road', label: 'From Joan Audrey Lane' },
  { id: 'playground', label: 'From the playground' },
  { id: 'plan', label: 'Plan view' },
]
