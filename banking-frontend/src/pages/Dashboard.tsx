import { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import * as accountApi from '../api/accounts';
import * as txApi from '../api/transactions';
import type { Account, Transaction } from '../types';
import GlassCard from '../components/ui/GlassCard';
import TransactionModal from '../components/ui/TransactionModal';
import FloatingBubble from '../components/ui/FloatingBubble';
import Onboarding from '../components/ui/Onboarding';
import VideoBackground from '../components/ui/VideoBackground';
import { TrendingUp, TrendingDown, ArrowLeftRight, CreditCard, Shield, Leaf, CheckCircle, BarChart2, Plus, ArrowRight, Wallet, Activity, Eye } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import toast from 'react-hot-toast';

const Scene3D  = lazy(() => import('../components/3d/Scene3D'));
const OrbScene = lazy(() => import('../components/3d/OrbScene'));

type TxType   = 'deposit'|'withdraw'|'transfer';
type CharMood = 'idle'|'success'|'error'|'point'|'wave';

const COLORS = { sage:'#9CAF88', terra:'#A9714E', olive:'#3F4A3D', beige:'#F5F0E6', sageL:'#B5C4A4', terraL:'#C4926D' };

function StatCard({ label, value, icon:Icon, color, bg, delay, statClass }: any) {
  return (
    <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay }}>
      <GlassCard className={`p-5 ${statClass || ''}`} hover={false}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 animate-float"
          style={{ background:bg, boxShadow:`0 4px 14px ${color}40`, animationDelay:`${delay}s` }}>
          <Icon size={17} style={{ color:'#F5F0E6' }} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color:'#9A9285' }}>{label}</p>
        <p className="text-xl font-black mt-0.5 animate-count-up" style={{ color }}>{value}</p>
      </GlassCard>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user }     = useAuth();
  const { settings } = useSettings();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTx]   = useState<Transaction[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState<{ type:TxType; accountId:number }|null>(null);
  const [charMood, setCharMood] = useState<CharMood>('wave');
  const [selectedAcc, setSelAcc]= useState<Account|null>(null);
  const [bubble, setBubble]     = useState('');

  const fetchData = async () => {
    try {
      const [ar, tr] = await Promise.all([accountApi.getAccounts(0,20), txApi.getTransactions(0,10)]);
      setAccounts(ar.data.content); setTx(tr.data.content);
      if (ar.data.content.length>0) setSelAcc(ar.data.content[0]);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    if (!loading) { setBubble(`Welcome back, ${user?.email?.split('@')[0]}! 🌿`); setTimeout(() => setBubble(''), 4500); }
  }, [loading]);

  const totalBalance = accounts.reduce((s,a) => s+(a.balance||0), 0);
  const income       = transactions.filter(t => t.transactionType==='DEPOSIT').reduce((s,t) => s+t.amount, 0);
  const expenses     = transactions.filter(t => t.transactionType==='WITHDRAWAL').reduce((s,t) => s+t.amount, 0);
  const transfers    = transactions.filter(t => t.transactionType==='TRANSFER').reduce((s,t) => s+t.amount, 0);
  const chartData    = [...transactions].reverse().slice(0,8).map((t,i) => ({ i, v: t.transactionType==='DEPOSIT'?t.amount:-t.amount }));
  const fmt = (n:number) => `₹${n.toLocaleString('en-IN',{minimumFractionDigits:2})}`;

  const openModal = (type:TxType, mood:CharMood) => {
    if (!selectedAcc) { toast.error('Select an account first'); return; }
    setCharMood(mood); setModal({ type, accountId:selectedAcc.id });
  };
  const handleSuccess = (type:TxType) => {
    setCharMood('success'); setModal(null); fetchData();
    setBubble('Transaction completed! 🌿');
    setTimeout(() => { setCharMood('idle'); setBubble(''); }, 3500);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'#F5F0E6' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-breathe"
          style={{ background:'linear-gradient(135deg,#9CAF88,#7A8F68)', boxShadow:'0 4px 16px rgba(156,175,136,0.40)' }} />
        <p className="text-sm" style={{ color:'#8A9688' }}>Loading your banking space...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative zone-sage" style={{ background:'#F5F0E6' }}>
      <Onboarding />
      <VideoBackground page="dashboard" className="fixed" />

      <div className="relative z-10 p-5 lg:p-7 space-y-5 animate-page-in">

        {/* ── HERO ── */}
        <div className="relative rounded-[28px] overflow-hidden" style={{ minHeight:280, border:'1px solid rgba(63,74,61,0.12)', boxShadow:'0 8px 40px rgba(63,74,61,0.10), inset 0 1px 0 rgba(255,255,255,0.70)' }}>
          <VideoBackground page="dashboard" />
          {!settings.disable3D && (
            <div className="absolute inset-0 opacity-55">
              <Suspense fallback={null}><Scene3D mood={charMood} character="assistant" reduceMotion={settings.reduceMotion} /></Suspense>
            </div>
          )}
          <div className="absolute top-5 right-5 z-20"><FloatingBubble visible={!!bubble} variant="success">{bubble}</FloatingBubble></div>

          <div className="relative z-10 p-7 lg:p-10 flex flex-col lg:flex-row items-start justify-between gap-6">
            <div>
              <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="ebadge mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9CAF88] animate-breathe inline-block" />
                Calm. Secure. Intelligent Banking.
              </motion.div>
              <motion.h1 initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.06 }}
                className="text-3xl lg:text-4xl font-black leading-tight" style={{ color:'#3F4A3D' }}>
                Your Money.<br /><span className="text-gradient-terra">Your Space.</span>
              </motion.h1>
              <p className="mt-2 text-sm max-w-md" style={{ color:'#8A9688' }}>
                Secure financial management in a calm, intelligent digital environment.
              </p>
              <div className="flex gap-3 mt-5 flex-wrap">
                <motion.button whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
                  onClick={() => openModal('deposit','point')} className="ebtn ebtn-terra flex items-center gap-2">
                  <TrendingUp size={14}/> Deposit
                </motion.button>
                <motion.button whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
                  onClick={() => openModal('transfer','point')} className="ebtn ebtn-ghost flex items-center gap-2">
                  <ArrowLeftRight size={14}/> Transfer
                </motion.button>
              </div>
            </div>

            {/* Balance card */}
            <motion.div initial={{ opacity:0, scale:0.90 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.14 }}
              className="ecard ecard-sage p-6 min-w-[220px] flex-shrink-0 animate-float-slow">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-7 h-7 rounded-xl flex-shrink-0" style={{ background:'linear-gradient(135deg,#9CAF88,#7A8F68)', boxShadow:'0 3px 10px rgba(156,175,136,0.45)' }} />
                <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color:'#9A9285' }}>Total Balance</p>
              </div>
              <p className="text-3xl font-black animate-count-up" style={{ color:'#3F4A3D' }}>{fmt(totalBalance)}</p>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[11px]"><span style={{ color:'#9A9285' }}>Available</span><span className="font-bold" style={{ color:'#7A8F68' }}>{fmt(totalBalance*0.94)}</span></div>
                <div className="flex justify-between text-[11px]"><span style={{ color:'#9A9285' }}>Accounts</span><span className="font-bold" style={{ color:'#3F4A3D' }}>{accounts.length}</span></div>
              </div>
              <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(63,74,61,0.10)' }}>
                <motion.div initial={{ width:0 }} animate={{ width:'94%' }} transition={{ delay:0.7, duration:1.3 }}
                  className="h-full rounded-full" style={{ background:'linear-gradient(90deg,#9CAF88,#A9714E)' }} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Balance"   value={fmt(totalBalance)} icon={Wallet}        color={COLORS.olive}  bg="linear-gradient(135deg,#3F4A3D,#566154)" delay={0}    statClass="stat-olive" />
          <StatCard label="Income"    value={fmt(income)}       icon={TrendingUp}    color={COLORS.sage}   bg="linear-gradient(135deg,#9CAF88,#7A8F68)" delay={0.07}  statClass="stat-sage"  />
          <StatCard label="Expenses"  value={fmt(expenses)}     icon={TrendingDown}  color={COLORS.terra}  bg="linear-gradient(135deg,#A9714E,#C4926D)" delay={0.14}  statClass="stat-terra" />
          <StatCard label="Transfers" value={fmt(transfers)}    icon={ArrowLeftRight} color={COLORS.olive} bg="linear-gradient(135deg,#566154,#3F4A3D)" delay={0.21}  statClass="stat-olive" />
        </div>

        {/* ── 3-COL ── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Accounts + Actions */}
          <div className="space-y-4">
            <GlassCard className="p-5 accent-band-sage" hover={false}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold flex items-center gap-2" style={{ color:'#3F4A3D' }}>
                  <CreditCard size={14} style={{ color:COLORS.sage }}/> Accounts
                </h2>
                <Link to="/accounts/new" className="text-[11px] font-bold flex items-center gap-1" style={{ color:COLORS.terra }}>
                  <Plus size={11}/> New
                </Link>
              </div>
              {accounts.length===0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-2xl mx-auto mb-3 animate-breathe" style={{ background:'linear-gradient(135deg,#9CAF88,#7A8F68)' }} />
                  <p className="text-xs mb-3" style={{ color:'#9A9285' }}>No accounts yet</p>
                  <Link to="/accounts/new" className="ebadge text-xs"><Plus size={11}/> Open Account</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {accounts.slice(0,4).map(acc => {
                    const isSel = selectedAcc?.id===acc.id;
                    const isSav = acc.accountType==='SAVINGS';
                    return (
                      <motion.div key={acc.id} whileHover={{ x:3 }}
                        onClick={() => { setSelAcc(acc); setCharMood('point'); setTimeout(() => setCharMood('idle'),2000); }}
                        className="flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all"
                        style={isSel
                          ? { background:'rgba(156,175,136,0.18)', border:'1px solid rgba(156,175,136,0.35)' }
                          : { background:'rgba(255,255,255,0.50)', border:'1px solid rgba(63,74,61,0.08)' }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[9px] font-black flex-shrink-0"
                          style={isSav ? { background:'linear-gradient(135deg,#9CAF88,#7A8F68)', color:'#F5F0E6' } : { background:'linear-gradient(135deg,#A9714E,#C4926D)', color:'#F5F0E6' }}>
                          {isSav?'S':'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold truncate font-mono" style={{ color:'#3F4A3D' }}>{acc.accountNumber}</p>
                          <p className="text-[9px]" style={{ color:'#9A9285' }}>{acc.accountType}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[11px] font-black" style={{ color:'#7A8F68' }}>{fmt(acc.balance)}</p>
                          <span className={`echip text-[8px] ${acc.status==='ACTIVE'?'echip-success':acc.status==='BLOCKED'?'echip-danger':'echip-info'}`}>{acc.status}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-5 accent-band-terra" hover={false}>
              <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color:'#3F4A3D' }}>
                <Leaf size={14} style={{ color:COLORS.sage }}/> Quick Actions
              </h2>
              {selectedAcc && <p className="text-[9px] font-mono mb-2.5 truncate" style={{ color:'#9A9285' }}>▶ {selectedAcc.accountNumber}</p>}
              <div className="space-y-2">
                {[
                  { type:'deposit'  as TxType, icon:TrendingUp,    label:'Deposit',  mood:'point' as CharMood, bg:'linear-gradient(135deg,#9CAF88,#7A8F68)' },
                  { type:'withdraw' as TxType, icon:TrendingDown,  label:'Withdraw', mood:'wave'  as CharMood, bg:'linear-gradient(135deg,#A9714E,#C4926D)' },
                  { type:'transfer' as TxType, icon:ArrowLeftRight, label:'Transfer', mood:'point' as CharMood, bg:'linear-gradient(135deg,#3F4A3D,#566154)' },
                ].map(({ type, icon:Icon, label, mood, bg }) => (
                  <motion.button key={type} whileHover={{ x:4, y:-1 }} whileTap={{ y:0 }}
                    onClick={() => openModal(type,mood)}
                    disabled={!selectedAcc || selectedAcc.status!=='ACTIVE'}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
                    style={{ background:bg, boxShadow:'0 2px 10px rgba(63,74,61,0.15)' }}>
                    <Icon size={14} className="text-white/80"/>
                    <span>{label}</span>
                    <ArrowRight size={12} className="ml-auto opacity-50 group-hover:opacity-90 transition-opacity"/>
                  </motion.button>
                ))}
                <Link to="/transactions">
                  <motion.div whileHover={{ x:4, y:-1 }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold cursor-pointer group"
                    style={{ background:'rgba(255,255,255,0.60)', border:'1px solid rgba(63,74,61,0.10)', color:'#566154' }}>
                    <Activity size={14}/><span>History</span>
                    <ArrowRight size={12} className="ml-auto opacity-40 group-hover:opacity-70 transition-opacity"/>
                  </motion.div>
                </Link>
              </div>
            </GlassCard>
          </div>

          {/* 3D Orb + chart */}
          <GlassCard className="p-5 ecard-sage" hover={false}>
            <h2 className="text-sm font-bold mb-1 flex items-center gap-2" style={{ color:'#3F4A3D' }}>
              <BarChart2 size={14} style={{ color:COLORS.terra }}/> Financial Overview
            </h2>
            <p className="text-[10px] mb-2" style={{ color:'#9A9285' }}>Live 3D visualization</p>
            <div className="h-[265px]">
              {settings.disable3D ? (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl animate-breathe" style={{ background:'linear-gradient(135deg,#9CAF88,#7A8F68)' }} />
                  <span className="text-xs" style={{ color:'#9A9285' }}>3D disabled</span>
                </div>
              ) : (
                <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="w-10 h-10 rounded-2xl animate-breathe" style={{ background:'linear-gradient(135deg,#9CAF88,#7A8F68)' }}/></div>}>
                  <OrbScene balance={totalBalance} income={income} expenses={expenses} transfers={transfers} />
                </Suspense>
              )}
            </div>
            <div className="mt-2 h-16">
              {chartData.length>0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9CAF88" stopOpacity={0.35}/>
                        <stop offset="100%" stopColor="#9CAF88" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="i" hide />
                    <Tooltip contentStyle={{ background:'#FBF8F3', border:'1px solid rgba(63,74,61,0.15)', borderRadius:12, fontSize:10, color:'#3F4A3D' }}
                      formatter={(v:number) => [`₹${Math.abs(v).toLocaleString('en-IN')}`,'']} labelFormatter={() => ''} />
                    <Area type="monotone" dataKey="v" stroke="#9CAF88" strokeWidth={2} fill="url(#eg)" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              ) : <p className="text-[11px] text-center pt-4" style={{ color:'#C4B8A8' }}>No activity yet</p>}
            </div>
          </GlassCard>

          {/* Transactions */}
          <GlassCard className="p-5 accent-band-olive" hover={false}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold flex items-center gap-2" style={{ color:'#3F4A3D' }}>
                <Activity size={14} style={{ color:COLORS.sage }}/> Recent
              </h2>
              <Link to="/transactions" className="text-[11px] font-bold flex items-center gap-1" style={{ color:COLORS.terra }}>
                All <ArrowRight size={10}/>
              </Link>
            </div>
            {transactions.length===0 ? (
              <div className="text-center py-10 text-xs" style={{ color:'#9A9285' }}>No transactions yet</div>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0,8).map((tx,i) => {
                  const isD = tx.transactionType==='DEPOSIT';
                  const isT = tx.transactionType==='TRANSFER';
                  const c = isD ? COLORS.sage : isT ? COLORS.olive : COLORS.terra;
                  const bg = isD ? 'linear-gradient(135deg,#9CAF88,#7A8F68)' : isT ? 'linear-gradient(135deg,#3F4A3D,#566154)' : 'linear-gradient(135deg,#A9714E,#C4926D)';
                  return (
                    <motion.div key={tx.id} initial={{ opacity:0,x:8 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.04 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-2xl transition-all"
                      style={{ background:'rgba(255,255,255,0.55)', border:'1px solid rgba(63,74,61,0.07)' }}
                      whileHover={{ background:'rgba(156,175,136,0.12)', borderColor:'rgba(156,175,136,0.25)' } as any}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background:bg, boxShadow:`0 2px 8px ${c}35` }}>
                        {isD  && <TrendingUp    size={12} style={{ color:'#F5F0E6' }}/>}
                        {!isD && !isT && <TrendingDown size={12} style={{ color:'#F5F0E6' }}/>}
                        {isT  && <ArrowLeftRight size={12} style={{ color:'#F5F0E6' }}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold capitalize" style={{ color:'#3F4A3D' }}>{tx.transactionType.toLowerCase()}</p>
                        <p className="text-[9px] font-mono truncate" style={{ color:'#9A9285' }}>{tx.transactionReference?.slice(0,12)}…</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] font-black" style={{ color:c }}>{isD?'+':'-'}{fmt(tx.amount)}</p>
                        <p className="text-[9px]" style={{ color:'#9A9285' }}>{new Date(tx.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            <Link to="/transactions"
              className="flex items-center justify-center gap-1 mt-3 py-2.5 text-[11px] font-bold rounded-2xl transition-all"
              style={{ border:'1px solid rgba(63,74,61,0.12)', color:'#9A9285' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color=COLORS.terra; (e.currentTarget as HTMLElement).style.borderColor='rgba(169,113,78,0.30)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='#9A9285'; (e.currentTarget as HTMLElement).style.borderColor='rgba(63,74,61,0.12)'; }}>
              Full History <ArrowRight size={11}/>
            </Link>
          </GlassCard>
        </div>

        {/* ── SECURITY ── */}
        <GlassCard className="p-5" hover={false}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex-shrink-0" style={{ background:'linear-gradient(135deg,#3F4A3D,#566154)', boxShadow:'0 4px 14px rgba(63,74,61,0.30)' }}>
                <Shield size={18} style={{ color:'#F5F0E6' }} className="m-auto mt-2.5"/>
              </div>
              <div>
                <h2 className="text-sm font-bold" style={{ color:'#3F4A3D' }}>Security Status</h2>
                <p className="text-[11px]" style={{ color:'#9A9285' }}>All protection layers active</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['JWT Auth','RBAC','BCrypt','API Shield'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-[10px] echip echip-success px-2.5 py-1">
                  <CheckCircle size={10}/> {item}
                </div>
              ))}
            </div>
            <Link to="/security" className="flex items-center gap-1.5 text-xs font-bold flex-shrink-0" style={{ color:COLORS.olive }}>
              <Eye size={13}/> Security Center
            </Link>
          </div>
        </GlassCard>

        {/* ── WHY DIFFERENT ── */}
        <div>
          <h2 className="text-base font-black mb-1" style={{ color:'#3F4A3D' }}>Why This Banking Experience Is Different</h2>
          <p className="text-xs mb-4" style={{ color:'#9A9285' }}>Four pillars that define this platform</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { icon:Eye,          title:'See Your Money',               bg:'linear-gradient(135deg,#9CAF88,#7A8F68)', color:COLORS.sage,  glow:'sage'  as const, desc:'Financial data becomes interactive 3D insights in real time.' },
              { icon:Activity,     title:'Understand Every Transaction', bg:'linear-gradient(135deg,#A9714E,#C4926D)', color:COLORS.terra, glow:'terra' as const, desc:'Every deposit, withdrawal, and transfer organized into a clear timeline.' },
              { icon:Shield,       title:'Security First',               bg:'linear-gradient(135deg,#3F4A3D,#566154)', color:COLORS.olive, glow:'olive' as const, desc:'JWT auth, RBAC, BCrypt, and Spring Security protect every operation.' },
              { icon:Leaf,         title:'Real-Time Interaction',        bg:'linear-gradient(135deg,#9CAF88,#A9714E)', color:COLORS.sage,  glow:'sage'  as const, desc:'Directly connected to the banking backend — updates on every action.' },
            ].map(({ icon:Icon, title, bg, color, glow, desc }, i) => (
              <motion.div key={title} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1+i*0.07 }}>
                <GlassCard className="p-5 h-full" glow={glow}
                  onClick={() => { setCharMood('point'); setTimeout(() => setCharMood('idle'),2000); }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background:bg, boxShadow:`0 4px 12px ${color}40` }}>
                    <Icon size={17} style={{ color:'#F5F0E6' }}/>
                  </div>
                  <h3 className="text-xs font-black mb-1.5" style={{ color:'#3F4A3D' }}>{title}</h3>
                  <p className="text-[11px] leading-relaxed" style={{ color:'#9A9285' }}>{desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {modal && (
        <TransactionModal type={modal.type} accountId={modal.accountId}
          onClose={() => { setModal(null); setCharMood('idle'); }}
          onSuccess={handleSuccess} />
      )}
    </div>
  );
}
