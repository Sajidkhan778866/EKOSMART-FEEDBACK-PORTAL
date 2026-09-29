import { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Copy,
  CheckCircle2,
  Loader2,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { employeeApi, billTemplateApi } from '../api/client';
import { printElement } from '../utils/print';

export const numberToWordsINR = (num: number): string => {
  if (isNaN(num) || num <= 0) return 'Zero Rupees Only';
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
    } else {
      str += a[n];
    }
    return str.trim();
  };

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundredAndBelow = num;

  let res = '';
  if (crore > 0) res += inWords(crore) + ' Crore ';
  if (lakh > 0) res += inWords(lakh) + ' Lakh ';
  if (thousand > 0) res += inWords(thousand) + ' Thousand ';
  if (hundredAndBelow > 0) res += inWords(hundredAndBelow);

  return (res.trim() + ' Rupees Only').replace(/\s+/g, ' ');
};

const MySalarySlip = () => {
  const { user } = useAuth();
  const [payslips, setPayslips] = useState<any[]>([]);
  const [selectedSlip, setSelectedSlip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchMyPayslips();
    fetchActiveSalaryTemplate();
  }, []);

  const fetchActiveSalaryTemplate = async () => {
    try {
      const res = await billTemplateApi.getActive('Salary');
      if (res.data?.success && res.data.data) {
        setTemplate(res.data.data);
      }
    } catch {
      // ignore
    }
  };

  const fetchMyPayslips = async () => {
    try {
      setLoading(true);
      const res = await employeeApi.getMyPayslips();
      if (res.data?.success && Array.isArray(res.data.data)) {
        setPayslips(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedSlip(res.data.data[0]); // Most recent payslip by default
        }
      }
    } catch (err) {
      console.error('Failed to load payslips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    printElement(
      'printable-payslip',
      `EKOSMART_Payslip_${user?.employeeId || 'STAFF'}_${selectedSlip?.month || ''}_${selectedSlip?.year || ''}`
    );
  };

  const handleCopy = () => {
    if (!selectedSlip) return;
    const text = `EKOSMART SALARY SLIP: ${selectedSlip.month} ${selectedSlip.year} | Employee: ${user?.name} (${user?.employeeId}) | Net Payable: ₹${(selectedSlip.netPayable || 0).toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const primaryColor = template?.theme?.primaryColor || '#059669';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">My Monthly Salary Slip</h2>
            <p className="text-xs text-slate-500">
              Official employee remuneration statements issued by HR & Accounts
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {payslips.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500">Select Pay Period:</label>
              <select
                value={selectedSlip?._id || ''}
                onChange={(e) => {
                  const found = payslips.find((p) => p._id === e.target.value);
                  if (found) setSelectedSlip(found);
                }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
              >
                {payslips.map((slip) => (
                  <option key={slip._id} value={slip._id}>
                    {slip.month} {slip.year} (₹{(slip.netPayable || 0).toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedSlip && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/20"
                title="Print official payslip or choose 'Save as PDF' in the print dialog"
              >
                <Printer size={14} />
                <span>Print / Save PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Embedded Print Isolation Style */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-payslip,
          #printable-payslip * {
            visibility: visible !important;
          }
          #printable-payslip {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            border: 2px solid ${primaryColor} !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #0f172a !important;
            z-index: 999999 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400 space-y-3">
          <Loader2 size={36} className="animate-spin text-emerald-600" />
          <p className="text-sm font-semibold">Loading your official payslip records...</p>
        </div>
      ) : !selectedSlip ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 shadow-sm text-center text-slate-500 space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <FileSpreadsheet size={32} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No Payslips Issued Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Your HR and Accounts department has not generated a published salary slip for your profile yet. Once issued at
              the end of the pay cycle, your verified statement will appear here with full earnings, statutory deductions, and
              print options.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono">
            <Building size={14} className="text-emerald-600" />
            <span>Ekosmart EV Battery Solution — Payroll Engine</span>
          </div>
        </div>
      ) : (
        /* Printable Payslip Card */
        <div
          id="printable-payslip"
          className="bg-white p-6 sm:p-8 rounded-3xl border-2 shadow-xl space-y-5 text-slate-900 font-sans text-xs relative overflow-hidden"
          style={{ borderColor: primaryColor }}
        >
          {/* Watermark */}
          {template?.theme?.showWatermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none rotate-[-25deg] text-5xl font-black tracking-widest text-slate-900">
              {template?.theme?.watermarkText || 'CONFIDENTIAL PAYSLIP'}
            </div>
          )}

          {/* Company Header */}
          <div className="flex justify-between items-start border-b-2 pb-4" style={{ borderColor: primaryColor }}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                <h1 className="text-base font-black tracking-tight" style={{ color: primaryColor }}>
                  {template?.companyProfile?.businessName || 'EKOSMART EV BATTERY SOLUTION'}
                </h1>
              </div>
              {template?.companyProfile?.tagline && (
                <p className="text-[10px] text-slate-500 font-semibold">{template.companyProfile.tagline}</p>
              )}
              <p className="text-[10px] text-slate-600 max-w-sm mt-0.5">
                {template?.companyProfile?.address || 'Head Office & Central Plant, Kota, Rajasthan'}
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-0.5">
                <span>Ph: {template?.companyProfile?.phone || '+91 8949049003'}</span>
                <span>•</span>
                <span>Email: {template?.companyProfile?.email || 'hr@ekosmartdrive.in'}</span>
              </div>
              {template?.companyProfile?.gstin && (
                <div className="text-[10px] font-mono font-bold text-slate-700">
                  GSTIN: <span className="text-slate-900">{template.companyProfile.gstin}</span>
                </div>
              )}
            </div>

            <div className="text-right space-y-1">
              <div
                className="inline-block px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider"
                style={{ backgroundColor: primaryColor }}
              >
                PAYSLIP
              </div>
              <div className="text-[11px] font-bold text-slate-700 uppercase">
                {selectedSlip.month} {selectedSlip.year}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Slip Ref: {selectedSlip.payslipNumber || `EBS-${selectedSlip.month?.slice(0, 3)}-${selectedSlip.year}`}
              </div>
              <div className="text-[10px] text-slate-400">
                Disbursed: {new Date(selectedSlip.generatedAt || selectedSlip.createdAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>

          {/* Employee Details Grid */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Employee Name</span>
              <span className="font-bold text-slate-800 text-xs">{user?.name || '-'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Employee ID</span>
              <span className="font-mono font-bold text-emerald-700 text-xs">{user?.employeeId || '-'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Department</span>
              <span className="font-semibold text-slate-700 text-xs">{user?.department || 'Operations'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Designation</span>
              <span className="font-semibold text-slate-700 text-xs">{user?.designation || 'Specialist'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Division</span>
              <span className="font-semibold text-slate-700 text-xs">
                {Array.isArray(user?.division) ? user.division.join(', ') : user?.division || 'Battery'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Paid / Working Days</span>
              <span className="font-bold text-slate-800 text-xs">
                {selectedSlip.paidDays || 30} / {selectedSlip.workingDays || 30} Days (Leaves:{' '}
                {selectedSlip.leaveDays || 0})
              </span>
            </div>
            {selectedSlip.bankDetails?.accountNumber && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Bank Account #</span>
                <span className="font-mono text-slate-700 text-xs">{selectedSlip.bankDetails.accountNumber}</span>
              </div>
            )}
            {selectedSlip.bankDetails?.ifscCode && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Bank & IFSC</span>
                <span className="font-mono text-slate-700 text-xs">
                  {selectedSlip.bankDetails.bankName ? `${selectedSlip.bankDetails.bankName} - ` : ''}
                  {selectedSlip.bankDetails.ifscCode}
                </span>
              </div>
            )}
            {selectedSlip.bankDetails?.panNumber && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">PAN Card Number</span>
                <span className="font-mono text-slate-700 text-xs">{selectedSlip.bankDetails.panNumber}</span>
              </div>
            )}
          </div>

          {/* Side-by-Side Earnings vs Deductions Table */}
          <div className="grid grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-emerald-50 text-emerald-950 font-bold p-2.5 text-xs border-b border-emerald-100 flex justify-between">
                <span>EARNINGS (ALLOWANCES)</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-2 flex justify-between">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-mono font-semibold">
                    ₹{(selectedSlip.basicSalary || selectedSlip.earnings?.basicSalary || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                {Array.isArray(selectedSlip.allowances) && selectedSlip.allowances.length > 0 ? (
                  selectedSlip.allowances.map((a: any, idx: number) => (
                    <div key={idx} className="p-2 flex justify-between">
                      <span className="text-slate-600">{a.label || a.key}</span>
                      <span className="font-mono font-semibold">
                        ₹{(Number(a.amount) || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    {(selectedSlip.earnings?.hra || 0) > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">House Rent Allowance (HRA)</span>
                        <span className="font-mono font-semibold">
                          ₹{selectedSlip.earnings.hra.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {(selectedSlip.earnings?.conveyance || 0) > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">Conveyance Allowance</span>
                        <span className="font-mono font-semibold">
                          ₹{selectedSlip.earnings.conveyance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {(selectedSlip.earnings?.specialAllowance || 0) > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">Special / Tech Allowance</span>
                        <span className="font-mono font-semibold">
                          ₹{selectedSlip.earnings.specialAllowance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {(selectedSlip.earnings?.overtime || 0) > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">Overtime & Field Pay</span>
                        <span className="font-mono font-semibold">
                          ₹{selectedSlip.earnings.overtime.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {Array.isArray(selectedSlip.bonuses) &&
                  selectedSlip.bonuses.map((b: any, idx: number) => (
                    <div key={`b-${idx}`} className="p-2 flex justify-between">
                      <span className="text-slate-600">{b.label || 'Bonus'}</span>
                      <span className="font-mono font-semibold">
                        ₹{(Number(b.amount) || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="bg-emerald-50/70 p-2.5 border-t border-emerald-200 flex justify-between font-bold text-emerald-950">
                <span>GROSS EARNINGS:</span>
                <span className="font-mono">₹{(selectedSlip.grossEarnings || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-rose-50 text-rose-950 font-bold p-2.5 text-xs border-b border-rose-100 flex justify-between">
                <span>DEDUCTIONS</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {Array.isArray(selectedSlip.deductions) && selectedSlip.deductions.length > 0 ? (
                  selectedSlip.deductions.map((d: any, idx: number) => (
                    <div key={idx} className="p-2 flex justify-between">
                      <span className="text-slate-600">{d.label || d.key}</span>
                      <span className="font-mono font-semibold text-rose-700">
                        ₹{(Number(d.amount) || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    {(selectedSlip.deductions?.epf || 0) > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">Provident Fund (EPF)</span>
                        <span className="font-mono font-semibold text-rose-700">
                          ₹{selectedSlip.deductions.epf.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {(selectedSlip.deductions?.esi || 0) > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">ESI Contribution</span>
                        <span className="font-mono font-semibold text-rose-700">
                          ₹{selectedSlip.deductions.esi.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {(selectedSlip.deductions?.professionalTax || 0) > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">Professional Tax (PT)</span>
                        <span className="font-mono font-semibold text-rose-700">
                          ₹{selectedSlip.deductions.professionalTax.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {(selectedSlip.deductions?.tds || 0) > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">TDS / Income Tax</span>
                        <span className="font-mono font-semibold text-rose-700">
                          ₹{selectedSlip.deductions.tds.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="bg-rose-50/70 p-2.5 border-t border-rose-200 flex justify-between font-bold text-rose-950">
                <span>TOTAL DEDUCTIONS:</span>
                <span className="font-mono">₹{(selectedSlip.totalDeductions || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Net Salary Box */}
          <div
            className="p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            style={{
              backgroundColor: `${primaryColor}0d`,
              borderColor: `${primaryColor}40`,
            }}
          >
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                NET SALARY PAYABLE (TAKE HOME)
              </div>
              <div className="text-xs text-slate-600 italic mt-0.5">
                <span className="font-bold not-italic text-slate-800">In Words:</span>{' '}
                {selectedSlip.amountInWords || numberToWordsINR(selectedSlip.netSalary || selectedSlip.netPayable || 0)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Disbursal Mode:{' '}
                <span className="font-semibold text-slate-700">
                  {selectedSlip.bankDetails?.paymentMode || selectedSlip.paymentMode || 'Bank Transfer (NEFT/RTGS)'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black font-mono tracking-tight" style={{ color: primaryColor }}>
                ₹{(selectedSlip.netSalary || selectedSlip.netPayable || 0).toLocaleString('en-IN')}
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                {selectedSlip.paymentStatus || selectedSlip.status || 'Disbursed & Audited'}
              </span>
            </div>
          </div>

          {/* Footer Policy & Signatures */}
          <div className="border-t pt-4 grid grid-cols-2 gap-4 text-[10px] text-slate-500">
            <div className="space-y-1">
              <div className="font-bold text-slate-700 uppercase">Company Policy & Terms</div>
              <p>1. This payslip is an official document generated by EKOSMART Payroll Engine.</p>
              <p>2. Discrepancies must be notified to HR within 7 days of salary credit.</p>
              <p>3. PF & ESIC remittances are filed under official employer code.</p>
            </div>

            <div className="text-right flex flex-col justify-between items-end">
              <div>
                <div className="font-bold text-slate-800">
                  {template?.footer?.authorizedSignatoryLabel || 'For EKOSMART EV BATTERY SOLUTION'}
                </div>
                <div className="text-[9px] text-slate-400">Head Office & Central Plant, Kota</div>
              </div>

              <div className="pt-6">
                <div className="border-t border-slate-300 w-40 text-center text-[10px] font-bold text-slate-700">
                  {template?.footer?.signatoryName || 'Authorized HR Signatory'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySalarySlip;
