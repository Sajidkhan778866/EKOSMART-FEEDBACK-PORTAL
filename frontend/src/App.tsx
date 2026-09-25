import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="complaint/register" element={<RegisterComplaint />} />
          <Route path="complaint/track" element={<TrackComplaint />} />
          <Route path="warranty/check" element={<WarrantyCheck />} />
          <Route path="warranty/register" element={<WarrantyRegister />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-conditions" element={<TermsConditions />} />
          <Route path="refund-policy" element={<RefundPolicy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
