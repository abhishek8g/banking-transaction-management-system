import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
  LayoutDashboard, CreditCard, History, ArrowLeftRight,
  TrendingUp, TrendingDown, Shield, User, Settings,
  LogOut, Building2, Users, BarChart2, HelpCircle,
  Leaf, Sun, Moon,
} from 'lucide-react';
import { useState } from 'react';

// ── Palette ──────────────────────────────────────────────────────
const C = {
  olive:   '#3F4A3D',
  oliveMd: '#4A5547',
  oliveLt: '#566154',
  sage:    '#9CAF88',
  sageLt:  '#B5C4A4',
  terra:   '#A9714E',
  beige:   '#F5F0E6',
  beigeD:  '#EDE6D6',
};

const customerLinks = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard',     accent: C.sage  },
  { to: '/accounts',     icon: CreditCard,       label: 'Accounts',     accent: C.sageLt },
  { to: '/transactions', icon: History,          label: 'Transactions', accent: C.beige },
  { to: '/transfer',     icon: ArrowLeftRight,   label: 'Transfer',     accent: C.terra },
  { to: '/deposit',      icon: TrendingUp,       label: 'Deposit',      accent: C.sage  },
  { to: '/withdraw',     icon: TrendingDown,     label: 'Withdraw',     accent: C.terra },
  { to: '/analytics',    icon: BarChart2,        label: 'Analytics',    accent: C.sage  },
  { to: '/security',     icon: Shield,           label: 'Security',     accent: C.beige },
  { to: '/profile',      icon: User,             label: 'Profile',      accent: C.sage  },
  { to: '/settings',     icon: Settings,         label: 'Settings',     accent: C.beigeD },
  { to: '/help',         icon: HelpCircle,       label: 'Help',         accent: C.sage  },
];

