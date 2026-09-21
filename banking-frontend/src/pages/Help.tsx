import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import PageHero from '../components/ui/PageHero';
import VideoBackground from '../components/ui/VideoBackground';
import { Search, ChevronDown, ChevronRight, HelpCircle, ExternalLink, Leaf } from 'lucide-react';

const faqs = [
  { q: 'How do I deposit funds?',         a: 'Go to Deposit in the sidebar, select your account, enter the amount and click Deposit Funds. Credited instantly.' },
  { q: 'How do I transfer money?',        a: 'Go to Transfer, select your source account, enter the destination Account ID, enter the amount, then click Transfer Funds.' },
  { q: 'How is my account protected?',    a: 'JWT authentication (24h tokens), BCrypt password hashing, role-based access control, and Spring Security API filters protect every operation.' },
  { q: 'Where can I find transactions?',  a: 'Go to Transactions in the sidebar. Filter by type, search by reference, and view the 3D timeline at the top.' },
  { q: 'How do I open a new account?',    a: 'Go to Accounts → New Account. Choose Savings or Checking, optionally enter an initial deposit, and click Open Account.' },
  { q: 'What is Immersive Mode?',         a: 'Immersive Mode enables richer 3D organic particles and camera movement. Toggle it from Settings or the bottom-right button.' },
  { q: 'Can I disable the 3D effects?',   a: 'Yes — Settings → Accessibility → Disable 3D. All banking features work identically in 2D mode.' },
  { q: 'Why did my transfer fail?',       a: 'Transfers can fail due to insufficient balance, a blocked account, or an invalid destination ID. The error message explains the reason.' },
  { q: 'How long does a JWT token last?', a: 'Your session token expires after 24 hours. You will be automatically redirected to login when it expires.' },
  { q: 'How do I become an Admin?',       a: 'Register with the Admin role selected. Admins can manage all users, block/close accounts, and view system-wide transaction data.' },
];

export default function Help() {
  const [search, setSearch] = useState('');
  const [open, setOpen]     = useState<number | null>(null);

  const filtered = faqs.filter(f =>
    !search ||
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen relative animate-page-in zone-sage" style={{ background: '#F5F0E6' }}>
      <VideoBackground page="help" className="fixed" />
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-2xl mx-auto">
        <PageHero title="Help &|Support" subtitle="Find answers to common banking questions"
          badge="Support Centre" character="support" mood="wave" page="help" minHeight="150px" />

        {/* Search — sage tinted */}
        <GlassCard className="p-4 ecard-sage" hover={false}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9A9285' }} />
            <input type="text" placeholder="Search questions…" value={search} onChange={e => setSearch(e.target.value)}
              className="einput pl-9" />
          </div>
        </GlassCard>

        {/* FAQ accordion */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <GlassCard className="p-10 text-center" hover={false}>
              <HelpCircle size={30} className="mx-auto mb-3" style={{ color: '#C4B8A8' }} />
              <p className="text-sm" style={{ color: '#9A9285' }}>No matching questions found</p>
            </GlassCard>
          ) : filtered.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <GlassCard className="overflow-hidden" glow={open === i ? 'sage' : 'none'} onClick={() => setOpen(o => o === i ? null : i)}>
                <div className="flex items-center gap-3 p-4 cursor-pointer">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={open === i
                      ? { background: 'rgba(156,175,136,0.20)', border: '1px solid rgba(156,175,136,0.35)' }
                      : { background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(63,74,61,0.10)' }}>
                    {open === i
                      ? <ChevronDown size={13} style={{ color: '#7A8F68' }} />
                      : <ChevronRight size={13} style={{ color: '#9A9285' }} />}
                  </div>
                  <p className="text-sm font-semibold transition-colors"
                    style={{ color: open === i ? '#3F4A3D' : '#566154' }}>{faq.q}</p>
                </div>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 pl-14">
                        <p className="text-sm leading-relaxed" style={{ color: '#8A9688' }}>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={13} style={{ color: '#9CAF88' }} />
            <h3 className="text-sm font-bold" style={{ color: '#3F4A3D' }}>Still need help?</h3>
          </div>
          <p className="text-[11px] mb-3" style={{ color: '#9A9285' }}>Check the API documentation for detailed endpoint information.</p>
          <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold transition-colors"
            style={{ color: '#7A8F68' }}>
            <HelpCircle size={13} /> Open API Documentation <ExternalLink size={11} />
          </a>
        </GlassCard>
      </div>
    </div>
  );
}
