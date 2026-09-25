import { useState, useEffect } from 'react';
import { FileText, ShieldCheck, AlertTriangle } from 'lucide-react';
import { EbsLogo } from '../components/EbsLogo';
import { API_BASE } from '../config/api';

const defaultTerms = {
  title: 'Terms & Conditions (EBS Battery & Spare Parts Policy)',
  content: `1. Service & Warranty Registration Terms:
By submitting a complaint, spare parts request, or warranty registration on this portal (www.ekosmartdrive.in), you confirm that all details provided (serial number, bill number, and issue descriptions) are accurate and authentic.

2. EBS EV Battery Warranty Specifications:
- 48V Series Lithium-Ion & LFP Batteries (48V 28Ah, 32Ah, 36Ah, 40Ah): Covered by a 3-Year Official Replacement & Service Warranty with Pan-India technical support.
- 60V Series EV Batteries (60V 28Ah, 32Ah, 36Ah, 40Ah): Covered by a 1.5-Year Official Warranty.
- 72V Series EV Batteries (72V 28Ah, 32Ah, 36Ah): Covered by a 1.5-Year Official Warranty.
- Aluminium Body Lithium Fast Chargers (67.2V / 72V, 6A - 10A): Covered by a 1-Year Official Warranty.

3. Pan-India Service & Transportation Policy:
- Ekosmart Battery Solution provides technical service support across all Indian states.
- In cases requiring factory laboratory inspection or battery pack replacement dispatch from Kota Plant, transportation & freight charges are extra as per standard logistics rates.

4. Warranty Exclusions & Safety Guidelines:
- Battery warranty remains void if the protective seal is broken, casing is tampered with by unauthorized personnel, or if the unit suffers from deep over-discharge, mechanical crush, or direct water immersion.
- Customers must strictly use authorized EBS aluminium body chargers matching rated voltage/amperage specifications.

5. Authorized Divisions:
Service complaints are categorized and handled under four designated divisions: Battery, Rental, Showroom, and Spare Parts. Warranty claims for commercial industrial units fall under the Plant category.`,
};

const TermsConditions = () => {
  const [terms, setTerms] = useState(defaultTerms);
  const [lastUpdated, setLastUpdated] = useState<string>('Official Service Agreement');

  useEffect(() => {
    fetch(`${API_BASE}/content/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.termsConditions) {
          setTerms(data.data.termsConditions);
          if (data.data.updatedAt) {
            setLastUpdated(`Last updated: ${new Date(data.data.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch terms & conditions from CMS:', err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{terms.title}</h1>
            <p className="text-slate-500 text-xs md:text-sm mt-0.5">{lastUpdated} • Ekosmart Battery Solution</p>
          </div>
        </div>
        <EbsLogo variant="battery" size="sm" showText={false} />
      </div>

      {/* Official Warranty Tier Reference Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" size={20} />
          <span>EBS Official Warranty & Product Classification Table</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Battery / Product Series</th>
                <th className="py-3 px-4">Official Warranty</th>
                <th className="py-3 px-4">Approx Range (KM)</th>
                <th className="py-3 px-4">Service Area</th>
                <th className="py-3 px-4">Transport / Freight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-emerald-800">48V Series (28Ah, 32Ah, 36Ah, 40Ah)</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">3 Years</span></td>
                <td className="py-3 px-4">45 – 70 KM</td>
                <td className="py-3 px-4 font-semibold text-slate-800">Pan-India Support</td>
                <td className="py-3 px-4 text-slate-500">Extra as applicable</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-blue-800">60V Series (28Ah, 32Ah, 36Ah, 40Ah)</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">1.5 Years</span></td>
                <td className="py-3 px-4">50 – 120 KM</td>
                <td className="py-3 px-4 font-semibold text-slate-800">Pan-India Support</td>
                <td className="py-3 px-4 text-slate-500">Extra as applicable</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-purple-800">72V Series (28Ah, 32Ah, 36Ah)</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-bold">1.5 Years</span></td>
                <td className="py-3 px-4">60 – 120 KM</td>
                <td className="py-3 px-4 font-semibold text-slate-800">Pan-India Support</td>
                <td className="py-3 px-4 text-slate-500">Extra as applicable</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-amber-800">Lithium Aluminium Fast Chargers (67.2V / 72V)</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">1 Year</span></td>
                <td className="py-3 px-4">6A – 10A Fast Charge</td>
                <td className="py-3 px-4 font-semibold text-slate-800">Pan-India Support</td>
                <td className="py-3 px-4 text-slate-500">Extra as applicable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Dynamic Terms Content */}
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 space-y-6 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
        {terms.content}
      </div>

      {/* Safety Notice Callout */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-start gap-4 text-xs text-amber-900">
        <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={22} />
        <div>
          <span className="font-bold block text-sm mb-1">Important Safety & Maintenance Guideline:</span>
          <p className="leading-relaxed">
            Always charge EBS Lithium packs with certified Ekosmart aluminium body fast chargers. Do not open or tamper with the battery BMS enclosure. For technical guidance, contact our Kota Central Plant helpline at <b>+91 8949049003</b> (10:00 AM – 6:30 PM).
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
