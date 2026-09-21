import { useEffect, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as txApi from '../api/transactions';
import type { Transaction } from '../types';
import GlassCard from '../components/ui/GlassCard';
import PageHero from '../components/ui/PageHero';
import VideoBackground from '../components/ui/VideoBackground';
import { TrendingUp, TrendingDown, ArrowLeftRight, Search, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';

const TransactionTimeline3D = lazy(() => import('../components/3d/TransactionTimeline3D'));

const TC: Record<string,string> = { DEPOSIT:'#9CAF88', WITHDRAWAL:'#A9714E', TRANSFER:'#3F4A3D' };

export default function Transactions() {
  const { settings } = useSettings();
  const [transactions, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(0);
  const [totalPages, setTP]   = useState(0);
  const [filter, setFilter]   = useState<'ALL'|'DEPOSIT'|'WITHDRAWAL'|'TRANSFER'>('ALL');
  const [search, setSearch]   = useState('');
  const [selectedId, setSel]  = useState<number|null>(null);

  const fetchTx = async (p=0) => {
    setLoading(true);
    try { const {data} = await txApi.getTransactions(p,15); setTx(data.content); setTP(data.totalPages); setPage(p); }
    catch { toast.error('Failed to load transactions'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchTx(); }, []);

  const fmt = (n:number) => `₹${n.toLocaleString('en-IN',{minimumFractionDigits:2})}`;
  const totals = {
    deposits:    transactions.filter(t=>t.transactionType==='DEPOSIT').reduce((s,t)=>s+t.amount,0),
    withdrawals: transactions.filter(t=>t.transactionType==='WITHDRAWAL').reduce((s,t)=>s+t.amount,0),
    transfers:   transactions.filter(t=>t.transactionType==='TRANSFER').reduce((s,t)=>s+t.amount,0),
  };
  const filtered = transactions.filter(tx =>
    (filter==='ALL'||tx.transactionType===filter) &&
    (!search||tx.transactionReference?.toLowerCase().includes(search.toLowerCase()))
  );
  const selectedTx = transactions.find(t=>t.id===selectedId);

  return (
    <div className="min-h-screen relative animate-page-in zone-olive" style={{background:'#F5F0E6'}}>
      <VideoBackground page="transactions" className="fixed"/>
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-6xl mx-auto">
        <PageHero title="Transaction|Timeline" subtitle="Every financial move, visualized and auditable" badge="Live Ledger" character="specialist" mood="idle" page="transactions" minHeight="155px"/>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {label:'Deposits',    value:fmt(totals.deposits),    color:'#7A8F68', bg:'linear-gradient(135deg,#9CAF88,#7A8F68)', icon:TrendingUp,    tint:'ecard-sage'},
            {label:'Withdrawals', value:fmt(totals.withdrawals), color:'#7D5239', bg:'linear-gradient(135deg,#A9714E,#C4926D)', icon:TrendingDown,  tint:'ecard-terra'},
            {label:'Transfers',   value:fmt(totals.transfers),   color:'#2B3329', bg:'linear-gradient(135deg,#3F4A3D,#566154)', icon:ArrowLeftRight, tint:'ecard-olive'},
          ].map(({label,value,color,bg,icon:Icon,tint}) => (
            <GlassCard key={label} className={`p-4 ${tint}`} hover={false}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{background:bg,boxShadow:`0 3px 10px ${color}30`}}>
                <Icon size={14} style={{color:'#F5F0E6'}}/>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{color:'#9A9285'}}>{label}</p>
              <p className="text-base font-black mt-0.5" style={{color}}>{value}</p>
            </GlassCard>
          ))}
        </div>

        {/* 3D Timeline */}
        {!settings.disable3D && transactions.length>0 && (
          <GlassCard className="overflow-hidden" hover={false}>
            <div className="p-4" style={{borderBottom:'1px solid rgba(63,74,61,0.08)'}}>
              <h2 className="text-sm font-bold" style={{color:'#3F4A3D'}}>3D Transaction Map</h2>
              <p className="text-[10px] mt-0.5" style={{color:'#9A9285'}}>Click a node to expand details</p>
            </div>
            <div className="h-52">
              <Suspense fallback={<div className="h-full flex items-center justify-center text-xs" style={{color:'#9A9285'}}>Loading timeline...</div>}>
                <TransactionTimeline3D transactions={transactions.slice(0,7)} selectedId={selectedId} onSelect={id=>setSel(p=>p===id?null:id)}/>
              </Suspense>
            </div>
            <AnimatePresence>
              {selectedTx && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                  className="overflow-hidden" style={{borderTop:'1px solid rgba(63,74,61,0.08)'}}>
                  <div className="p-4 flex items-center gap-4 flex-wrap">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{background: selectedTx.transactionType==='DEPOSIT'?'linear-gradient(135deg,#9CAF88,#7A8F68)':selectedTx.transactionType==='WITHDRAWAL'?'linear-gradient(135deg,#A9714E,#C4926D)':'linear-gradient(135deg,#3F4A3D,#566154)'}}>
                      {selectedTx.transactionType==='DEPOSIT'    && <TrendingUp    size={13} style={{color:'#F5F0E6'}}/>}
                      {selectedTx.transactionType==='WITHDRAWAL' && <TrendingDown   size={13} style={{color:'#F5F0E6'}}/>}
                      {selectedTx.transactionType==='TRANSFER'   && <ArrowLeftRight size={13} style={{color:'#F5F0E6'}}/>}
                    </div>
                    {[
                      {label:'Type',   value:selectedTx.transactionType},
                      {label:'Amount', value:fmt(selectedTx.amount)},
                      {label:'Status', value:selectedTx.status},
                      {label:'Ref',    value:(selectedTx.transactionReference?.slice(0,18)??'')+'…'},
                      {label:'Date',   value:new Date(selectedTx.createdAt).toLocaleString('en-IN')},
                    ].map(({label,value}) => (
                      <div key={label}>
                        <p className="text-[9px] uppercase tracking-wider" style={{color:'#9A9285'}}>{label}</p>
                        <p className="text-xs font-semibold" style={{color:'#3F4A3D'}}>{value}</p>
                      </div>
                    ))}
                    <button onClick={() => setSel(null)} className="ml-auto transition-colors" style={{color:'#9A9285'}}
                      onMouseEnter={e=>(e.currentTarget.style.color='#3F4A3D')} onMouseLeave={e=>(e.currentTarget.style.color='#9A9285')}>
                      <X size={16}/>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        )}

        {/* Filters */}
        <GlassCard className="p-4" hover={false}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:'#9A9285'}}/>
              <input type="text" placeholder="Search by reference…" value={search} onChange={e=>setSearch(e.target.value)} className="einput pl-9 py-2.5 text-xs"/>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['ALL','DEPOSIT','WITHDRAWAL','TRANSFER'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-2 rounded-xl text-[10px] font-bold transition-all"
                  style={filter===f
                    ? {background:'rgba(156,175,136,0.22)',color:'#3F4A3D',border:'1px solid rgba(156,175,136,0.40)'}
                    : {background:'rgba(255,255,255,0.55)',color:'#9A9285',border:'1px solid rgba(63,74,61,0.10)'}}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Table */}
        <GlassCard className="overflow-hidden" hover={false}>
          {loading ? (
            <div className="flex items-center justify-center py-14"><div className="w-8 h-8 rounded-full animate-breathe" style={{background:'linear-gradient(135deg,#9CAF88,#7A8F68)'}}/></div>
          ) : filtered.length===0 ? (
            <div className="text-center py-14 text-sm" style={{color:'#9A9285'}}>No transactions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="etable">
                <thead><tr>{['Type','Reference','Amount','From','To','Status','Date'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {filtered.map((tx,i) => {
                    const c = TC[tx.transactionType]??'#9CAF88';
                    const bg = tx.transactionType==='DEPOSIT'?'linear-gradient(135deg,#9CAF88,#7A8F68)':tx.transactionType==='WITHDRAWAL'?'linear-gradient(135deg,#A9714E,#C4926D)':'linear-gradient(135deg,#3F4A3D,#566154)';
                    return (
                      <motion.tr key={tx.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.025}}
                        onClick={() => setSel(p=>p===tx.id?null:tx.id)}
                        className="cursor-pointer" style={selectedId===tx.id?{background:'rgba(156,175,136,0.08)'}:{}}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:bg}}>
                              {tx.transactionType==='DEPOSIT'    && <TrendingUp    size={11} style={{color:'#F5F0E6'}}/>}
                              {tx.transactionType==='WITHDRAWAL' && <TrendingDown   size={11} style={{color:'#F5F0E6'}}/>}
                              {tx.transactionType==='TRANSFER'   && <ArrowLeftRight size={11} style={{color:'#F5F0E6'}}/>}
                            </div>
                            <span className="capitalize font-medium" style={{color:'#3F4A3D'}}>{tx.transactionType.toLowerCase()}</span>
                          </div>
                        </td>
                        <td style={{fontFamily:'monospace',color:'#9A9285'}}>{tx.transactionReference?.slice(0,16)}…</td>
                        <td style={{fontWeight:700,color:c}}>{tx.transactionType==='DEPOSIT'?'+':'-'}{fmt(tx.amount)}</td>
                        <td style={{fontFamily:'monospace',color:'#9A9285'}}>{tx.sourceAccountNumber||'—'}</td>
                        <td style={{fontFamily:'monospace',color:'#9A9285'}}>{tx.destinationAccountNumber||'—'}</td>
                        <td><span className={`echip text-[9px] ${tx.status==='COMPLETED'?'echip-success':tx.status==='PENDING'?'echip-warning':'echip-danger'}`}>{tx.status}</span></td>
                        <td style={{color:'#9A9285',whiteSpace:'nowrap'}}>{new Date(tx.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {totalPages>1 && (
            <div className="flex items-center justify-center gap-3 p-4 text-[11px]" style={{borderTop:'1px solid rgba(63,74,61,0.08)'}}>
              <button onClick={() => fetchTx(page-1)} disabled={page===0}
                className="px-4 py-2 rounded-xl disabled:opacity-40 transition-all" style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(63,74,61,0.12)',color:'#566154'}}>Previous</button>
              <span style={{color:'#9A9285'}}>Page {page+1} / {totalPages}</span>
              <button onClick={() => fetchTx(page+1)} disabled={page>=totalPages-1}
                className="px-4 py-2 rounded-xl disabled:opacity-40 transition-all" style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(63,74,61,0.12)',color:'#566154'}}>Next</button>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
