import { useState } from 'react'

export default function MonthResetModal({ prevMonth, savingsGoal, bankSavings, onConfirm, onDismiss }) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate]     = useState('')
  const newBankSavings = bankSavings + savingsGoal

  function handleNotYet() {
    setShowDatePicker(true)
  }

  function handleSchedule() {
    if (!selectedDate) return
    onDismiss(selectedDate)
  }

  function handleSkip() {
    onDismiss(null)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '0 32px',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20, padding: 24,
        width: '100%', maxWidth: 320,
      }}>

        {!showDatePicker ? (
          <>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>🌱</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', textAlign: 'center', marginBottom: 8, fontFamily: 'var(--font-serif)' }}>
              New month, fresh start!
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6, marginBottom: 20 }}>
              {prevMonth}'s transactions will be archived and a new month begins.
            </div>

            {/* What will change */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                What's changing
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Transactions</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Archived ✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Bank savings</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)' }}>
                  S${bankSavings.toLocaleString()} → S${newBankSavings.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Savings added</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)' }}>+S${savingsGoal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Budgets & settings</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Kept ✓</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleNotYet}
                style={{ flex: 1, padding: 14, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 14, color: 'var(--muted)', cursor: 'pointer' }}
              >
                Not yet
              </button>
              <button
                onClick={onConfirm}
                style={{ flex: 2, padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}
              >
                Start new month 🌱
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>📅</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', textAlign: 'center', marginBottom: 8, fontFamily: 'var(--font-serif)' }}>
              When would you like to reset?
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6, marginBottom: 20 }}>
              We'll remind you to reset on this date.
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{
                width: '100%', background: 'var(--surface2)',
                border: '1px solid var(--border)', borderRadius: 12,
                padding: '12px 14px', fontSize: 14,
                color: 'var(--text)', outline: 'none',
                marginBottom: 16,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleSkip}
                style={{ flex: 1, padding: 14, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 14, color: 'var(--muted)', cursor: 'pointer' }}
              >
                Skip for now
              </button>
              <button
                onClick={handleSchedule}
                disabled={!selectedDate}
                style={{ flex: 2, padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', opacity: selectedDate ? 1 : 0.4 }}
              >
                Remind me then
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}