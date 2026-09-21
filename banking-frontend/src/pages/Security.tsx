import { Suspense, useState, lazy } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import PageHero from '../components/ui/PageHero';
import VideoBackground from '../components/ui/VideoBackground';
import FloatingBubble from '../components/ui/FloatingBubble';
import { Shield, CheckCircle, Lock, Key, Users, Server, Cpu } from 'lucide-react';
const ShieldScene = lazy(() => import('../components/3d/ShieldScene'));

const secItems = [
  { icon: Key,    label: 'JWT Authentication',       desc: 'Stateless Bearer token auth. Every API request validated server-side.',             color: '#9CAF88' },
  { icon: Shield, label: 'Account Protection',       desc: 'Ownership checks ensure you can only access your own accounts.',                   color: '#7A8F68' },
  { icon: Users,  label: 'Role-Based Access (RBAC)', desc: 'CUSTOMER and ADMIN roles strictly separated. Admin APIs inaccessible to customers.', color: '#3F4A3D' },
  { icon: Lock,   label: 'Encrypted Passwords',      desc: 'All passwords hashed with BCrypt before storage. Never stored plain-text.',         color: '#566154' },
  { icon: Server, label: 'API Protection',           desc: 'Spring Security filters block unauthorized requests before the service layer.',       color: '#A9714E' },
  { icon: Cpu,    label: 'Optimistic Locking',       desc: 'Database version control prevents race conditions on concurrent transactions.',       color: '#7D5239' },
];

const tints = ['ecard-sage', 'ecard-olive', 'ecard-terra', 'ecard-sage', 'ecard-olive', 'ecard-terra'];

export default function Security() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [bubble, setBubble]   = useState(false);

  return (
    <div className="min-h-screen relative animate-page-in zone-olive" style={{ background: '#F5F0E6' }}>
      <VideoBackground page="security" className="fixed" />
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-5xl mx-auto">
        <PageHero title="Security|Center" subtitle="Your banking operations are protected by multiple security layers"
          badge="All Systems Secure" character="guardian" mood="idle" page="security" minHeight="165px" />

        {/* Hero security card — olive tinted */}
        <GlassCard className="overflow-hidden ecard-olive" hover={false}>
          <div className="flex flex-col lg:flex-row">
            {/* 3D Shield */}
            <div className="h-56 lg:h-auto lg:w-60 flex-shrink-0 relative cursor-pointer rounded-t-[22px] lg:rounded-l-[22px] lg:rounded-tr-none overflow-hidden"
              style={{ background: 'linear-gradient(135deg,rgba(63,74,61,0.18),rgba(245,240,230,0.90))' }}
              onMouseEnter={() => setBubble(true)} onMouseLeave={() => setBubble(false)}>
              <Suspense fallback={
                <div className="h-full flex items-center justify-center">
                  <Shield size={60} style={{ color: 'rgba(63,74,61,0.25)' }} />
                </div>
              }>
                <ShieldScene />
              </Suspense>
              <div className="absolute bottom-3 left-3 right-3">
                <FloatingBubble visible={bubble} variant="security">
                  Your banking is protected by 6 security layers.
                </FloatingBubble>
              </div>
            </div>

            {/* Summary */}
            <div className="flex-1 p-7">
              <div className="flex items-center gap-2 mb-4">
                <div className="echip echip-success flex items-center gap-1.5 px-2.5 py-1">
                  <CheckCircle size={11} /> All Systems Secure
                </div>
              </div>
              <h2 className="text-lg font-black mb-2" style={{ color: '#3F4A3D' }}>Multi-Layer Security Architecture</h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#8A9688' }}>
                Enterprise-grade security through JWT, BCrypt, Spring Security, RBAC, and database-level optimistic locking.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                {['JWT Tokens', 'BCrypt Hashing', 'RBAC', 'Stateless CSRF', 'Ownership Checks', 'Race Condition Guards'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-[11px]" style={{ color: '#566154' }}>
                    <CheckCircle size={11} style={{ color: '#9CAF88' }} className="flex-shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Security items — alternating tinted cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {secItems.map(({ icon: Icon, label, desc, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              onHoverStart={() => setHovered(i)} onHoverEnd={() => setHovered(null)}>
              <GlassCard className={`p-5 h-full ${tints[i]}`} glow={i % 2 === 0 ? 'sage' : 'terra'}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all"
                    style={hovered === i
                      ? { background: `${color}25`, border: `1px solid ${color}45` }
                      : { background: `${color}12`, border: `1px solid ${color}22` }}>
                    <Icon size={17} style={{ color }} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full animate-breathe" style={{ background: '#9CAF88' }} />
                    <span className="text-[9px] font-bold" style={{ color: '#7A8F68' }}>Active</span>
                  </div>
                </div>
                <h3 className="text-xs font-bold mb-1.5" style={{ color: '#3F4A3D' }}>{label}</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: '#9A9285' }}>{desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Tips — olive accented */}
        <GlassCard className="p-5 ecard-olive accent-band-olive" hover={false}>
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#3F4A3D' }}>
            <Lock size={14} style={{ color: '#A9714E' }} /> Security Best Practices
          </h2>
          <div className="grid md:grid-cols-2 gap-2.5">
            {[
              'Never share your account password with anyone',
              'JWT tokens expire after 24 hours for security',
              'Use a strong, unique password for your account',
              'Log out when using shared or public devices',
              'Report any suspicious account activity immediately',
              'Admin operations are protected by RBAC',
            ].map(tip => (
              <div key={tip} className="flex items-start gap-2 text-[11px]" style={{ color: '#8A9688' }}>
                <Shield size={11} style={{ color: 'rgba(156,175,136,0.70)' }} className="mt-0.5 flex-shrink-0" /> {tip}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
