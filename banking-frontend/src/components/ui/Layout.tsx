import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#020817] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="absolute left-0 top-0 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </motion.div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid rgba(63,74,61,0.12)', background: '#3F4A3D' }}>
          <button onClick={() => setMobileOpen(true)} style={{ color: '#9CAF88' }}
            onMouseEnter={e=>(e.currentTarget.style.color='#F5F0E6')} onMouseLeave={e=>(e.currentTarget.style.color='#9CAF88')}>
            <Menu size={22} />
          </button>
          <span className="font-semibold text-sm" style={{ color: '#F5F0E6' }}>BankingApp</span>
        </div>

        {/* Scrollable page area */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
