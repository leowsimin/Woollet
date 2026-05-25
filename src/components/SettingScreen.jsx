import { useState } from 'react'
import { TAGS } from '../data/constants'

export default function SettingsScreen({ active, prev, settings, onBack, onSave }) {
  const [salary, setSalary]           = useState(String(settings.salary))
  const [savingsGoal, setSavingsGoal] = useState(String(settings.savingsGoal))
  const [budgets, setBudgets]         = useState(settings.budgets)
  const [bankSavings, setBankSavings] = useState(String(settings.bankSavings || 0))
  const [salaryDate, setSalaryDate]   = useState(String(settings.salaryDate || 25))

  const cls = active ? 'screen' : prev ? 'screen prev' : 'screen hidden'

  function updateBudget(id, val) {
    setBudgets(prev => ({ ...prev, [id]: parseFloat(val) || 0 }))
  }

  function handleSave() {
    onSave({
      salary:      parseFloat(salary)      || 0,
      savingsGoal: parseFloat(savingsGoal) || 0,
      budgets,
      bankSavings: parseFloat(bankSavings) || 0,
      salaryDate:  parseInt(salaryDate)    || 25,
    })
  }

  const totalBudgeted = Object.values(budgets).reduce((s, v) => s + v, 0)
  const spendable     = (parseFloat(salary) || 0) - (parseFloat(savingsGoal) || 0)
  const unallocated   = spendable - totalBudgeted

  return (
    <div className={cls}>
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <span style={{ fontSize: 18, fontWeight: 500 }}>Edit plan</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="scrollable" style={{ padding: '0 16px' }}>

        {/* Income */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Income
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>

            {/* Monthly salary */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Monthly salary</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Your take home pay</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>S$</span>
                <input
                  type="number"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  style={{ width: 90, textAlign: 'right', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: 14, fontWeight: 500, color: 'var(--text)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Salary date */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Salary date</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Day of month salary arrives</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Day</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={salaryDate}
                  onChange={e => setSalaryDate(e.target.value)}
                  style={{ width: 70, textAlign: 'right', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: 14, fontWeight: 500, color: 'var(--text)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Locked savings */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Locked savings</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Set aside before spending</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>S$</span>
                <input
                  type="number"
                  value={savingsGoal}
                  onChange={e => setSavingsGoal(e.target.value)}
                  style={{ width: 90, textAlign: 'right', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: 14, fontWeight: 500, color: 'var(--text)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Bank savings */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Bank savings</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Your current total saved</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>S$</span>
                <input
                  type="number"
                  value={bankSavings}
                  onChange={e => setBankSavings(e.target.value)}
                  style={{ width: 90, textAlign: 'right', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: 14, fontWeight: 500, color: 'var(--text)', outline: 'none' }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Summary bar */}
        <div style={{
          background: unallocated < 0 ? 'rgba(192,57,43,0.08)' : 'rgba(45,106,143,0.08)',
          border: `1px solid ${unallocated < 0 ? 'var(--red)' : 'var(--accent)'}`,
          borderRadius: 12, padding: '12px 16px', marginTop: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Spendable after savings</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: unallocated < 0 ? 'var(--red)' : 'var(--accent)' }}>
            S${spendable.toFixed(2)}
          </span>
        </div>

        {/* Category budgets */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Category budgets
            </div>
            <button
              onClick={() => setBudgets(Object.fromEntries(TAGS.map(t => [t.id, 0])))}
              style={{ fontSize: 11, fontWeight: 600, color: 'var(--red)', background: 'rgba(192,57,43,0.08)', border: '1px solid var(--red)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}
            >
              Reset
            </button>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            {TAGS.map((tag, i) => (
              <div
                key={tag.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < TAGS.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={tag.icon} alt={tag.name} width={22} height={22} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{tag.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>S$</span>
                  <input
                    type="number"
                    value={budgets[tag.id] || ''}
                    onChange={e => updateBudget(tag.id, e.target.value)}
                    style={{ width: 90, textAlign: 'right', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: 14, fontWeight: 500, color: 'var(--text)', outline: 'none' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unallocated */}
        <div style={{
          background: unallocated < 0 ? 'rgba(192,57,43,0.08)' : 'rgba(46,125,79,0.08)',
          border: `1px solid ${unallocated < 0 ? 'var(--red)' : 'var(--green)'}`,
          borderRadius: 12, padding: '12px 16px', marginTop: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            {unallocated < 0 ? 'Over allocated by' : 'Unallocated'}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: unallocated < 0 ? 'var(--red)' : 'var(--green)' }}>
            S${Math.abs(unallocated).toFixed(2)}
          </span>
        </div>

        <div className="fab-wrap">
          {unallocated < 0 && (
            <div style={{
              background: 'rgba(192,57,43,0.08)', border: '1px solid var(--red)',
              borderRadius: 12, padding: '12px 16px', marginBottom: 12,
              fontSize: 13, color: 'var(--red)', textAlign: 'center', lineHeight: 1.6,
            }}>
              ⚠️ You've over-allocated by S${Math.abs(unallocated).toFixed(2)}. <br/>
              Please reduce your category budgets before saving.
            </div>
          )}
          <button className="fab" onClick={handleSave} disabled={unallocated < 0}>
            Save plan
          </button>
        </div>

      </div>
    </div>
  )
}