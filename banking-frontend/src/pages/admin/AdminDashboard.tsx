import { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as adminApi from '../../api/admin';
import * as accountApi from '../../api/accounts';
import * as txApi from '../../api/transactions';
import type { UserResponse, Account, Transaction } from '../../types';
import GlassCard from '../../components/ui/GlassCard';
import VideoBackground from '../../components/ui/VideoBackground';
import { Users, CreditCard, Activity, Shield, TrendingUp, TrendingDown, ArrowLeftRight, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import toast from 'react-hot-toast';

const Scene3D = lazy(() => import('../../components/3d/Scene3D'));
const TT = { background:'#FBF8F3', border:'1px solid rgba(63,74,61,0.15)', borderRadius:12, fontSize:10, color:'#3F4A3D' };

export default function AdminDashboard() {
  const [users, setUsers]               = useState<UserResponse[]>([]);
  const [accounts, setAccounts]         = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getAllUsers(0,5),accountApi.getAccounts(0,5),txApi.getTransactions(0,8)])
      .then(([u,a,t]) => { setUsers(u.data.content); setAccounts(a.data.content); setTransactions(t.data.content); })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n:number) => `₹${n.toLocaleString('en-IN',{minimumFractionDigits:0})}`;
  const totalBalance  = accounts.reduce((s,a)=>s+(a.balance||0),0);
  const blockedCount  = accounts.filter(a=>a.status==='BLOCKED').length;
  const txVolume      = transactions.reduce((s,t)=>s+t.amount,0);

  const chartData = [
    {name:'Deposits',    value:transactions.filter(t=>t.transactionType==='DEPOSIT').reduce((s,t)=>s+t.amount,0),    color:'#9CAF88'},
    {name:'Withdrawals', value:transactions.filter(t=>t.transactionType==='WITHDRAWAL').reduce((s,t)=>s+t.amount,0), color:'#A9714E'},
    {name:'Transfers',   value:transactions.filter(t=>t.transactionType==='TRANSFER').reduce((s,t)=>s+t.amount,0),   color:'#3F4A3D'},
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#F5F0E6'}}><div className="w-10 h-10 rounded-full animate-breathe" style={{background:'linear-gradient(135deg,#9CAF88,#7A8F68)'}}/></div>;

  return (
    <div className="min-h-screen relative animate-page-in zone-olive" style={{background:'#F5F0E6'}}>
      <VideoBackground page="admin" className="fixed"/>
      <div className="relative z-10 p-5 lg:p-7 space-y-5">

        {/* Hero */}
        <div className="relative rounded-[28px] overflow-hidden min-h-[220px] hero-dark">
          <VideoBackground page="admin"/>
          <div className="absolute inset-0 opacity-50">
            <Suspense fallback={null}><Scene3D mood="point" character="admin" reduceMotion={false}/></Suspense>
          </div>
          <div className="relative z-10 p-8 lg:p-10 flex flex-col lg:flex-row items-start justify-between gap-4">
            <div>
              <div className="ebadge mb-4"><span className="w-1.5 h-1.5 rounded-full bg-[#A9714E] animate-breathe inline-block"/> Administrator Control Centre</div>
              <h1 className="text-3xl font-black" style={{color:'#3F4A3D'}}>Admin <span className="text-gradient-terra">Dashboard</span></h1>
              <p className="text-sm mt-1" style={{color:'#8A9688'}}>Full system visibility and control</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/users" className="ebtn ebtn-olive flex items-center gap-2 text-sm"><Users size={14}/> Users</Link>
              <Link to="/admin/accounts" className="ebtn ebtn-ghost flex items-center gap-2 text-sm"><CreditCard size={14}/> Accounts</Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {label:'Total Users',     value:users.length+'+',   icon:Users,   color:'#7A8F68', bg:'linear-gradient(135deg,#9CAF88,#7A8F68)'},
            {label:'Total Accounts',  value:accounts.length+'+', icon:CreditCard, color:'#3F4A3D', bg:'linear-gradient(135deg,#3F4A3D,#566154)'},
            {label:'Blocked Accounts',value:String(blockedCount),icon:Shield,  color:'#7D5239', bg:'linear-gradient(135deg,#A9714E,#C4926D)'},
            {label:'Tx Volume',       value:fmt(txVolume),      icon:Activity, color:'#2B3329', bg:'linear-gradient(135deg,#566154,#3F4A3D)'},
          ].map(({label,value,icon:Icon,color,bg},i) => (
            <motion.div key={label} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
              <GlassCard className="p-4" hover={false}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{background:bg,boxShadow:`0 3px 10px ${color}30`}}>
                  <Icon size={15} style={{color:'#F5F0E6'}}/>
                </div>
                <p className="text-[10px] uppercase tracking-wider font-bold" style={{color:'#9A9285'}}>{label}</p>
                <p className="text-xl font-black mt-0.5" style={{color}}>{value}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <GlassCard className="p-5" hover={false}>
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2" style={{color:'#3F4A3D'}}><Activity size={14} style={{color:'#9CAF88'}}/> Transaction Volume</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,74,61,0.07)"/>
                  <XAxis dataKey="name" tick={{fill:'#9A9285',fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#9A9285',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                  <Tooltip contentStyle={TT} formatter={(v:number) => [`₹${v.toLocaleString('en-IN')}`, 'Volume']}/>
                  <Bar dataKey="value" radius={[5,5,0,0]}>{chartData.map((d,i) => <Cell key={i} fill={d.color} opacity={0.85}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-5" hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold flex items-center gap-2" style={{color:'#3F4A3D'}}><Users size={14} style={{color:'#A9714E'}}/> Recent Users</h2>
              <Link to="/admin/users" className="text-[11px] font-bold flex items-center gap-1" style={{color:'#A9714E'}}>View all <ArrowRight size={10}/></Link>
            </div>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-2xl" style={{background:'rgba(255,255,255,0.55)',border:'1px solid rgba(63,74,61,0.08)'}}>
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black flex-shrink-0"
                    style={{background:'linear-gradient(135deg,#9CAF88,#A9714E)',color:'#F5F0E6'}}>
                    {u.name?.[0]?.toUpperCase()||u.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{color:'#3F4A3D'}}>{u.name}</p>
                    <p className="text-[10px] truncate" style={{color:'#9A9285'}}>{u.email}</p>
                  </div>
                  <span className={`echip text-[8px] ${u.role==='ADMIN'?'echip-warning':'echip-success'}`}>{u.role}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="overflow-hidden" hover={false}>
          <div className="flex items-center justify-between p-5" style={{borderBottom:'1px solid rgba(63,74,61,0.08)'}}>
            <h2 className="text-sm font-bold flex items-center gap-2" style={{color:'#3F4A3D'}}><Activity size={14} style={{color:'#9CAF88'}}/> Recent Transactions</h2>
            <Link to="/admin/transactions" className="text-[11px] font-bold flex items-center gap-1" style={{color:'#A9714E'}}>View all <ArrowRight size={10}/></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="etable">
              <thead><tr>{['Type','Reference','Amount','Status','Date'].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {transactions.map(tx => {
                  const c = {DEPOSIT:'#9CAF88',WITHDRAWAL:'#A9714E',TRANSFER:'#3F4A3D'}[tx.transactionType]??'#9CAF88';
                  const bg = tx.transactionType==='DEPOSIT'?'linear-gradient(135deg,#9CAF88,#7A8F68)':tx.transactionType==='WITHDRAWAL'?'linear-gradient(135deg,#A9714E,#C4926D)':'linear-gradient(135deg,#3F4A3D,#566154)';
                  return (
                    <tr key={tx.id}>
                      <td><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:bg}}>
                        {tx.transactionType==='DEPOSIT'    && <TrendingUp    size={11} style={{color:'#F5F0E6'}}/>}
                        {tx.transactionType==='WITHDRAWAL' && <TrendingDown   size={11} style={{color:'#F5F0E6'}}/>}
                        {tx.transactionType==='TRANSFER'   && <ArrowLeftRight size={11} style={{color:'#F5F0E6'}}/>}
                      </div><span className="capitalize" style={{color:'#3F4A3D'}}>{tx.transactionType.toLowerCase()}</span></div></td>
                      <td style={{fontFamily:'monospace',color:'#9A9285'}}>{tx.transactionReference?.slice(0,16)}…</td>
                      <td style={{fontWeight:700,color:c}}>₹{tx.amount.toLocaleString('en-IN')}</td>
                      <td><span className={`echip text-[9px] ${tx.status==='COMPLETED'?'echip-success':tx.status==='PENDING'?'echip-warning':'echip-danger'}`}>{tx.status}</span></td>
                      <td style={{color:'#9A9285'}}>{new Date(tx.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
