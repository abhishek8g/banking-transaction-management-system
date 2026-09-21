import { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import { ChevronRight, X, Wallet, CreditCard, ArrowLeftRight, Shield } from 'lucide-react';

const Scene3D = lazy(() => import('../3d/Scene3D'));

const steps = [
  { mood: 'wave'  as const, title: 'Welcome to Your Digital Bank', body: 'This is your personal financial command centre. Everything you need is here — beautiful, secure, and real-time.', icon: Wallet,        char: 'assistant'  as const },
  { mood: 'point' as const, title: 'Your Balance at a Glance',     body: 'Your total balance, available funds, and all accounts are displayed right on the dashboard the moment you log in.',      icon: Wallet,        char: 'assistant'  as const },
  { mood: 'point' as const, title: 'Manage Your Accounts',          body: 'Open savings or checking accounts, view balances, and perform deposits, withdrawals, and transfers directly from each card.', icon: CreditCard,    char: 'specialist' as const },
  { mood: 'point' as const, title: 'Transfer Money Securely',       body: 'Move funds between accounts with atomic transfers. If anything fails, the transaction rolls back completely — your money is safe.', icon: ArrowLeftRight, char: 'specialist' as const },
  { mood: 'idle'  as const, title: 'Your Security is Active',       body: 'JWT authentication, RBAC, BCrypt passwords, and API protection work together to keep every operation secure.',                icon: Shield,        char: 'guardian'   as const },
];

export default function Onboarding() {
  const { settings, set } = useSettings();
  const [step, setStep] = useState(0);

  if (settings.onboardingDone) return null;

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  const finish = () => set('onboardingDone', true);
  const next   = () => isLast ? finish() : setStep(s => s + 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
    >
      <motion.div
        key={step}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl"
        style={{ background:'rgba(251,248,243,0.98)', border:'1px solid rgba(63,74,61,0.12)' }}
      >
        {/* 3D header */}
        <div className="h-52 relative rounded-t-[28px] overflow-hidden"
          style={{ background:'linear-gradient(135deg,rgba(156,175,136,0.25),rgba(245,240,230,0.90))' }}>
          <Suspense fallback={null}>
            <Scene3D mood={current.mood} character={current.char} reduceMotion={settings.reduceMotion} />
          </Suspense>
          {/* Step dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={i === step
                  ? { width: 20, height: 6, background: '#A9714E' }
                  : { width: 6, height: 6, background: 'rgba(63,74,61,0.25)' }} />
            ))}
          </div>
          {/* Skip */}
          <button onClick={finish} className="absolute top-3 right-3 p-1 transition-colors"
            style={{ color:'#9A9285' }}
            onMouseEnter={e => (e.currentTarget.style.color='#3F4A3D')}
            onMouseLeave={e => (e.currentTarget.style.color='#9A9285')}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-7">
        <div className="p-7" style={{ background: 'rgba(251,248,243,0.97)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background:'rgba(156,175,136,0.20)', border:'1px solid rgba(156,175,136,0.35)' }}>
              <Icon size={18} style={{ color:'#7A8F68' }} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color:'#9CAF88' }}>
              Step {step + 1} of {steps.length}
            </span>
          </div>
          <h2 className="text-xl font-black mb-2 leading-snug" style={{ color:'#3F4A3D' }}>{current.title}</h2>
          <p className="text-sm leading-relaxed" style={{ color:'#8A9688' }}>{current.body}</p>
          <div className="flex gap-3 mt-7">
            <button onClick={finish} className="px-4 py-2.5 text-sm transition-colors"
              style={{ color:'#9A9285' }}
              onMouseEnter={e => (e.currentTarget.style.color='#3F4A3D')}
              onMouseLeave={e => (e.currentTarget.style.color='#9A9285')}>
              Skip tour
            </button>
            <motion.button whileHover={{ scale:1.02, y:-1 }} whileTap={{ scale:0.98 }}
              onClick={next}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white font-bold rounded-xl text-sm ebtn-terra"
              style={{ background:'linear-gradient(135deg,#A9714E,#C4926D)', boxShadow:'0 4px 14px rgba(169,113,78,0.35)' }}>
              {isLast ? 'Start Banking' : 'Next'}
              {!isLast && <ChevronRight size={16} />}
            </motion.button>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