const adminLinks = [
  { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard',    accent: C.sage  },
  { to: '/admin/users',        icon: Users,            label: 'Users',       accent: C.terra },
  { to: '/admin/accounts',     icon: CreditCard,       label: 'Accounts',   accent: C.sage  },
  { to: '/admin/transactions', icon: History,          label: 'Transactions', accent: C.beige },
  { to: '/analytics',          icon: BarChart2,        label: 'Analytics',  accent: C.sage  },
  { to: '/security',           icon: Shield,           label: 'Security',   accent: C.beige },
  { to: '/settings',           icon: Settings,         label: 'Settings',   accent: C.beigeD },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const { settings, toggle } = useSettings();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : customerLinks;
  const [evening, setEvening] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const toggleEvening = () => {
    const next = !evening;
    setEvening(next);
    document.documentElement.classList.toggle('earthy-evening', next);
  };

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 28 }}
      className="flex flex-col h-full w-[220px] min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${C.olive} 0%, ${C.oliveMd} 60%, #424E40 100%)`,
        borderRight: `1px solid rgba(245,240,230,0.10)`,
        boxShadow: '3px 0 24px rgba(63,74,61,0.35)',
      }}
    >
      {/* Subtle inner texture — top sage haze */}
      <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(156,175,136,0.14) 0%, transparent 65%)' }} />

      {/* Animated terracotta edge light */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] overflow-hidden">
        <motion.div
          animate={{ top: ['0%', '78%', '0%'] }}
          transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
          className="absolute left-0 w-full"
          style={{
            height: '22%',
            background: `linear-gradient(180deg, transparent, ${C.terra}, ${C.sage}, transparent)`,
            boxShadow: `0 0 10px rgba(169,113,78,0.55)`,
          }}
        />
      </div>

      {/* ── LOGO ── */}
      <div className="flex items-center gap-2.5 px-4 py-4"
        style={{ borderBottom: 'rgba(245,240,230,0.12) 1px solid' }}>
        {/* Logo icon */}
        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: C.sage, boxShadow: '0 3px 12px rgba(156,175,136,0.45)' }}>
          <Building2 size={15} style={{ color: C.beige }} />
        </motion.div>

        <div className="min-w-0">
          <p className="font-black text-[13px] truncate" style={{ color: C.beige }}>BankingApp</p>
          <p className="text-[8px] font-mono truncate" style={{ color: `${C.sage}CC` }}>Digital Finance</p>
        </div>

        {/* Role badge */}
        <span className="text-[8px] px-1.5 py-0.5 rounded-full font-black ml-auto flex-shrink-0"
          style={{ background: `${C.sage}33`, color: C.beige, border: `1px solid ${C.sage}55` }}>
          {isAdmin ? 'ADM' : 'USR'}
        </span>
      </div>

      {/* ── NAV ── */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon: Icon, label, accent }) => (
          <NavLink key={to} to={to} end={to.endsWith('/dashboard')}>
            {({ isActive }) => (
              <motion.div
                whileHover={!isActive ? { x: 3, y: -1 } : {}}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold relative group cursor-pointer transition-all duration-200"
                style={isActive ? {
                  /* Active: warm beige glass card inside olive sidebar */
                  background: `linear-gradient(135deg, ${C.beige} 0%, ${C.beigeD} 100%)`,
                  border: `1px solid rgba(245,240,230,0.60)`,
                  color: C.olive,
                  boxShadow: `0 3px 14px rgba(63,74,61,0.30), inset 0 1px 0 rgba(255,255,255,0.70)`,
                } : {
                  /* Inactive: visible on dark sidebar */
                  color: `${C.beige}CC`,
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = `rgba(156,175,136,0.20)`;
                    (e.currentTarget as HTMLElement).style.color = C.beige;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px rgba(156,175,136,0.20)`;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = `${C.beige}CC`;
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }
                }}
              >
                {/* Left pill indicator */}
                {isActive && (
                  <motion.div layoutId="activePill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                    style={{ width: 3, height: 20, background: C.terra, boxShadow: `0 0 8px rgba(169,113,78,0.65)` }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 6, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={isActive
                    ? { background: `rgba(63,74,61,0.10)` }
                    : { background: 'rgba(245,240,230,0.08)' }}>
                  <Icon size={13} style={{ color: isActive ? C.olive : C.sage }} />
                </motion.div>

                <span className="flex-1 truncate">{label}</span>

                {/* Right accent dot */}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: C.terra, boxShadow: `0 0 6px rgba(169,113,78,0.70)` }} />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── BOTTOM ── */}
      <div className="px-2.5 py-3 space-y-1.5"
        style={{ borderTop: '1px solid rgba(245,240,230,0.10)' }}>

        {/* User profile chip */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: `rgba(156,175,136,0.18)`, border: `1px solid rgba(156,175,136,0.25)` }}>
          <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black flex-shrink-0"
            style={{ background: C.sage, color: C.olive, boxShadow: '0 2px 8px rgba(156,175,136,0.40)' }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold truncate" style={{ color: C.beige }}>{user?.email?.split('@')[0]}</p>
            <p className="text-[9px] truncate" style={{ color: C.sage }}>{user?.role}</p>
          </div>
          <motion.div animate={{ rotate: [0, 8, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <Leaf size={11} style={{ color: `${C.beige}99` }} />
          </motion.div>
        </div>

        {/* Theme toggle */}
        <motion.button whileHover={{ backgroundColor: `rgba(169,113,78,0.18)` }}
          onClick={toggleEvening}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-200"
          style={{ color: C.sage, background: `rgba(156,175,136,0.10)`, border: '1px solid transparent' }}>
          <motion.div animate={{ rotate: evening ? 180 : 0 }} transition={{ duration: 0.5 }}>
            {evening ? <Sun size={12} style={{ color: C.terra }} /> : <Moon size={12} style={{ color: C.sage }} />}
          </motion.div>
          <span style={{ color: C.beige }}>{evening ? 'Earthy Light' : 'Earthy Evening'}</span>
        </motion.button>

        {/* Sign out */}
        <motion.button whileHover={{ backgroundColor: `rgba(169,113,78,0.12)` }}
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-200"
          style={{ color: `${C.beige}AA`, border: '1px solid transparent' }}>
          <LogOut size={13} style={{ color: C.sage }} />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
