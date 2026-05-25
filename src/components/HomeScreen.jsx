import { TAGS, calcSpentByTag } from '../data/constants'

import sheepHappy    from '../assets/sheep-happy.svg'
import sheepNeutral  from '../assets/sheep-neutral.svg'
import sheepWorried  from '../assets/sheep-worried.svg'
import sheepStressed from '../assets/sheep-stressed.svg'

import sparkle  from "../assets/sparkle-icon.svg"
import sparkle2 from "../assets/sparkle2-icon.svg"

export default function HomeScreen({ active, prev, transactions, settings, activeTrip, onLog, onTab }) {
  const regularTx   = transactions.filter(t => !t.isTripExpense)  // 👈 add this
  const salary      = settings?.salary      || 0
  const savingsGoal = settings?.savingsGoal || 0
  const totalSpent  = regularTx.reduce((s, t) => s + t.amount, 0) // 👈 was transactions
  const spendable   = salary - savingsGoal
  const remaining   = spendable - totalSpent
  const spentByTag  = calcSpentByTag(regularTx)      

  const cls = active ? 'screen' : prev ? 'screen prev' : 'screen hidden'

  const today = new Date()
  const month = today.toLocaleString('default', { month: 'long' })
  const year  = today.getFullYear()

  function getSheep(pct) {
    if (pct < 20)  return { img: sheepHappy,    msg: "BAA! Looking good this month!",        sub: "You're well within budget. Keep it up!"     }
    if (pct < 60)  return { img: sheepNeutral,  msg: "Doing okay! Watch those treats 🌿",     sub: "You're making good progress this month."    }
    if (pct < 85)  return { img: sheepWorried,  msg: "Hmm, slowing down might be wise…",      sub: "You're getting through your budget quickly." }
                   return { img: sheepStressed, msg: "Uh oh! The pond is almost empty!",      sub: "You've used most of your budget this month." }
  }

  const spentPct = spendable > 0 ? (totalSpent / spendable) * 100 : 0
  const sheep    = getSheep(spentPct)

  return (
    <div className={cls}>
      <div className="scrollable">

        {/* Topbar */}
        <div className="topbar">
          <h1>Woollet</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="pill">{month} {year}</div>
            <button
              onClick={() => onLog(null)}
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
                flexShrink: 0,
                transition: 'background 0.15s, transform 0.1s',
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Sheep companion */}
        <div style={{
          margin: '16px 16px 0',
          padding: '14px 16px',
          textAlign: 'center',
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>

            {/* Sparkles */}
            <img src={sparkle} alt="" style={{
              position: 'absolute', top: 2, right: 8,
              width: 16, height: 16,
              animation: 'sparkle 1.6s ease-in-out infinite',
            }}/>
            <img src={sparkle2} alt="" style={{
              position: 'absolute', bottom: 6, left: 4,
              width: 12, height: 12,
              animation: 'sparkle 1.6s ease-in-out infinite 0.5s',
            }}/>
            <img src={sparkle} alt="" style={{
              position: 'absolute', top: -2, left: 10,
              width: 10, height: 10,
              animation: 'sparkle 1.6s ease-in-out infinite 1s',
            }}/>

            {/* Sheep */}
            <img
              src={sheep.img}
              alt="sheep companion"
              style={{
                width: 100, height: 100,
                margin: '0 auto',
                display: 'block',
                animation: 'float 5s ease-in-out infinite',
              }}
            />
          </div>

          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
            {sheep.msg}
          </div>
          <div style={{ fontSize: 13, color: 'var(--accent)', lineHeight: 1.6 }}>
            {sheep.sub}
          </div>
        </div>

        {/* Active Trip Card */}
        {activeTrip && (() => {
          const tripExpenses = activeTrip.expenses || []
          return (
            <div style={{ margin: '12px 16px 0', background: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 18, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>✈️ {activeTrip.name}</span>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    {new Date(activeTrip.startDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })} — {new Date(activeTrip.endDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <span style={{ fontSize: 10, background: 'var(--accent)', color: '#fff', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>ACTIVE</span>
              </div>
              {TAGS.map(tag => {
                const budget   = parseFloat(activeTrip.budgets?.[tag.id]) || 0
                const spent = tripExpenses.filter(e => e.category === tag.id || e.tag === tag.id).reduce((s, e) => s + e.amount, 0)
                const pct      = Math.min(100, (spent / budget) * 100)
                return (
                  <div key={tag.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}><img src={tag.icon} width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }}/>{tag.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: pct > 85 ? 'var(--red)' : 'var(--text)' }}>S${spent.toFixed(2)} / S${budget}</span>
                    </div>
                    <div style={{ height: 3, background: 'var(--border)', borderRadius: 2 }}>
                      <div style={{ height: 3, borderRadius: 2, width: `${pct}%`, background: pct > 85 ? 'var(--red)' : 'var(--accent)', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Hero Card */}
        <div style={{
          margin: '16px 16px 0',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: 22,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(200,240,102,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}/>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            Monthly salary
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 40, fontWeight: 400, lineHeight: 1 }}>
            S${salary.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>
            Trainee · after S${savingsGoal} savings locked
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 18 }}>
            <div style={{ background: 'var(--surface2)', borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>Spent</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--red)' }}>S${totalSpent.toFixed(2)}</div>
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>Remaining</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--green)' }}>
                S${Math.max(0, remaining).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="section-header">
          <span className="section-title">Categories</span>
          <span className="section-sub">this month</span>
        </div>
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {TAGS.map((tag, i) => {
            const spent  = spentByTag[tag.id] || 0
            const budget = settings.budgets?.[tag.id] || 0
            const pct    = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
            return (
              <div
                key={tag.id}
                className="anim"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: 16,
                  cursor: 'pointer',
                  animationDelay: `${i * 0.05}s`,
                }}
                onClick={() => onLog(tag.id)}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <img src={tag.icon} alt={tag.name} width={35} height={36} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{tag.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                  S${spent.toFixed(2)} / S${budget}
                </div>
                <div style={{
                  fontSize: 12, marginTop: 2, fontWeight: 500,
                  color: budget - spent <= 0 ? 'var(--red)' : 'var(--green)',
                }}>
                  {budget - spent <= 0
                    ? `S$${Math.abs(budget - spent).toFixed(2)} over`
                    : `S$${(budget - spent).toFixed(2)} left`
                  }
                </div>
                <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, marginTop: 10 }}>
                  <div style={{
                    height: 3, borderRadius: 2,
                    width: `${pct}%`,
                    background: pct > 85 ? 'var(--red)' : 'var(--accent)',
                    transition: 'width 0.5s ease',
                  }}/>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent */}
        <div className="section-header" style={{ marginTop: 8 }}>
          <span className="section-title">Recent</span>
        </div>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {transactions.length === 0 ? (
          <div style={{
            padding: '24px 16px',
            textAlign: 'center',
        }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
        No transactions yet
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
        Tap + Log transaction to record your first spend!
      </div>
      </div>
        ) : (
          transactions.slice(0, 3).map(tx => {
            const tag = TAGS.find(t => t.id === tx.tag)
            return (
              <div key={tx.id} className="tx-row">
                <div className="tx-icon-wrap">
                  {tag?.icon && <img src={tag.icon} alt={tag?.name} width={22} height={22} />}
                </div>
                <div className="tx-info">
                  <div className="tx-name">{tx.note}</div>
                  <div className="tx-meta">
                    {tag?.name} · {tx.date}
                    {tx.isTripExpense && <span style={{ color: 'var(--accent)', marginLeft: 6 }}>✈️</span>}
                  </div>
                </div>
                <div className="tx-amount">−S${tx.amount.toFixed(2)}</div>
              </div>
            )
          })
        )}
      </div>

    </div>
  </div>
  )
}