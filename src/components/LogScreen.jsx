import { useState, useEffect } from 'react'
import { TAGS, getTagById } from '../data/constants'

export default function LogScreen({ active, prev, preTag, onBack, onSave, activeTrip }) {
  const [amount, setAmount] = useState('')
  const [tag, setTag]       = useState(null)
  const [note, setNote]     = useState('')

  useEffect(() => {
    if (active) { setAmount(''); setTag(preTag || null); setNote('') }
  }, [active, preTag])

  function pressNum(n) {
    if (n === '.' && amount.includes('.')) return
    if (amount.includes('.') && amount.split('.')[1]?.length >= 2) return
    setAmount(p => (p === '' && n === '.') ? '0.' : p + n)
  }

  function del() { setAmount(p => p.length <= 1 ? '' : p.slice(0, -1)) }

  function save(isTripExpense = false) {
    if (!amount || !tag) return
    onSave({
      id:           Date.now(),
      amount:       parseFloat(amount),
      tag,
      note:         note || getTagById(tag)?.name || '',
      date:         new Date().toLocaleString('en-SG', {
        day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit',
        hour12: true,
      }),
      isTripExpense,
      tripId:       isTripExpense ? activeTrip?.id : null,
      tripCategory: isTripExpense ? tag : null,
    })
  }

  const cls = active ? 'screen' : prev ? 'screen prev' : 'screen hidden'

  return (
    <div className={cls}>

      {/* Topbar */}
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <span style={{ fontSize: 18, fontWeight: 500 }}>Log transaction</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="scrollable" style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Amount display */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 24,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Amount (S$)
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 52,
            minHeight: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            {amount
              ? <span>{amount}</span>
              : <span style={{ color: 'var(--border)' }}>0.00</span>
            }
            <div style={{
              width: 2, height: 52,
              background: 'var(--accent)',
              borderRadius: 1,
              animation: 'blink 1s step-end infinite',
            }}/>
          </div>
        </div>

        {/* Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(n => (
            <button
              key={n}
              onClick={() => n === '⌫' ? del() : pressNum(n)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                height: 56,
                fontSize: n === '⌫' ? 18 : 22,
                color: n === '⌫' ? 'var(--muted)' : 'var(--text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.1s, transform 0.1s',
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Category picker */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Category
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {TAGS.map(t => (
              <button
                key={t.id}
                onClick={() => setTag(t.id)}
                style={{
                  background: tag === t.id ? 'rgba(45,106,143,0.08)' : 'var(--surface)',
                  border: tag === t.id ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                  borderRadius: 14,
                  padding: '12px 6px',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                  <img src={t.icon} alt={t.name} width={24} height={24} />
                </div>
                <div style={{ fontSize: 11, color: tag === t.id ? 'var(--accent)' : 'var(--muted)' }}>
                  {t.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Note input */}
        <input
          placeholder="Note (e.g. Kopitiam lunch)"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 15,
            fontSize: 14,
            color: 'var(--text)',
            width: '100%',
            outline: 'none',
          }}
        />

        {/* Active trip prompt */}
        {activeTrip && (
          <div style={{
            background: 'rgba(45,106,143,0.08)',
            border: '1px solid var(--accent)',
            borderRadius: 14,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
              ✈️ {activeTrip.name} is active!
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              Is this a trip expense?
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => save(true)}
                disabled={!amount || !tag}
                style={{ flex: 1, padding: '12px', background: 'var(--accent)', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', opacity: (!amount || !tag) ? 0.4 : 1 }}
              >
                Yes, trip expense
              </button>
              <button
                onClick={() => save(false)}
                disabled={!amount || !tag}
                style={{ flex: 1, padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', opacity: (!amount || !tag) ? 0.4 : 1 }}
              >
                No, regular
              </button>
            </div>
          </div>
        )}

        {!activeTrip && (
          <div className="fab-wrap" style={{ padding: '0 0 28px' }}>
            <button className="fab" onClick={() => save(false)} disabled={!amount || !tag}>
              Save transaction
            </button>
          </div>
        )}

      </div>

      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  )
}