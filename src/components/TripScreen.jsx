import { useState } from 'react'
import { TAGS } from '../data/constants'

function ConfirmModal({ message, onConfirm, onCancel }) {
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
        <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>🗑️</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', textAlign: 'center', marginBottom: 8 }}>
          Delete trip?
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6, marginBottom: 24 }}>
          {message}
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

function TripCard({ trip, onEdit, onDelete }) {
  const today    = new Date()
  const start    = new Date(trip.startDate)
  const end      = new Date(trip.endDate)
  const isActive = today >= start && today <= end
  const isPast   = today > end
  const total    = Object.values(trip.budgets).reduce((s, v) => s + (parseFloat(v) || 0), 0)
  const spent    = (trip.expenses || []).reduce((s, e) => s + e.amount, 0)
  const pct      = total > 0 ? Math.min(100, (spent / total) * 100) : 0

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 18,
      padding: 18,
      marginBottom: 12,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{trip.name}</span>
            {isActive && (
              <span style={{ fontSize: 10, background: 'var(--accent)', color: '#fff', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>
                ACTIVE
              </span>
            )}
            {isPast && (
              <span style={{ fontSize: 10, background: 'var(--surface2)', color: 'var(--muted)', borderRadius: 6, padding: '2px 8px' }}>
                PAST
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            {new Date(trip.startDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })} — {new Date(trip.endDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onEdit(trip)}
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: 'var(--text)', cursor: 'pointer' }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid var(--red)', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: 'var(--red)', cursor: 'pointer' }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Budget breakdown by category */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {TAGS.map(tag => {
          const budget   = parseFloat(trip.budgets[tag.id]) || 0
          const catSpent = (trip.expenses || [])
            .filter(e => e.category === tag.id)
            .reduce((s, e) => s + e.amount, 0)
          const catPct = budget > 0 ? Math.min(100, (catSpent / budget) * 100) : catSpent > 0 ? 100 : 0
          return (
            <div key={tag.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src={tag.icon} alt={tag.name} width={16} height={16} />
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{tag.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: catPct > 85 ? 'var(--red)' : 'var(--text)' }}>
                  S${catSpent.toFixed(2)} / S${budget}
                </span>
              </div>
              <div style={{ height: 3, background: 'var(--border)', borderRadius: 2 }}>
                <div style={{ height: 3, borderRadius: 2, width: `${catPct}%`, background: catPct > 85 ? 'var(--red)' : 'var(--accent)', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total budget</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>S${total.toFixed(2)}</span>
      </div>

      {spent > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              S${spent.toFixed(2)} spent · S${Math.max(0, total - spent).toFixed(2)} left
            </span>
            <span style={{ fontSize: 12, color: pct > 85 ? 'var(--red)' : 'var(--accent)' }}>
              {pct.toFixed(0)}%
            </span>
          </div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
            <div style={{ height: 4, borderRadius: 2, width: `${pct}%`, background: pct > 85 ? 'var(--red)' : 'var(--accent)', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}
    </div>
  )
}

function TripForm({ initial, onSave, onCancel }) {
  const [name, setName]       = useState(initial?.name      || '')
  const [startDate, setStart] = useState(initial?.startDate || '')
  const [endDate, setEnd]     = useState(initial?.endDate   || '')
  const [budgets, setBudgets] = useState(() => {
    const defaults = {}
    TAGS.forEach(t => { defaults[t.id] = initial?.budgets?.[t.id] ?? '' })
    return defaults
  })

  function updateBudget(id, val) {
    setBudgets(prev => ({ ...prev, [id]: val }))
  }

  const total   = Object.values(budgets).reduce((s, v) => s + (parseFloat(v) || 0), 0)
  const allBudgetsFilled = TAGS.every(t => budgets[t.id] !== '' && budgets[t.id] !== undefined)
  const canSave = name && startDate && endDate && allBudgetsFilled

  function handleSave() {
    if (!canSave) return
    onSave({
      id:       initial?.id || Date.now(),
      name,
      startDate,
      endDate,
      budgets,
      expenses: initial?.expenses || [],
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Trip name */}
      <div>
        <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Trip name
        </div>
        <input
          placeholder="e.g. Iceland Trip"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 8px', fontSize: 12, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, minWidth: 0 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Start date
          </div>
          <input
            type="date"
            value={startDate}
            onChange={e => setStart(e.target.value)}
            style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--text)', outline: 'none' }}
          />
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            End date
          </div>
          <input
            type="date"
            value={endDate}
            onChange={e => setEnd(e.target.value)}
            style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--text)', outline: 'none' }}
          />
        </div>
      </div>

      {/* Budget breakdown */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Budget breakdown
          </div>
          <button
            onClick={() => setBudgets(Object.fromEntries(TAGS.map(t => [t.id, 0])))}
            style={{
              fontSize: 11, fontWeight: 600,
              color: 'var(--red)',
              background: 'rgba(192,57,43,0.08)',
              border: '1px solid var(--red)',
              borderRadius: 8,
              padding: '5px 12px',
              cursor: 'pointer',
            }}
            >
            Reset
          </button>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          {TAGS.map((tag, i) => (
            <div
              key={tag.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < TAGS.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={tag.icon} alt={tag.name} width={20} height={20} />
                <span style={{ fontSize: 13, color: 'var(--text)' }}>{tag.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>S$</span>
                <input
                  type="number"
                  placeholder="0"
                  value={budgets[tag.id] || ''}
                  onChange={e => updateBudget(tag.id, e.target.value)}
                  style={{ width: 80, textAlign: 'right', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: 14, color: 'var(--text)', outline: 'none' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total estimated cost</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>S${total.toFixed(2)}</span>
      </div>

      {!allBudgetsFilled && (
        <div style={{
          fontSize: 12, color: 'var(--red)',
          textAlign: 'center', padding: '4px 0'
        }}>
          Please fill in all category budgets (use 0 if not needed)
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onCancel}
          style={{ flex: 1, padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, fontSize: 14, color: 'var(--muted)', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{ flex: 2, padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', opacity: canSave ? 1 : 0.4 }}
        >
          Save trip
        </button>
      </div>

    </div>
  )
}

export default function TripScreen({ active, prev, trips, onBack, onSave, onDelete }) {
  const [showForm, setShowForm]   = useState(false)
  const [editing, setEditing]     = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const cls = active ? 'screen' : prev ? 'screen prev' : 'screen hidden'

  function handleSave(trip) {
    onSave(trip)
    setShowForm(false)
    setEditing(null)
  }

  function handleEdit(trip) {
    setEditing(trip)
    setShowForm(true)
  }

  return (
    <div className={cls}>
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <span style={{ fontSize: 18, fontWeight: 500 }}>Trip planner</span>
        {!showForm && (
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            + New
          </button>
        )}
        {showForm && <div style={{ width: 36 }} />}
      </div>

      <div className="scrollable" style={{ padding: '16px 16px 28px', overflowX: 'hidden' }}>
        {showForm ? (
          <TripForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        ) : (
          <>
            {trips.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✈️</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>No trips planned yet</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  Tap + New to plan your first trip and track your travel budget separately.
                </div>
              </div>
            ) : (
              trips.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onEdit={handleEdit}
                  onDelete={() => setConfirmDelete(trip)}
                />
              ))
            )}
          </>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={`"${confirmDelete.name}" and all its data will be permanently deleted. This cannot be undone.`}
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