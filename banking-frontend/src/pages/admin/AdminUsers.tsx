import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as adminApi from '../../api/admin';
import type { UserResponse } from '../../types';
import GlassCard from '../../components/ui/GlassCard';
import VideoBackground from '../../components/ui/VideoBackground';
import { Users, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers]     = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(0);
  const [totalPages, setTP]   = useState(0);
  const [search, setSearch]   = useState('');

  const fetchUsers = async (p=0) => {
    setLoading(true);
    try { const {data} = await adminApi.getAllUsers(p,12); setUsers(data.content); setTP(data.totalPages); setPage(p); }
    catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => !search||u.name?.toLowerCase().includes(search.toLowerCase())||u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen relative animate-page-in zone-olive" style={{background:'#F5F0E6'}}>
      <VideoBackground page="admin" className="fixed"/>
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2" style={{color:'#3F4A3D'}}><Users size={22} style={{color:'#A9714E'}}/> All Users</h1>
            <p className="text-sm mt-0.5" style={{color:'#9A9285'}}>{users.length} users in system</p>
          </div>
        </div>
        <GlassCard className="p-4" hover={false}>
          <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:'#9A9285'}}/>
            <input type="text" placeholder="Search by name or email…" value={search} onChange={e=>setSearch(e.target.value)} className="einput pl-9 py-2.5 text-xs"/>
          </div>
        </GlassCard>
        <GlassCard className="overflow-hidden" hover={false}>
          {loading ? (
            <div className="flex items-center justify-center py-14"><div className="w-8 h-8 rounded-full animate-breathe" style={{background:'linear-gradient(135deg,#9CAF88,#7A8F68)'}}/></div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="etable">
                  <thead><tr>{['ID','Name','Email','Role','Joined'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filtered.map((u,i) => (
                      <motion.tr key={u.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}>
                        <td style={{fontFamily:'monospace',color:'#9A9285'}}>#{u.id}</td>
                        <td><div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black flex-shrink-0"
                            style={{background:'linear-gradient(135deg,#9CAF88,#A9714E)',color:'#F5F0E6'}}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium" style={{color:'#3F4A3D'}}>{u.name}</span>
                        </div></td>
                        <td style={{color:'#566154'}}>{u.email}</td>
                        <td><span className={`echip text-[9px] ${u.role==='ADMIN'?'echip-warning':'echip-success'}`}>{u.role}</span></td>
                        <td style={{color:'#9A9285'}}>{new Date(u.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages>1 && (
                <div className="flex items-center justify-center gap-3 p-4 text-[11px]" style={{borderTop:'1px solid rgba(63,74,61,0.07)'}}>
                  <button onClick={()=>fetchUsers(page-1)} disabled={page===0} className="px-4 py-2 rounded-xl disabled:opacity-40" style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(63,74,61,0.12)',color:'#566154'}}>Previous</button>
                  <span style={{color:'#9A9285'}}>Page {page+1} of {totalPages}</span>
                  <button onClick={()=>fetchUsers(page+1)} disabled={page>=totalPages-1} className="px-4 py-2 rounded-xl disabled:opacity-40" style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(63,74,61,0.12)',color:'#566154'}}>Next</button>
                </div>
              )}
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
