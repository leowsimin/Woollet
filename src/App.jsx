import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import {
  SEED_TRANSACTIONS, loadSettings, saveSettings,
  loadTrips, saveTrips, loadLastMonth, saveLastMonth,
  loadArchivedMonths, saveArchivedMonths
} from './data/constants'
import HomeScreen      from './components/HomeScreen'
import LogScreen       from './components/LogScreen'
import SuccessScreen   from './components/SuccessScreen'
import HistoryScreen   from './components/HistoryScreen'
import PlanScreen      from './components/PlanScreen'
import SettingsScreen  from './components/SettingScreen'
import TripScreen      from './components/TripScreen'
import NavBar          from './components/NavBar'
import MonthResetModal from './components/MonthResetModal'

const STORAGE_KEY = 'kaching_transactions'

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : SEED_TRANSACTIONS
  } catch {
    return SEED_TRANSACTIONS
  }
}

function getCurrentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getCurrentMonthLabel() {
  const now = new Date()
  return now.toLocaleString('default', { month: 'long', year: 'numeric' })
}

const NAV_SCREENS = ['home', 'history', 'plan']

export default function App() {
  const [screen, setScreen]               = useState('home')
  const [prevScreen, setPrevScreen]       = useState(null)
  const [transactions, setTransactions]   = useState(loadTransactions)
  const [preTag, setPreTag]               = useState(null)
  const [lastTx, setLastTx]               = useState(null)
  const [settings, setSettings]           = useState(loadSettings)
  const [trips, setTrips]                 = useState(loadTrips)
  const [archivedMonths, setArchivedMonths] = useState(loadArchivedMonths)
  const [showResetModal, setShowResetModal] = useState(false)
  const [pendingMonthKey, setPendingMonthKey] = useState(null)

  // Check for month change on load
  useEffect(() => {
    const currentKey  = getCurrentMonthKey()
    const lastKey     = loadLastMonth()

    if (!lastKey) {
      // First time app is opened — just save current month
      saveLastMonth(currentKey)
      return
    }

    if (lastKey !== currentKey) {
      // Month has changed — show reset modal
      setPendingMonthKey(currentKey)
      setShowResetModal(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    saveTrips(trips)
  }, [trips])

  useEffect(() => {
    saveArchivedMonths(archivedMonths)
  }, [archivedMonths])

  function handleMonthConfirm() {
    const lastKey   = loadLastMonth()
    const lastLabel = lastKey
      ? new Date(lastKey + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })
      : getCurrentMonthLabel()

    // Archive current transactions
    const archive = {
      monthKey:     lastKey,
      monthLabel:   lastLabel,
      transactions: transactions,
    }
    setArchivedMonths(prev => [archive, ...prev])

    // Clear transactions
    setTransactions([])

    // Add savings to bank balance
    setSettings(prev => ({
      ...prev,
      bankSavings: (prev.bankSavings || 0) + (prev.savingsGoal || 0),
    }))

    // Save new month key
    saveLastMonth(pendingMonthKey)
    setShowResetModal(false)
    setPendingMonthKey(null)
  }

  function handleMonthDismiss() {
    // User dismissed — don't reset, but save the new month key
    // so we don't keep showing the modal
    saveLastMonth(pendingMonthKey)
    setShowResetModal(false)
    setPendingMonthKey(null)
  }

  function nav(to) {
    setPrevScreen(screen)
    setScreen(to)
  }

  function openLog(tagId) {
    setPreTag(tagId)
    nav('log')
  }

function handleSave(tx) {
  const enrichedTx = {
    ...tx,
    tripName: tx.isTripExpense ? trips.find(t => t.id === tx.tripId)?.name || '' : null,
  }

  setTransactions(prev => [enrichedTx, ...prev])
  setLastTx(enrichedTx)

  if (enrichedTx.isTripExpense && enrichedTx.tripId) {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== enrichedTx.tripId) return trip
      return {
        ...trip,
        expenses: [...(trip.expenses || []), {
          id:       enrichedTx.id,
          amount:   enrichedTx.amount,
          category: enrichedTx.tripCategory || enrichedTx.tag,
          note:     enrichedTx.note,
          date:     enrichedTx.date,
        }]
      }
    }))
  }

  nav('success')
}

  function handleSaveSettings(newSettings) {
    setSettings(newSettings)
    nav('plan')
  }

  function handleSaveTrip(trip) {
    setTrips(prev => {
      const exists = prev.find(t => t.id === trip.id)
      if (exists) return prev.map(t => t.id === trip.id ? trip : t)
      return [...prev, trip]
    })
  }

  function handleDeleteTrip(tripId) {
    setTrips(prev => prev.filter(t => t.id !== tripId))
  }

  function goHome() { nav('home') }
  function handleTab(tab) { nav(tab) }

  const showNav = NAV_SCREENS.includes(screen)

  const today = new Date()
  const activeTrip = trips.find(trip => {
    const start = new Date(trip.startDate)
    const end   = new Date(trip.endDate)
    return today >= start && today <= end
  })

  const prevMonthLabel = (() => {
    const lastKey = loadLastMonth()
    if (!lastKey) return ''
    return new Date(lastKey + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })
  })()

  function handleDeleteTransaction(id) {
  setTransactions(prev => prev.filter(tx => tx.id !== id))
  }

  // FOR SHORTCUTS
  const navigate = useNavigate()
  const location = useLocation()

  // Handle URL routing on first load
  useEffect(() => {
    if (location.pathname === '/log') {
      setScreen('log')
    } else if (location.pathname === '/plan') {
      setScreen('plan')
    } else if (location.pathname === '/history') {
      setScreen('history')
    }
  }, [])

  // Sync screen state with URL
  useEffect(() => {
    if (screen === 'home')    navigate('/',        { replace: true })
    else if (screen === 'log')     navigate('/log',     { replace: true })
    else if (screen === 'history') navigate('/history', { replace: true })
    else if (screen === 'plan')    navigate('/plan',    { replace: true })
  }, [screen])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <HomeScreen
          active={screen === 'home'}
          prev={prevScreen === 'home'}
          transactions={transactions}
          settings={settings}
          activeTrip={activeTrip}
          onLog={openLog}
          onTab={handleTab}
        />
        <LogScreen
          active={screen === 'log'}
          prev={prevScreen === 'log'}
          preTag={preTag}
          settings={settings}
          activeTrip={activeTrip}
          onBack={goHome}
          onSave={handleSave}
        />
        <SuccessScreen
          active={screen === 'success'}
          prev={prevScreen === 'success'}
          tx={lastTx}
          settings={settings}
          onHome={goHome}
        />
        <HistoryScreen
          active={screen === 'history'}
          prev={prevScreen === 'history'}
          transactions={transactions}
          archivedMonths={archivedMonths}
          settings={settings}
          onBack={goHome}
          onTab={handleTab}
          onDelete={handleDeleteTransaction}
        />
        <PlanScreen
          active={screen === 'plan'}
          prev={prevScreen === 'plan'}
          transactions={transactions}
          settings={settings}
          trips={trips}
          onBack={goHome}
          onTab={handleTab}
          onEdit={() => nav('settings')}
          onTrip={() => nav('trip')}
        />
        <SettingsScreen
          active={screen === 'settings'}
          prev={prevScreen === 'settings'}
          settings={settings}
          onBack={() => nav('plan')}
          onSave={handleSaveSettings}
        />
        <TripScreen
          active={screen === 'trip'}
          prev={prevScreen === 'trip'}
          trips={trips}
          onBack={() => nav('plan')}
          onSave={handleSaveTrip}
          onDelete={handleDeleteTrip}
        />
      </div>

      {showNav && <NavBar active={screen} onTab={handleTab} />}

      {showResetModal && (
        <MonthResetModal
          prevMonth={prevMonthLabel}
          savingsGoal={settings.savingsGoal || 0}
          bankSavings={settings.bankSavings || 0}
          onConfirm={handleMonthConfirm}
          onDismiss={handleMonthDismiss}
        />
      )}

    </div>
  )
}