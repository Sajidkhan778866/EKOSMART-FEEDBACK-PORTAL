import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { API_BASE } from '../config/api';

const defaultRefund = {
  title: 'Refund & Replacement Policy',
  content: `Defective battery cells and genuine spare parts verified under valid active warranty will be repaired or replaced free of charge by authorized Ekosmart service engineers within standard SLA timelines.

Security deposits for EV rental plans are refunded to the original payment source within 5-7 business days following vehicle return and technical handover clearance.`,
};

const RefundPolicy = () => {
  const [refund, setRefund] = useState(defaultRefund);
  const [lastUpdated, setLastUpdated] = useState<string>('Spare Parts, Battery, & Service Guidelines');

  useEffect(() => {
    fetch(`${API_BASE}/content/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.refundPolicy) {
          setRefund(data.data.refundPolicy);
          if (data.data.updatedAt) {
            setLastUpdated(`Last updated: ${new Date(data.data.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch refund policy from CMS:', err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
          <RefreshCw size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{refund.title || 'Refund & Replacement Policy'}</h1>
          <p className="text-slate-500 text-sm">{lastUpdated}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
        {refund.content}
      </div>
    </div>
  );
};

export default RefundPolicy;
