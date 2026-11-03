import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import RegisterComplaint from './pages/RegisterComplaint';
import TrackComplaint from './pages/TrackComplaint';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import Contact from './pages/Contact';

// Dynamic CMS Engine
import { ThemeProvider } from './context/ThemeContext';
import { DynamicPageRenderer } from './components/dynamic/DynamicPageRenderer';

// Customer Portal Pages
import { CustomerAuthProvider, useCustomerAuth } from './context/CustomerAuthContext';
import CustomerRegister from './pages/CustomerRegister';
import CustomerLogin from './pages/CustomerLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerProfile from './pages/CustomerProfile';

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
    <ErrorBoundary>
      <CustomerAuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Core Dynamic Pages */}
                <Route index element={<Home />} />
                
                {/* Support & Complaints */}
                <Route path="complaint/register" element={<RegisterComplaint />} />
                <Route path="complaint/track" element={<TrackComplaint />} />
                <Route path="warranty/check" element={<Navigate to="/" replace />} />
                <Route path="warranty/register" element={<Navigate to="/" replace />} />
                <Route path="showroom-billing" element={<Navigate to="/" replace />} />
                
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
                <Route path="customer/wallet" element={<Navigate to="/customer/dashboard" replace />} />
                <Route path="customer/referrals" element={<Navigate to="/customer/dashboard" replace />} />
                <Route path="customer/purchases" element={<Navigate to="/customer/dashboard" replace />} />
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
                
                {/* Arbitrary CMS Pages created by Admin (e.g. /p/dealership, /p/diwali-deal) */}
                <Route path="p/:slug" element={<DynamicPageRenderer />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </CustomerAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
