import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as accountApi from '../../api/accounts';
import type { Account } from '../../types';
import GlassCard from '../../components/ui/GlassCard';
import VideoBackground from '../../components/ui/VideoBackground';
import { CreditCard, ShieldX, ShieldCheck, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(0);
  const [totalPages, setTP]     = useState(0);
  const [search, setSearch]     = useState('');

  const fetchAccounts = async (p=0) => {
    setLoading(true);
    try { const {data} = await accountApi.getAccounts(p,12); setAccounts(data.content); setTP(data.totalPages); setPage(p); }
    catch { toast.error('Failed to load accounts'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAccounts(); }, []);

  const updateStatus = async (id:number, status:string) => {
    try { await accountApi.updateAccountStatus(id,status); toast.success(`Account ${status.toLowerCase()}`); fetchAccounts(page); }
    catch (err:any) { toast.error(err.response?.data?.message||'Failed'); }
  };
  const closeAccount = async (id:number) => {
    if (!window.confirm('Permanently close this account?')) return;
    try { await accountApi.deleteAccount(id); toast.success('Account closed'); fetchAccounts(page); }
    catch (err:any) { toast.error(err.response?.data?.message||'Failed'); }
  };

  const fmt = (n:number) => `₹${n.toLocaleString('en-IN',{minimumFractionDigits:2})}`;
  const filtered = accounts.filter(a => !search||a.accountNumber?.includes(search)||a.userEmail?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen relative animate-page-in zone-olive" style={{background:'#F5F0E6'}}>
      <VideoBackground page="admin" className="fixed"/>
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2" style={{color:'#3F4A3D'}}><CreditCard size={22} style={{color:'#9CAF88'}}/> All Accounts</h1>
          <p className="text-sm mt-0.5" style={{color:'#9A9285'}}>Manage account statuses across all users</p>
        </div>

        <GlassCard className="p-4" hover={false}>
          <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:'#9A9285'}}/>
            <input type="text" placeholder="Search by account number or email…" value={search} onChange={e=>setSearch(e.target.value)} className="einput pl-9 py-2.5 text-xs"/>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden" hover={false}>
          {loading ? (
            <div className="flex items-center justify-center py-14"><div className="w-8 h-8 rounded-full animate-breathe" style={{background:'linear-gradient(135deg,#9CAF88,#7A8F68)'}}/></div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="etable">
                  <thead><tr>{['Account No.','Type','Balance','Status','Owner','Created','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filtered.map((a,i) => (
                      <motion.tr key={a.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.025}}>
                        <td style={{fontFamily:'monospace',color:'#566154'}}>{a.accountNumber}</td>
                        <td><span className={`echip text-[9px] ${a.accountType==='SAVINGS'?'echip-success':'echip-warning'}`}>{a.accountType}</span></td>
                        <td style={{fontWeight:700,color:'#7A8F68'}}>{fmt(a.balance)}</td>
                        <td><span className={`echip text-[9px] ${a.status==='ACTIVE'?'echip-success':a.status==='BLOCKED'?'echip-danger':'echip-info'}`}>{a.status}</span></td>
                        <td style={{color:'#566154',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.userEmail}</td>
                        <td style={{color:'#9A9285',whiteSpace:'nowrap'}}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {a.status==='ACTIVE' && (
                              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                                onClick={() => updateStatus(a.id,'BLOCKED')}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all"
                                style={{background:'rgba(169,113,78,0.12)',border:'1px solid rgba(169,113,78,0.25)',color:'#7D5239'}}>
                                <ShieldX size={10}/> Block
                              </motion.button>
                            )}
                            {a.status==='BLOCKED' && (
                              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                                onClick={() => updateStatus(a.id,'ACTIVE')}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all"
                                style={{background:'rgba(156,175,136,0.15)',border:'1px solid rgba(156,175,136,0.30)',color:'#4A6E35'}}>
                                <ShieldCheck size={10}/> Activate
                              </motion.button>
                            )}
                            {a.status!=='CLOSED' && (
                              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                                onClick={() => closeAccount(a.id)}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all"
                                style={{background:'rgba(180,60,60,0.10)',border:'1px solid rgba(180,60,60,0.22)',color:'#8B2020'}}>
                                <Trash2 size={10}/> Close
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages>1 && (
                <div className="flex items-center justify-center gap-3 p-4 text-[11px]" style={{borderTop:'1px solid rgba(63,74,61,0.07)'}}>
                  <button onClick={()=>fetchAccounts(page-1)} disabled={page===0} className="px-4 py-2 rounded-xl disabled:opacity-40" style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(63,74,61,0.12)',color:'#566154'}}>Previous</button>
                  <span style={{color:'#9A9285'}}>Page {page+1} of {totalPages}</span>
                  <button onClick={()=>fetchAccounts(page+1)} disabled={page>=totalPages-1} className="px-4 py-2 rounded-xl disabled:opacity-40" style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(63,74,61,0.12)',color:'#566154'}}>Next</button>
                </div>
              )}
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
