import { Toaster } from "./components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from './lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from './lib/AuthContext';
import UserNotRegisteredError from './components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AppLayout from './components/layout/AppLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserMangement';
import AuditLogs from './pages/admin/AuditLogs';
import Reports from './pages/admin/Reports';
import ManagerDashboard from './pages/manager/MangerDashboard';
import MedicineManagement from './pages/manager/MedicineMangement';
import ExpiryAlerts from './pages/manager/ExpiryAlerts';
import Suppliers from './pages/manager/Suppliers';
import PurchaseOrders from './pages/manager/PurchaseOrders';
import PharmacistPOS from './pages/pharmacist/PharmacistPOS';
import PharmacistOrders from './pages/pharmacist/PharmacistOrder';
import PrescriptionReview from './pages/pharmacist/PharmacistReview';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route element={<AppLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/audit" element={<AuditLogs />} />
        <Route path="/admin/reports" element={<Reports />} />

        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/medicines" element={<MedicineManagement />} />
        <Route path="/manager/expiry" element={<ExpiryAlerts />} />
        <Route path="/manager/suppliers" element={<Suppliers />} />
        <Route path="/manager/purchase-orders" element={<PurchaseOrders />} />

        {/* Pharmacist Routes */}
        <Route path="/pharmacist" element={<PharmacistPOS />} />
        <Route path="/pharmacist/orders" element={<PharmacistOrders />} />
        <Route path="/pharmacist/prescriptions" element={<PrescriptionReview />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App