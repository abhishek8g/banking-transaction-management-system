import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as txApi from '../../api/transactions';
import type { Transaction } from '../../types';
import GlassCard from '../../components/ui/GlassCard';
import VideoBackground from '../../components/ui/VideoBackground';
import { Activity, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTransactions() {
  const [transactions, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(0);
  const [totalPages, setTP]   = useState(0);

  const fetchTx = async (p=0) => {
    setLoading(true);
    try { const {data} = await txApi.getTransactions(p,15); setTx(data.content); setTP(data.totalPages); setPage(p); }
    catch { toast.error('Failed to load transactions'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchTx(); }, []);

  const fmt = (n:number) => `₹${n.toLocaleString('en-IN',{minimumFractionDigits:2})}`;

  return (
    <div className="min-h-screen relative animate-page-in zone-olive" style={{background:'#F5F0E6'}}>
      <VideoBackground page="admin" className="fixed"/>
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2" style={{color:'#3F4A3D'}}><Activity size={22} style={{color:'#9CAF88'}}/> All Transactions</h1>
          <p className="text-sm mt-0.5" style={{color:'#9A9285'}}>System-wide transaction ledger</p>
        </div>

        <GlassCard className="overflow-hidden" hover={false}>
          {loading ? (
            <div className="flex items-center justify-center py-14"><div className="w-8 h-8 rounded-full animate-breathe" style={{background:'linear-gradient(135deg,#9CAF88,#7A8F68)'}}/></div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="etable">
                  <thead><tr>{['Type','Reference','Amount','From','To','Status','Date'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {transactions.map((tx,i) => {
                      const c = {DEPOSIT:'#9CAF88',WITHDRAWAL:'#A9714E',TRANSFER:'#3F4A3D'}[tx.transactionType]??'#9CAF88';
                      const bg = tx.transactionType==='DEPOSIT'?'linear-gradient(135deg,#9CAF88,#7A8F68)':tx.transactionType==='WITHDRAWAL'?'linear-gradient(135deg,#A9714E,#C4926D)':'linear-gradient(135deg,#3F4A3D,#566154)';
                      return (
                        <motion.tr key={tx.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}}>
                          <td><div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:bg}}>
                              {tx.transactionType==='DEPOSIT'    && <TrendingUp    size={11} style={{color:'#F5F0E6'}}/>}
                              {tx.transactionType==='WITHDRAWAL' && <TrendingDown   size={11} style={{color:'#F5F0E6'}}/>}
                              {tx.transactionType==='TRANSFER'   && <ArrowLeftRight size={11} style={{color:'#F5F0E6'}}/>}
                            </div>
                            <span className="capitalize" style={{color:'#3F4A3D'}}>{tx.transactionType.toLowerCase()}</span>
                          </div></td>
                          <td style={{fontFamily:'monospace',color:'#9A9285'}}>{tx.transactionReference?.slice(0,16)}…</td>
                          <td style={{fontWeight:700,color:c}}>{fmt(tx.amount)}</td>
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
              {totalPages>1 && (
                <div className="flex items-center justify-center gap-3 p-4 text-[11px]" style={{borderTop:'1px solid rgba(63,74,61,0.07)'}}>
                  <button onClick={()=>fetchTx(page-1)} disabled={page===0} className="px-4 py-2 rounded-xl disabled:opacity-40" style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(63,74,61,0.12)',color:'#566154'}}>Previous</button>
                  <span style={{color:'#9A9285'}}>Page {page+1} of {totalPages}</span>
                  <button onClick={()=>fetchTx(page+1)} disabled={page>=totalPages-1} className="px-4 py-2 rounded-xl disabled:opacity-40" style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(63,74,61,0.12)',color:'#566154'}}>Next</button>
                </div>
              )}
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
