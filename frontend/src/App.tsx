import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RegisterComplaint from './pages/RegisterComplaint';
import TrackComplaint from './pages/TrackComplaint';
import WarrantyCheck from './pages/WarrantyCheck';
import WarrantyRegister from './pages/WarrantyRegister';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import Contact from './pages/Contact';

// Customer Portal Pages
import { CustomerAuthProvider, useCustomerAuth } from './context/CustomerAuthContext';
import CustomerRegister from './pages/CustomerRegister';
import CustomerLogin from './pages/CustomerLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerWallet from './pages/CustomerWallet';
import CustomerReferrals from './pages/CustomerReferrals';
import CustomerPurchases from './pages/CustomerPurchases';
import CustomerProfile from './pages/CustomerProfile';
import ShowroomBillingPublic from './pages/ShowroomBillingPublic';

// Protected Customer Route Component
const ProtectedCustomerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useCustomerAuth();
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/customer/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <CustomerAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            
            {/* Support & Warranty */}
            <Route path="complaint/register" element={<RegisterComplaint />} />
            <Route path="complaint/track" element={<TrackComplaint />} />
            <Route path="warranty/check" element={<WarrantyCheck />} />
            <Route path="warranty/register" element={<WarrantyRegister />} />
            
            {/* Showroom Public Info */}
            <Route path="showroom-billing" element={<ShowroomBillingPublic />} />
            
            {/* Customer Authentication */}
            <Route path="customer/register" element={<CustomerRegister />} />
            <Route path="register" element={<CustomerRegister />} />
            <Route path="customer/login" element={<CustomerLogin />} />
            <Route path="login" element={<CustomerLogin />} />

            {/* Protected Customer Dashboard & Services */}
            <Route
              path="customer/dashboard"
              element={
                <ProtectedCustomerRoute>
                  <CustomerDashboard />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="customer/wallet"
              element={
                <ProtectedCustomerRoute>
                  <CustomerWallet />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="customer/referrals"
              element={
                <ProtectedCustomerRoute>
                  <CustomerReferrals />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="customer/purchases"
              element={
                <ProtectedCustomerRoute>
                  <CustomerPurchases />
                </ProtectedCustomerRoute>
              }
            />
            <Route
              path="customer/profile"
              element={
                <ProtectedCustomerRoute>
                  <CustomerProfile />
                </ProtectedCustomerRoute>
              }
            />

            {/* General Info & Policies */}
            <Route path="contact" element={<Contact />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CustomerAuthProvider>
  );
}

export default App;
