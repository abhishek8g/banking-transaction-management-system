import { useEffect, useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import * as txApi from '../api/transactions';
import * as accountApi from '../api/accounts';
import type { Transaction, Account } from '../types';
import GlassCard from '../components/ui/GlassCard';
import PageHero from '../components/ui/PageHero';
import VideoBackground from '../components/ui/VideoBackground';
import { BarChart2, TrendingUp, TrendingDown, ArrowLeftRight, Activity } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const Analytics3D = lazy(() => import('../components/3d/Analytics3D'));

const TT = {
  background: 'rgba(251,248,243,0.97)',
  border: '1px solid rgba(63,74,61,0.15)',
  borderRadius: 12,
  fontSize: 10,
  color: '#3F4A3D',
};

const STAT_TINTS = ['ecard-sage', 'ecard-terra', 'ecard-olive', 'ecard-olive'];

export default function Analytics() {
  const { settings } = useSettings();
  const [transactions, setTx]   = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([txApi.getTransactions(0, 50), accountApi.getAccounts(0, 20)])
      .then(([tr, ar]) => { setTx(tr.data.content); setAccounts(ar.data.content); })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const totalIncome    = transactions.filter(t => t.transactionType === 'DEPOSIT').reduce((s, t) => s + t.amount, 0);
  const totalExpenses  = transactions.filter(t => t.transactionType === 'WITHDRAWAL').reduce((s, t) => s + t.amount, 0);
  const totalTransfers = transactions.filter(t => t.transactionType === 'TRANSFER').reduce((s, t) => s + t.amount, 0);
  const totalBalance   = accounts.reduce((s, a) => s + a.balance, 0);

  const pieData = [
    { name: 'Deposits',    value: totalIncome,    color: '#9CAF88' },
    { name: 'Withdrawals', value: totalExpenses,  color: '#A9714E' },
    { name: 'Transfers',   value: totalTransfers, color: '#3F4A3D' },
  ].filter(d => d.value > 0);

  const trend = [...transactions].reverse().slice(0, 10).map((t, i) => ({
    i, v: t.transactionType === 'DEPOSIT' ? t.amount : -t.amount,
  }));

  const barData3D = [
    { label: 'Income',    value: totalIncome,    color: '#9CAF88' },
    { label: 'Expenses',  value: totalExpenses,  color: '#A9714E' },
    { label: 'Transfers', value: totalTransfers, color: '#566154' },
    { label: 'Balance',   value: totalBalance,   color: '#3F4A3D' },
  ];

  const statCards = [
    { label: 'Total Income',   value: totalIncome,    icon: TrendingUp,    color: '#7A8F68', bg: 'linear-gradient(135deg,#9CAF88,#7A8F68)' },
    { label: 'Total Expenses', value: totalExpenses,  icon: TrendingDown,  color: '#7D5239', bg: 'linear-gradient(135deg,#A9714E,#C4926D)' },
    { label: 'Transfers',      value: totalTransfers, icon: ArrowLeftRight, color: '#2B3329', bg: 'linear-gradient(135deg,#3F4A3D,#566154)' },
    { label: 'Net Balance',    value: totalBalance,   icon: Activity,      color: '#3F4A3D', bg: 'linear-gradient(135deg,#566154,#3F4A3D)' },
  ];

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F0E6' }}>
      <div className="w-10 h-10 rounded-full animate-breathe" style={{ background: 'linear-gradient(135deg,#9CAF88,#7A8F68)' }} />
    </div>
  );

  return (
    <div className="min-h-screen relative animate-page-in zone-mixed" style={{ background: '#F5F0E6' }}>
      <VideoBackground page="analytics" className="fixed" />
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-6xl mx-auto">
        <PageHero title="Financial|Analytics" subtitle="Your complete financial activity, visualized in 3D"
          badge="Data Observatory" character="analyst" mood="wave" page="analytics" minHeight="165px" />

        {/* 3D Bar Chart */}
        {!settings.disable3D && (
          <GlassCard className="overflow-hidden ecard-sage" hover={false}>
            <div className="p-4" style={{ borderBottom: '1px solid rgba(63,74,61,0.08)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: '#3F4A3D' }}>
                <BarChart2 size={14} style={{ color: '#A9714E' }} /> 3D Financial Overview
              </h2>
            </div>
            <div className="h-56">
              <Suspense fallback={
                <div className="h-full flex items-center justify-center text-xs" style={{ color: '#9A9285' }}>
                  Loading 3D charts...
                </div>
              }>
                <Analytics3D data={barData3D} />
              </Suspense>
            </div>
          </GlassCard>
        )}

        {/* Stat cards — alternating tints */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <GlassCard className={`p-4 ${STAT_TINTS[i]}`} hover={false}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                  style={{ background: bg, boxShadow: `0 3px 10px ${color}30` }}>
                  <Icon size={14} style={{ color: '#F5F0E6' }} />
                </div>
                <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: '#9A9285' }}>{label}</p>
                <p className="text-base font-black mt-0.5" style={{ color }}>{fmt(value)}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-5">
          <GlassCard className="p-5 lg:col-span-2 ecard-sage" hover={false}>
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#3F4A3D' }}>
              <Activity size={14} style={{ color: '#9CAF88' }} /> Transaction Trend
            </h2>
            {trend.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9CAF88" stopOpacity={0.30} />
                        <stop offset="100%" stopColor="#9CAF88" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,74,61,0.07)" />
                    <XAxis dataKey="i" hide />
                    <YAxis tick={{ fill: '#9A9285', fontSize: 10 }} axisLine={false} tickLine={false}
                      tickFormatter={v => `₹${Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + 'K' : v}`} />
                    <Tooltip contentStyle={TT}
                      formatter={(v: number) => [`₹${Math.abs(v).toLocaleString('en-IN')}`, 'Amount']}
                      labelFormatter={() => ''} />
                    <Area type="monotone" dataKey="v" stroke="#9CAF88" strokeWidth={2} fill="url(#eg)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-center py-16" style={{ color: '#C4B8A8' }}>No transaction data yet</p>
            )}
          </GlassCard>

          <GlassCard className="p-5 ecard-terra" hover={false}>
            <h2 className="text-sm font-bold mb-4" style={{ color: '#3F4A3D' }}>Breakdown</h2>
            {pieData.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={70} paddingAngle={4} dataKey="value">
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} opacity={0.85} />)}
                    </Pie>
                    <Tooltip contentStyle={TT} formatter={(v: number) => [fmt(v), '']} />
                    <Legend iconType="circle" iconSize={7}
                      formatter={v => <span style={{ color: '#8A9688', fontSize: 10 }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-center py-16" style={{ color: '#C4B8A8' }}>No data</p>
            )}
          </GlassCard>
        </div>

        {/* Account balances */}
        {accounts.length > 0 && (
          <GlassCard className="p-5 ecard-olive" hover={false}>
            <h2 className="text-sm font-bold mb-4" style={{ color: '#3F4A3D' }}>Account Balances</h2>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accounts.map(a => ({ name: '…' + a.accountNumber.slice(-4), bal: a.balance }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,74,61,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: '#9A9285', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9A9285', fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={TT} formatter={(v: number) => [fmt(v), 'Balance']} />
                  <Bar dataKey="bal" radius={[5, 5, 0, 0]}>
                    {accounts.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? '#9CAF88' : '#A9714E'} opacity={0.80} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
