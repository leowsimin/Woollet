import homeIcon    from "../assets/home-icon.svg"
import historyIcon from "../assets/history-icon.svg"
import planIcon    from "../assets/plan-icon.svg"

export default function NavBar({ active, onTab }) {
  const tabs = [
    { id: 'home',    icon: homeIcon,    label: 'Home'    },
    { id: 'history', icon: historyIcon, label: 'History' },
    { id: 'plan',    icon: planIcon,    label: 'Plan'    },
  ]

  return (
    <div className="nav">
      {tabs.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            className="nav-btn"
            onClick={() => onTab(tab.id)}
            style={{
              background: 'transparent',
              borderRadius:  12,
              padding:       '8px 6px',
              opacity:       isActive ? 1 : 0.6,
              transition:    'all 0.2s ease',
              border:        'none',
            }}
          >
            <img
              src={tab.icon}
              alt={tab.label}
              width={22}
              height={22}
              style={{ display: 'block', margin: '0 auto' }}
            />
            <span
              className="nav-label"
              style={{
                color:      isActive ? 'var(--text)' : 'var(--muted)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}