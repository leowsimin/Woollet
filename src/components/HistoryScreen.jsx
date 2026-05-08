import { useState } from 'react'
import { TAGS } from '../data/constants'
import { exportToExcel } from '../utils/exportExcel'

function ConfirmModal({ onConfirm, onCancel }) {
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
        <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>🗑️</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', textAlign: 'center', marginBottom: 8 }}>
          Delete transaction?
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6, marginBottom: 24 }}>
          This transaction will be permanently deleted. This cannot be undone.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: 14,
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 12, fontSize: 14,
              color: 'var(--text)', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: 14,
              background: 'rgba(192,57,43,0.1)',
              border: '1px solid var(--red)',
              borderRadius: 12, fontSize: 14,
              fontWeight: 600, color: 'var(--red)',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HistoryScreen({ active, prev, transactions, archivedMonths, settings, onBack, onTab, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(null)
  const cls    = active ? 'screen' : prev ? 'screen prev' : 'screen hidden'
  const today  = new Date()
  const thisMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' })

  function TxRow({ tx }) {
    const tag = TAGS.find(t => t.id === tx.tag)
    return (
      <div className="tx-row" style={{ position: 'relative' }}>
        <div className="tx-icon-wrap">
          {tag?.icon && <img src={tag.icon} alt={tag?.name} width={22} height={22} />}
        </div>
        <div className="tx-info">
          <div className="tx-name">{tx.note}</div>
          <div className="tx-meta">
            {tag?.name} · {tx.date}
            {tx.isTripExpense && <span style={{ color: 'var(--accent)', marginLeft: 6 }}>✈️ Trip</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="tx-amount">−S${tx.amount.toFixed(2)}</div>
          <button
            onClick={() => setConfirmDelete(tx)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: 16,
              padding: '4px',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cls}>
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <span style={{ fontSize: 18, fontWeight: 500 }}>History</span>
        <button
          onClick={() => exportToExcel(transactions, settings)}
          style={{
            background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 10,
            padding: '7px 14px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Export ↓
        </button>
      </div>

      <div className="scrollable" style={{ padding: '0 16px' }}>

        {/* This month */}
        <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '18px 0 10px' }}>
          {thisMonth}
        </div>
        {transactions.length === 0 ? (
          <div style={{
            padding: '32px 16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
              Nothing here yet
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              Transactions you log this month will appear here.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {transactions.map(tx => <TxRow key={tx.id} tx={tx} />)}
          </div>
        )}

        {/* Archived months */}
        {archivedMonths.map(month => (
          <div key={month.monthKey}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '18px 0 10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{month.monthLabel}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                S${month.transactions.reduce((s, t) => s + t.amount, 0).toFixed(2)} spent
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {month.transactions.map(tx => <TxRow key={tx.id} tx={tx} />)}
            </div>
          </div>
        ))}

        <div style={{ height: 20 }} />
      </div>

      {confirmDelete && (
        <ConfirmModal
          onConfirm={() => {
            onDelete(confirmDelete.id)
            setConfirmDelete(null)
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}