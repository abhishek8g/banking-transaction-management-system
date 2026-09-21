import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as accountApi from '../api/accounts';
import * as txApi from '../api/transactions';
import type { Account, Transaction } from '../types';
import GlassCard from '../components/ui/GlassCard';
import TransactionModal from '../components/ui/TransactionModal';
import VideoBackground from '../components/ui/VideoBackground';
import { ArrowLeft, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import toast from 'react-hot-toast';

type TxType = 'deposit'|'withdraw'|'transfer';
const TC: Record<string,string> = {DEPOSIT:'#9CAF88',WITHDRAWAL:'#A9714E',TRANSFER:'#3F4A3D'};

export default function AccountDetail() {
  const { id } = useParams<{id:string}>();
  const [account, setAccount] = useState<Account|null>(null);
  const [transactions, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState<TxType|null>(null);
  const [page, setPage]       = useState(0);
  const [totalPages, setTP]   = useState(0);

  const fetchData = async (p=0) => {
    if(!id) return;
    try {
      const [ar,tr] = await Promise.all([accountApi.getAccountById(parseInt(id)),txApi.getTransactions(p,8,parseInt(id))]);
      setAccount(ar.data); setTx(tr.data.content); setTP(tr.data.totalPages); setPage(p);
    } catch { toast.error('Failed to load account'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, [id]);

  const fmt = (n:number) => `₹${n.toLocaleString('en-IN',{minimumFractionDigits:2})}`;
  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#F5F0E6'}}><div className="w-10 h-10 rounded-full animate-breathe" style={{background:'linear-gradient(135deg,#9CAF88,#7A8F68)'}}/></div>;
  if (!account) return <div className="min-h-screen flex items-center justify-center text-sm" style={{background:'#F5F0E6',color:'#9A9285'}}>Account not found</div>;

  const isSav = account.accountType==='SAVINGS';
  const accColor = isSav?'#9CAF88':'#A9714E';

  return (
    <div className="min-h-screen relative animate-page-in zone-sage" style={{background:'#F5F0E6'}}>
      <VideoBackground page="accounts" className="fixed"/>
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-4xl mx-auto">
        <Link to="/accounts" className="inline-flex items-center gap-2 text-sm transition-colors" style={{color:'#9A9285'}}
          onMouseEnter={e=>(e.currentTarget.style.color='#3F4A3D')} onMouseLeave={e=>(e.currentTarget.style.color='#9A9285')}>
          <ArrowLeft size={15}/> Back to Accounts
        </Link>

        <div className="relative rounded-[26px] overflow-hidden p-7"
          style={{background:`linear-gradient(135deg,${accColor}20 0%,rgba(255,255,255,0.70) 100%)`,border:`1px solid ${accColor}28`,boxShadow:`0 8px 32px ${accColor}14`}}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{color:'#9A9285'}}>{account.accountType} Account</span>
                <span className={`echip text-[9px] ${account.status==='ACTIVE'?'echip-success':account.status==='BLOCKED'?'echip-danger':'echip-info'}`}>{account.status}</span>
              </div>
              <p className="text-[11px] font-mono mb-3" style={{color:'#9A9285'}}>{account.accountNumber}</p>
              <p className="text-4xl font-black" style={{color:'#3F4A3D'}}>{fmt(account.balance)}</p>
              <p className="text-[11px] mt-1" style={{color:'#9A9285'}}>Opened {new Date(account.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</p>
            </div>
            {account.status==='ACTIVE' && (
              <div className="flex gap-3 flex-wrap">
                {([
                  {type:'deposit'  as TxType, icon:TrendingUp,    label:'Deposit',  bg:'linear-gradient(135deg,#9CAF88,#7A8F68)'},
                  {type:'withdraw' as TxType, icon:TrendingDown,  label:'Withdraw', bg:'linear-gradient(135deg,#A9714E,#C4926D)'},
                  {type:'transfer' as TxType, icon:ArrowLeftRight, label:'Transfer', bg:'linear-gradient(135deg,#3F4A3D,#566154)'},
                ]).map(({type,icon:Icon,label,bg}) => (
                  <motion.button key={type} whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
                    onClick={() => setModal(type)}
                    className="ebtn flex items-center gap-2 text-sm text-white" style={{background:bg,boxShadow:'0 3px 12px rgba(63,74,61,0.20)'}}>
                    <Icon size={14}/> {label}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        <GlassCard className="overflow-hidden" hover={false}>
          <div className="p-5" style={{borderBottom:'1px solid rgba(63,74,61,0.08)'}}>
            <h2 className="text-sm font-bold" style={{color:'#3F4A3D'}}>Transaction History</h2>
          </div>
          {transactions.length===0 ? (
            <p className="text-sm text-center py-10" style={{color:'#9A9285'}}>No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="etable">
                <thead><tr>{['Type','Reference','Amount','Status','Date'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {transactions.map(tx => {
                    const c = TC[tx.transactionType]??'#9CAF88';
                    const bg = tx.transactionType==='DEPOSIT'?'linear-gradient(135deg,#9CAF88,#7A8F68)':tx.transactionType==='WITHDRAWAL'?'linear-gradient(135deg,#A9714E,#C4926D)':'linear-gradient(135deg,#3F4A3D,#566154)';
                    return (
                      <motion.tr key={tx.id} initial={{opacity:0}} animate={{opacity:1}}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:bg}}>
                              {tx.transactionType==='DEPOSIT'    && <TrendingUp    size={11} style={{color:'#F5F0E6'}}/>}
                              {tx.transactionType==='WITHDRAWAL' && <TrendingDown   size={11} style={{color:'#F5F0E6'}}/>}
                              {tx.transactionType==='TRANSFER'   && <ArrowLeftRight size={11} style={{color:'#F5F0E6'}}/>}
                            </div>
                            <span className="capitalize font-medium" style={{color:'#3F4A3D'}}>{tx.transactionType.toLowerCase()}</span>
                          </div>
                        </td>
                        <td style={{fontFamily:'monospace',color:'#9A9285'}}>{tx.transactionReference?.slice(0,16)}…</td>
                        <td style={{fontWeight:700,color:c}}>{tx.transactionType==='DEPOSIT'?'+':'-'}{fmt(tx.amount)}</td>
                        <td><span className={`echip text-[9px] ${tx.status==='COMPLETED'?'echip-success':tx.status==='PENDING'?'echip-warning':'echip-danger'}`}>{tx.status}</span></td>
                        <td style={{color:'#9A9285'}}>{new Date(tx.createdAt).toLocaleDateString('en-IN')}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {totalPages>1 && (
            <div className="flex items-center justify-center gap-3 p-4 text-[11px]" style={{borderTop:'1px solid rgba(63,74,61,0.07)'}}>
              <button onClick={() => fetchData(page-1)} disabled={page===0} className="px-4 py-2 rounded-xl disabled:opacity-40" style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(63,74,61,0.12)',color:'#566154'}}>Prev</button>
              <span style={{color:'#9A9285'}}>Page {page+1} / {totalPages}</span>
              <button onClick={() => fetchData(page+1)} disabled={page>=totalPages-1} className="px-4 py-2 rounded-xl disabled:opacity-40" style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(63,74,61,0.12)',color:'#566154'}}>Next</button>
            </div>
          )}
        </GlassCard>
      </div>
      {modal && <TransactionModal type={modal} accountId={account.id} onClose={() => setModal(null)} onSuccess={() => {setModal(null);fetchData();}}/>}
    </div>
  );
}
