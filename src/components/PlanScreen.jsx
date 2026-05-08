import { TAGS, calcSpentByTag } from '../data/constants'

export default function PlanScreen({ active, prev, transactions, settings, onBack, onTab, onEdit, onTrip }) {
  const regularTx   = transactions.filter(t => !t.isTripExpense)  // 👈 add this
  const cls         = active ? 'screen' : prev ? 'screen prev' : 'screen hidden'
  const salary      = settings?.salary      || 0
  const savingsGoal = settings?.savingsGoal || 0
  const totalSpent  = regularTx.reduce((s, t) => s + t.amount, 0) // 👈 was transactions
  const spendable   = salary - savingsGoal
  const remaining   = spendable - totalSpent
  const spentByTag  = calcSpentByTag(regularTx)   
  
  return (
    <div className={cls}>
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <span style={{ fontSize: 18, fontWeight: 500 }}>Monthly plan</span>
        <button
          onClick={onEdit}
          style={{
            background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 10,
            padding: '7px 14px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Edit
        </button>
      </div>

      <div className="scrollable" style={{ padding: '0 16px' }}>

        {/* Savings goal */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 18, marginTop: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
            Savings goal
          </div>
          <div style={{ textAlign: 'center', padding: '10px 0 14px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 44, color: 'var(--accent)', lineHeight: 1 }}>
              S${savingsGoal.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
              {salary > 0 ? Math.round((savingsGoal / salary) * 100) : 0}% of salary · locked away first
            </div>
            <div style={{
              marginTop: 14,
              padding: '10px 16px',
              background: 'var(--surface2)',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Total saved in bank</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>
                S${(settings.bankSavings || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onTrip}
          style={{
            width: '100%',
            marginTop: 12,
            padding: '14px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--accent)',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          ✈️ Plan a trip
        </button>

        {/* Breakdown */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 18, marginTop: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
            This month
          </div>
          {[
            { label: 'Salary',           val: `S$${salary.toLocaleString()}`,              color: 'var(--text)'                                     },
            { label: 'Savings (locked)', val: `−S$${savingsGoal.toLocaleString()}`,         color: 'var(--accent)'                                   },
            { label: 'Spent so far',     val: `−S$${totalSpent.toFixed(2)}`,                color: 'var(--red)'                                      },
            { label: 'Remaining',        val: `S$${Math.max(0, remaining).toFixed(2)}`,     color: remaining < 0 ? 'var(--red)' : 'var(--green)'     },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: row.color }}>{row.val}</span>
            </div>
          ))}
        </div>

        {/* Budget by category */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 18, marginTop: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
            Budget by category
          </div>
          {TAGS.map(tag => {
            const spent  = spentByTag[tag.id] || 0
            const budget = settings.budgets?.[tag.id] || 0
            const pct    = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
            const over   = pct > 85
            return (
              <div key={tag.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={tag.icon} alt={tag.name} width={18} height={18} />
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>{tag.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: over ? 'var(--red)' : 'var(--text)' }}>
                    S${spent.toFixed(2)} / S${budget}
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
                  <div style={{
                    height: 4, borderRadius: 2,
                    width: `${pct}%`,
                    background: over ? 'var(--red)' : 'var(--accent)',
                    transition: 'width 0.6s ease',
                  }}/>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ height: 20 }} />
      </div>

    </div>
  )
}