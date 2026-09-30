import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  ShoppingBag,
  FileText,
  Printer,
  ShieldCheck,
  Search,
  RefreshCw,
  Coins,
  Package,
  X,
} from 'lucide-react';
import axios from 'axios';
import { API_BASE, resolveImageUrl } from '../config/api';

export default function CustomerPurchases() {
  const { token } = useCustomerAuth();
  const navigate = useNavigate();

  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<any | null>(null);

  const fetchPurchases = async () => {
    if (!token) {
      navigate('/customer/login');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/customers/me/purchases`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setBills(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch customer purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [token]);

  const filteredBills = bills.filter((b) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const matchInv = b.invoiceNumber && b.invoiceNumber.toLowerCase().includes(s);
    const matchProd = (b.items || []).some(
      (it: any) =>
        (it.productName && it.productName.toLowerCase().includes(s)) ||
        (it.productSerial && it.productSerial.toLowerCase().includes(s)) ||
        (it.batterySerial && it.batterySerial.toLowerCase().includes(s))
    );
    return matchInv || matchProd;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-blue-100 text-blue-600">
              <ShoppingBag size={26} />
            </span>
            <span>My Purchases & Invoices</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            View and download official GST tax invoices and verify purchased products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice or serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>
          <button
            onClick={fetchPurchases}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {filteredBills.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="inline-flex p-4 rounded-3xl bg-blue-50 text-blue-600">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Purchase Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you purchase EV batteries, chargers, or accessories from an Ekosmart showroom, your bills and warranties will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBills.map((bill) => (
            <div
              key={bill._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">TAX INVOICE</span>
                    <h3 className="text-base font-black text-slate-900 font-mono">{bill.invoiceNumber}</h3>
                    <span className="text-xs text-slate-500">
                      {new Date(bill.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {bill.paymentStatus || 'Paid'}
                  </span>
                </div>

                {/* Items in Bill */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {(bill.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                      {item.productImage ? (
                        <img
                          src={resolveImageUrl(item.productImage)}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-white"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <Package size={20} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{item.productName}</h4>
                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          {(item.productSerial || item.batterySerial) && (
                            <p className="font-mono text-[10px] text-slate-600 truncate">
                              S/N: {item.batterySerial || item.productSerial}
                            </p>
                          )}
                          <p>Qty: {item.quantity} • ₹{item.unitPrice?.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Total Bill Amount</span>
                  <strong className="text-lg font-black text-slate-900">
                    ₹{bill.grandTotal?.toLocaleString('en-IN')}
                  </strong>
                </div>

                {bill.purchaseRewardAwarded && (
                  <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Coins size={14} className="text-amber-600" />
                      <span>Purchase Coins Credited</span>
                    </span>
                    <strong className="text-amber-700">+{bill.rewardCoinsAwarded || 500} Coins</strong>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBill(bill)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText size={14} />
                  <span>View Bill PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bill Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Official GST Invoice
                </span>
                <h2 className="text-xl font-black text-slate-900 font-mono mt-1">{selectedBill.invoiceNumber}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Invoice Container */}
            <div id="printable-bill-content" className="space-y-6 text-xs text-slate-800">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">EKOSMART EV BATTERY SOLUTION</h3>
                  <p className="text-slate-500 text-[11px]">Kota Central Showroom & Service Plant</p>
                  <p className="text-slate-500 text-[11px]">GSTIN: 08DTUPM4205B1Z0</p>
                  <p className="text-slate-500 text-[11px]">Helpline: +91 8949049003</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-bold text-slate-900">Billed To:</p>
                  <p className="font-bold text-emerald-700">{selectedBill.customerName}</p>
                  <p className="text-slate-500">{selectedBill.customerMobile}</p>
                  {selectedBill.customerEmail && <p className="text-slate-500">{selectedBill.customerEmail}</p>}
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    Date: {new Date(selectedBill.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <th className="py-2">Item Description</th>
                      <th className="py-2">Serial / Battery #</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Price</th>
                      <th className="py-2 text-right">GST</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedBill.items || []).map((it: any, i: number) => (
                      <tr key={i}>
                        <td className="py-3 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            {it.productImage && (
                              <img
                                src={resolveImageUrl(it.productImage)}
                                alt=""
                                className="w-8 h-8 rounded object-cover border border-slate-200"
                              />
                            )}
                            <div>
                              <span>{it.productName}</span>
                              <span className="block text-[10px] text-slate-500 font-normal">
                                {it.warrantyPeriodMonths} Mos Warranty
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-[11px] text-slate-600">
                          {it.batterySerial || it.productSerial || 'N/A'}
                        </td>
                        <td className="py-3 text-center">{it.quantity}</td>
                        <td className="py-3 text-right font-mono">₹{it.unitPrice?.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-right font-mono">{it.taxRate}%</td>
                        <td className="py-3 text-right font-bold font-mono">₹{it.totalAmount?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="p-4 rounded-2xl bg-slate-50 space-y-1.5 text-right font-mono border border-slate-200/60">
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Subtotal:</span>
                  <span>₹{selectedBill.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {selectedBill.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-600 text-xs">
                    <span>Discount:</span>
                    <span>-₹{selectedBill.discountTotal?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>GST Tax Total:</span>
                  <span>₹{selectedBill.taxTotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-emerald-700">₹{selectedBill.grandTotal?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Warranty Notice */}
              {selectedBill.warrantyGenerated && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-xs">
                    Official Warranty Registered. Active certificates linked to your phone number.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer size={15} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
