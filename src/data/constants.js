import foodIcon        from '../assets/food-icon.svg'
import transportIcon   from '../assets/transport-icon.svg'
import danceIcon       from '../assets/dance-icon.svg'
import necessitiesIcon from '../assets/necessities-icon.svg'
import travelIcon      from '../assets/travel-icon.svg'
import otherIcon       from '../assets/others-icon.svg'

export const DEFAULT_SALARY       = 2400;
export const DEFAULT_SAVINGS_GOAL = 800;

export const DEFAULT_BUDGETS = {
  food:         400,
  transport:    200,
  dance:        250,
  necessities:  300,
  travel:       200,
  other:        150,
}

export const TAGS = [
  { id: 'food',        name: 'Food',        icon: foodIcon        },
  { id: 'transport',   name: 'Transport',   icon: transportIcon   },
  { id: 'dance',       name: 'Dance',       icon: danceIcon       },
  { id: 'necessities', name: 'Necessities', icon: necessitiesIcon },
  { id: 'travel',      name: 'Travel',      icon: travelIcon      },
  { id: 'other',       name: 'Other',       icon: otherIcon       },
]

export const SEED_TRANSACTIONS = [];

export function loadSettings() {
  try {
    const saved = localStorage.getItem('kaching_settings')
    if (saved) return JSON.parse(saved)
  } catch {}
  return {
    salary:      DEFAULT_SALARY,
    savingsGoal: DEFAULT_SAVINGS_GOAL,
    budgets:     DEFAULT_BUDGETS,
    bankSavings: 0,
    salaryDate:  25,
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem('kaching_settings', JSON.stringify(settings))
  } catch {}
}

export function getTagById(id) {
  return TAGS.find(t => t.id === id);
}

export function calcSpentByTag(transactions) {
  const map = {};
  TAGS.forEach(t => { map[t.id] = 0; });
  transactions.forEach(t => { map[t.tag] = (map[t.tag] || 0) + t.amount; });
  return map;
}

// TRIP PLANNINGS
export function loadTrips() {
  try {
    const saved = localStorage.getItem('kaching_trips')
    return saved ? JSON.parse(saved) : []
  } catch {}
  return []
}

export function saveTrips(trips) {
  try {
    localStorage.setItem('kaching_trips', JSON.stringify(trips))
  } catch {}
}

// Monthly reset Fuctions
export function loadLastMonth() {
  try {
    const saved = localStorage.getItem('kaching_last_month')
    return saved || null
  } catch {}
  return null
}

export function saveLastMonth(monthKey) {
  try {
    localStorage.setItem('kaching_last_month', monthKey)
  } catch {}
}

export function loadArchivedMonths() {
  try {
    const saved = localStorage.getItem('kaching_archived_months')
    return saved ? JSON.parse(saved) : []
  } catch {}
  return []
}

export function saveArchivedMonths(months) {
  try {
    localStorage.setItem('kaching_archived_months', JSON.stringify(months))
  } catch {}
}