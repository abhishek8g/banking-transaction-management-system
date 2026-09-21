import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import PrivateRoute from './components/ui/PrivateRoute';
import Layout from './components/ui/Layout';
import CustomCursor from './components/ui/CustomCursor';
import ClickEffect from './components/ui/ClickEffect';
import ImmersiveToggle from './components/ui/ImmersiveToggle';

const Login             = lazy(() => import('./pages/Login'));
const Register          = lazy(() => import('./pages/Register'));
const Dashboard         = lazy(() => import('./pages/Dashboard'));
const Accounts          = lazy(() => import('./pages/Accounts'));
const NewAccount        = lazy(() => import('./pages/NewAccount'));
const AccountDetail     = lazy(() => import('./pages/AccountDetail'));
const Transactions      = lazy(() => import('./pages/Transactions'));
const Transfer          = lazy(() => import('./pages/Transfer'));
const Deposit           = lazy(() => import('./pages/Deposit'));
const Withdraw          = lazy(() => import('./pages/Withdraw'));
const Analytics         = lazy(() => import('./pages/Analytics'));
const Security          = lazy(() => import('./pages/Security'));
const Profile           = lazy(() => import('./pages/Profile'));
const Settings          = lazy(() => import('./pages/Settings'));
const Help              = lazy(() => import('./pages/Help'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers        = lazy(() => import('./pages/admin/AdminUsers'));
const AdminAccounts     = lazy(() => import('./pages/admin/AdminAccounts'));
const AdminTransactions = lazy(() => import('./pages/admin/AdminTransactions'));

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F0E6' }}>
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full animate-breathe"
        style={{ background: 'linear-gradient(135deg,#9CAF88,#7A8F68)', boxShadow: '0 4px 16px rgba(156,175,136,0.40)' }} />
      <p className="text-xs" style={{ color: '#9A9285' }}>Loading...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <CustomCursor />
          <ClickEffect />
          <ImmersiveToggle />

          <Toaster position="top-right" toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(251,248,243,0.97)',
              color: '#3F4A3D',
              border: '1px solid rgba(63,74,61,0.16)',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: '600',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(63,74,61,0.14)',
            },
            success: { iconTheme: { primary: '#9CAF88', secondary: '#FBF8F3' } },
            error:   { iconTheme: { primary: '#A9714E', secondary: '#FBF8F3' } },
          }} />

          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/"         element={<Navigate to="/login" replace />} />

              <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="/dashboard"    element={<Dashboard />} />
                <Route path="/accounts"     element={<Accounts />} />
                <Route path="/accounts/new" element={<NewAccount />} />
                <Route path="/accounts/:id" element={<AccountDetail />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transfer"     element={<Transfer />} />
                <Route path="/deposit"      element={<Deposit />} />
                <Route path="/withdraw"     element={<Withdraw />} />
                <Route path="/analytics"    element={<Analytics />} />
                <Route path="/security"     element={<Security />} />
                <Route path="/profile"      element={<Profile />} />
                <Route path="/settings"     element={<Settings />} />
                <Route path="/help"         element={<Help />} />
              </Route>

              <Route element={<PrivateRoute adminOnly><Layout /></PrivateRoute>}>
                <Route path="/admin/dashboard"    element={<AdminDashboard />} />
                <Route path="/admin/users"        element={<AdminUsers />} />
                <Route path="/admin/accounts"     element={<AdminAccounts />} />
                <Route path="/admin/transactions" element={<AdminTransactions />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}
