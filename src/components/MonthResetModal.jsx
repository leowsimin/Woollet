export default function MonthResetModal({ prevMonth, savingsGoal, bankSavings, onConfirm, onDismiss }) {
  const newBankSavings = bankSavings + savingsGoal

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
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 320,
      }}>
        <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>🌱</div>
        <div style={{
          fontSize: 18, fontWeight: 600,
          color: 'var(--text)', textAlign: 'center', marginBottom: 8,
          fontFamily: 'var(--font-serif)',
        }}>
          New month, fresh start!
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6, marginBottom: 20 }}>
          {prevMonth}'s transactions will be archived and a new month begins.
        </div>

        {/* What will change */}
        <div style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 14, padding: 16, marginBottom: 20,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
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
            onClick={onDismiss}
            style={{
              flex: 1, padding: 14,
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 12, fontSize: 14,
              color: 'var(--muted)', cursor: 'pointer',
            }}
          >
            Not yet
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 2, padding: 14,
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 12, fontSize: 14,
              fontWeight: 600, color: '#fff',
              cursor: 'pointer',
            }}
          >
            Start new month 🌱
          </button>
        </div>
      </div>
    </div>
  )
}