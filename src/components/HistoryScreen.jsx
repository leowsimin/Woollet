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
          <button onClick={onCancel} style={{ flex: 1, padding: 14, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 14, color: 'var(--text)', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: 14, background: 'rgba(192,57,43,0.1)', border: '1px solid var(--red)', borderRadius: 12, fontSize: 14, fontWeight: 600, color: 'var(--red)', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function groupByDate(transactions) {
  const groups = {}
  transactions.forEach(tx => {
    const key = tx.date?.split(',')[0] || 'Unknown'
    if (!groups[key]) groups[key] = []
    groups[key].push(tx)
  })
  return groups
}

function TxRow({ tx, onDelete }) {
  const tag = TAGS.find(t => t.id === tx.tag)
  return (
    <div className="tx-row">
      <div className="tx-icon-wrap">
        {tag?.icon && <img src={tag.icon} alt={tag?.name} width={22} height={22} />}
      </div>
      <div className="tx-info">
        <div className="tx-name">{tx.note}</div>
        <div className="tx-meta">
          {tag?.name}
          {tx.isTripExpense && <span style={{ color: 'var(--accent)', marginLeft: 6 }}>✈️ Trip</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="tx-amount">−S${tx.amount.toFixed(2)}</div>
        {onDelete && (
          <button
            onClick={() => onDelete(tx)}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, padding: '4px', lineHeight: 1, flexShrink: 0 }}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}

function MonthBlock({ monthLabel, transactions, onDelete }) {
  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0)
  const grouped    = groupByDate(transactions)

  return (
    <div>
      {/* Month header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 0 10px',
        borderBottom: '2px solid var(--border)',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {monthLabel}
        </span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          S${totalSpent.toFixed(2)} spent
        </span>
      </div>

      {/* Date groups */}
      {Object.entries(grouped).map(([date, txs]) => (
        <div key={date} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', padding: '8px 0 6px', letterSpacing: '0.06em' }}>
            {date}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {txs.map(tx => <TxRow key={tx.id} tx={tx} onDelete={onDelete} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HistoryScreen({ active, prev, transactions, archivedMonths, settings, trips, onBack, onTab, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(null)
  const cls       = active ? 'screen' : prev ? 'screen prev' : 'screen hidden'
  const today     = new Date()
  const thisMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className={cls}>
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <span style={{ fontSize: 18, fontWeight: 500 }}>History</span>
        <button
          onClick={() => exportToExcel(transactions, settings, trips, archivedMonths)}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          Export ↓
        </button>
      </div>

      <div className="scrollable" style={{ padding: '0 16px' }}>

        {/* This month */}
        {transactions.length === 0 ? (
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '18px 0 10px' }}>
              {thisMonth}
            </div>
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 6 }}>Nothing here yet</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>Transactions you log this month will appear here.</div>
            </div>
          </div>
        ) : (
          <MonthBlock
            monthLabel={thisMonth}
            transactions={transactions}
            onDelete={setConfirmDelete}
          />
        )}

        {/* Archived months */}
        {archivedMonths.map(month => (
          <MonthBlock
            key={month.monthKey}
            monthLabel={month.monthLabel}
            transactions={month.transactions}
            onDelete={null}
          />
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