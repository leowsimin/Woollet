import { TAGS } from '../data/constants'

export default function SuccessScreen({ active, prev, tx, onHome }) {
  const cls = active ? 'screen' : prev ? 'screen prev' : 'screen hidden'
  const tag = tx ? TAGS.find(t => t.id === tx.tag) : null

  return (
    <div className={cls}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        {tx && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(200,240,102,0.12)',
              border: '1.5px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, marginBottom: 20,
              animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}>✓</div>

            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, marginBottom: 8 }}>
              Logged!
            </div>
            <div style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6, marginBottom: 24 }}>
              Your transaction has been saved.
            </div>

            {/* Receipt */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 18, padding: 18, width: '100%', marginBottom: 24,
            }}>
              {[
                { label: 'Amount',   value: `−S$${tx.amount.toFixed(2)}`,   color: 'var(--red)' },
                { label: 'Category', value: tag?.name,                      color: null },
                { label: 'Note',     value: tx.note,                        color: null         },
                { label: 'Time',     value: tx.date,                        color: null         },
                { label: 'Trip', value: tx.isTripExpense ? `✈️ ${tx.tripName}` : null, color: 'var(--accent)' },
              ].filter(r => r.value).map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: row.color || 'var(--text)' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <button className="fab" onClick={onHome}>Back to home</button>
          </>
        )}
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  )
}