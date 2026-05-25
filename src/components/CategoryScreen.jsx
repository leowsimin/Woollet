import { TAGS } from '../data/constants'

export default function CategoryScreen({ active, prev, tag, transactions, settings, onBack, onLog }) {
  const cls     = active ? 'screen' : prev ? 'screen prev' : 'screen hidden'
  const tagData = TAGS.find(t => t.id === tag)
  const budget  = settings?.budgets?.[tag] || 0

  const catTx = transactions
    .filter(t => t.tag === tag && !t.isTripExpense)

  const totalSpent = catTx.reduce((s, t) => s + t.amount, 0)
  const remaining  = budget - totalSpent
  const pct        = budget > 0 ? Math.min(100, (totalSpent / budget) * 100) : 0

  if (!tagData) return null

  return (
    <div className={cls}>
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={tagData.icon} alt={tagData.name} width={20} height={20} />
          <span style={{ fontSize: 18, fontWeight: 500 }}>{tagData.name}</span>
        </div>
        <button
          onClick={() => onLog(tag)}
          style={{
            width: 34, height: 34,
            borderRadius: '50%',
            background: 'var(--accent)',
            border: 'none',
            color: '#fff',
            fontSize: 22,
            fontWeight: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>

      <div className="scrollable" style={{ padding: '0 16px' }}>

        {/* Budget summary card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          padding: 18,
          marginTop: 16,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Spent</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--red)' }}>
                S${totalSpent.toFixed(2)}
              </div>
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Remaining</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: remaining < 0 ? 'var(--red)' : 'var(--green)' }}>
                {remaining < 0 ? `-S$${Math.abs(remaining).toFixed(2)}` : `S$${remaining.toFixed(2)}`}
              </div>
            </div>
          </div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
            <div style={{
              height: 4, borderRadius: 2,
              width: `${pct}%`,
              background: pct > 85 ? 'var(--red)' : 'var(--accent)',
              transition: 'width 0.5s ease',
            }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>S$0</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Budget S${budget}</span>
          </div>
        </div>

        {/* Transaction history */}
        <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '18px 0 10px' }}>
          This month
        </div>

        {catTx.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)', marginBottom: 6 }}>
              No transactions yet
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              Tap + to log your first {tagData.name.toLowerCase()} expense!
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {catTx.map(tx => (
              <div key={tx.id} className="tx-row">
                <div className="tx-icon-wrap">
                  <img src={tagData.icon} alt={tagData.name} width={22} height={22} />
                </div>
                <div className="tx-info">
                  <div className="tx-name">{tx.note}</div>
                  <div className="tx-meta">{tx.date}</div>
                </div>
                <div className="tx-amount">−S${tx.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>
    </div>
  )
}