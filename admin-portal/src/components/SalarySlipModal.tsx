import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Copy,
  CheckCircle2,
  DollarSign,
  Calendar,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';
import { billTemplateApi } from '../api/client';
import { normalizeTemplate, type IBillTemplate } from './BillTemplateDesigner';

interface SalarySlipModalProps {
  employee: any;
  onClose: () => void;
}

// Convert numbers to Indian Rupees in words
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

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const SalarySlipModal: React.FC<SalarySlipModalProps> = ({ employee, onClose }) => {
  const [template, setTemplate] = useState<IBillTemplate | null>(null);
  const [copied, setCopied] = useState(false);

  // Pay Period State
  const currentDate = new Date();
  const currentMonthIdx = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1; // Previous month by default
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[currentMonthIdx]);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  // Attendance State
  const [totalDays, setTotalDays] = useState(30);
  const [presentDays, setPresentDays] = useState(28);
  const [leaveDays, setLeaveDays] = useState(2);

  // Bank & Identification Details
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [bankAccount, setBankAccount] = useState(`50200${(employee?.mobile || '8899').slice(-6)}`);
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [panNumber, setPanNumber] = useState(`ABCDE${(employee?.mobile || '1234').slice(-4)}F`);
  const [uanNumber, setUanNumber] = useState(`10123456${(employee?.mobile || '78').slice(-4)}`);
  const [paymentMode, setPaymentMode] = useState('Bank Transfer (NEFT/RTGS)');

  // Earnings State
  const [basicPay, setBasicPay] = useState(24000);
  const [hra, setHra] = useState(9600);
  const [conveyance, setConveyance] = useState(2500);
  const [specialAllowance, setSpecialAllowance] = useState(4500);
  const [overtime, setOvertime] = useState(1500);

  // Deductions State
  const [epf, setEpf] = useState(1800);
  const [esi, setEsi] = useState(450);
  const [profTax, setProfTax] = useState(200);
  const [tds, setTds] = useState(0);
  const [advance, setAdvance] = useState(0);

  // Calculations
  const grossEarnings = basicPay + hra + conveyance + specialAllowance + overtime;
  const totalDeductions = epf + esi + profTax + tds + advance;
  const netPay = Math.max(0, grossEarnings - totalDeductions);
  const amountInWords = numberToWordsINR(netPay);

  useEffect(() => {
    fetchActiveSalaryTemplate();
  }, []);

  const fetchActiveSalaryTemplate = async () => {
    try {
      const res = await billTemplateApi.getActive('Salary');
      if (res.data?.success && res.data.data) {
        setTemplate(normalizeTemplate(res.data.data));
      } else {
        setTemplate(normalizeTemplate({ templateType: 'Salary', name: 'Official Salary Slip' }));
      }
    } catch {
      setTemplate(normalizeTemplate({ templateType: 'Salary', name: 'Official Salary Slip' }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summary = `
========================================
EKOSMART EV BATTERY SOLUTION
SALARY SLIP - ${selectedMonth.toUpperCase()} ${selectedYear}
========================================
Employee ID   : ${employee?.employeeId || 'EMP-XXXX'}
Name          : ${employee?.name || 'Employee'}
Designation   : ${employee?.designation || 'Staff'}
Department    : ${employee?.department || 'General'}
Division      : ${Array.isArray(employee?.division) ? employee.division.join(', ') : employee?.division || 'Battery'}
Working Days  : ${totalDays} (Present: ${presentDays}, Leave: ${leaveDays})
Bank Account  : ${bankAccount} (${bankName})
----------------------------------------
GROSS EARNINGS: ₹${grossEarnings.toLocaleString('en-IN')}
- Basic Pay   : ₹${basicPay.toLocaleString('en-IN')}
- HRA         : ₹${hra.toLocaleString('en-IN')}
- Conveyance  : ₹${conveyance.toLocaleString('en-IN')}
- Special All.: ₹${specialAllowance.toLocaleString('en-IN')}
- Overtime    : ₹${overtime.toLocaleString('en-IN')}
----------------------------------------
TOTAL DEDUCTIONS: ₹${totalDeductions.toLocaleString('en-IN')}
- EPF (12%)   : ₹${epf.toLocaleString('en-IN')}
- ESI         : ₹${esi.toLocaleString('en-IN')}
- Prof. Tax   : ₹${profTax.toLocaleString('en-IN')}
- TDS / Tax   : ₹${tds.toLocaleString('en-IN')}
----------------------------------------
NET PAYABLE SALARY : ₹${netPay.toLocaleString('en-IN')}
(${amountInWords})
========================================
`;
    navigator.clipboard.writeText(summary.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const tpl = template || normalizeTemplate({ templateType: 'Salary' });
  const primaryColor = tpl.theme?.primaryColor || '#059669';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[94vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Employee Official Salary Slip Generator</h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Soft-Coded
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generating payslip for <span className="text-white font-bold">{employee?.name}</span> ({employee?.employeeId})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/30"
            >
              <Printer size={14} />
              <span>Print Official Payslip</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Main Body Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50">
          {/* Left Side: Interactive Salary Adjustment Inputs */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            {/* Pay Period & Attendance Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2 border-b border-slate-100 pb-2">
                <Calendar size={15} className="text-emerald-600" />
                <span>Pay Period & Attendance Days</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Year</label>
                  <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Working Days</label>
                  <input
                    type="number"
                    value={totalDays}
                    onChange={(e) => setTotalDays(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Paid Days</label>
                  <input
                    type="number"
                    value={presentDays}
                    onChange={(e) => setPresentDays(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Leaves</label>
                  <input
                    type="number"
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center font-bold text-rose-600"
                  />
                </div>
              </div>
            </div>

            {/* Earnings Allowances Inputs */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <DollarSign size={15} className="text-emerald-600" />
                  <span>Gross Earnings & Allowances</span>
                </h4>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                  ₹{grossEarnings.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">Basic Salary</span>
                  <input
                    type="number"
                    value={basicPay}
                    onChange={(e) => setBasicPay(parseInt(e.target.value) || 0)}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <input
                    type="number"
                    value={hra}
                    onChange={(e) => setHra(parseInt(e.target.value) || 0)}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">Conveyance Allowance</span>
                  <input
                    type="number"
                    value={conveyance}
                    onChange={(e) => setConveyance(parseInt(e.target.value) || 0)}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">Special / Performance Allowance</span>
                  <input
                    type="number"
                    value={specialAllowance}
                    onChange={(e) => setSpecialAllowance(parseInt(e.target.value) || 0)}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">Overtime & Incentives</span>
                  <input
                    type="number"
                    value={overtime}
                    onChange={(e) => setOvertime(parseInt(e.target.value) || 0)}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Deductions Inputs */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <CreditCard size={15} className="text-rose-600" />
                  <span>Statutory Deductions & Recoveries</span>
                </h4>
                <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg">
                  ₹{totalDeductions.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">Provident Fund (EPF 12%)</span>
                  <input
                    type="number"
                    value={epf}
                    onChange={(e) => setEpf(parseInt(e.target.value) || 0)}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold text-rose-700"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">Employee State Insurance (ESI)</span>
                  <input
                    type="number"
                    value={esi}
                    onChange={(e) => setEsi(parseInt(e.target.value) || 0)}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold text-rose-700"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">Professional Tax (PT)</span>
                  <input
                    type="number"
                    value={profTax}
                    onChange={(e) => setProfTax(parseInt(e.target.value) || 0)}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold text-rose-700"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">TDS / Income Tax</span>
                  <input
                    type="number"
                    value={tds}
                    onChange={(e) => setTds(parseInt(e.target.value) || 0)}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold text-rose-700"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">Salary Advance / Loan</span>
                  <input
                    type="number"
                    value={advance}
                    onChange={(e) => setAdvance(parseInt(e.target.value) || 0)}
                    className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold text-rose-700"
                  />
                </div>
              </div>
            </div>

            {/* Banking Details Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2 border-b border-slate-100 pb-2">
                <CreditCard size={15} className="text-indigo-600" />
                <span>Bank Disbursal & Statutory Numbers</span>
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">UAN / PF Number</label>
                  <input
                    type="text"
                    value={uanNumber}
                    onChange={(e) => setUanNumber(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Disbursal Mode</label>
                  <input
                    type="text"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: OFFICIAL PRINTABLE PAYSLIP PREVIEW */}
          <div className="lg:col-span-7">
            <div
              id="printable-salary-slip"
              className="bg-white p-6 sm:p-8 rounded-2xl border-2 shadow-xl space-y-5 text-slate-900 font-sans text-xs relative overflow-hidden"
              style={{ borderColor: primaryColor }}
            >
              {/* Watermark */}
              {tpl.theme?.showWatermark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none rotate-[-25deg] text-5xl font-black tracking-widest text-slate-900">
                  {tpl.theme.watermarkText || 'CONFIDENTIAL PAYSLIP'}
                </div>
              )}

              {/* Company Header */}
              <div className="flex justify-between items-start border-b-2 pb-4" style={{ borderColor: primaryColor }}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                    <h1 className="text-base font-black tracking-tight" style={{ color: primaryColor }}>
                      {tpl.companyProfile?.businessName || 'EKOSMART EV BATTERY SOLUTION'}
                    </h1>
                  </div>
                  {tpl.companyProfile?.tagline && (
                    <p className="text-[10px] text-slate-500 font-semibold">{tpl.companyProfile.tagline}</p>
                  )}
                  <p className="text-[10px] text-slate-600 max-w-sm mt-0.5">{tpl.companyProfile?.address}</p>
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-0.5">
                    <span>Ph: {tpl.companyProfile?.phone}</span>
                    <span>•</span>
                    <span>Email: {tpl.companyProfile?.email}</span>
                  </div>
                  {tpl.companyProfile?.gstin && (
                    <div className="text-[10px] font-mono font-bold text-slate-700">
                      GSTIN: <span className="text-slate-900">{tpl.companyProfile.gstin}</span>
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
                    {selectedMonth} {selectedYear}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Slip Ref: EBS-SLIP-{employee?.employeeId}-{selectedMonth.slice(0, 3).toUpperCase()}{selectedYear.slice(-2)}
                  </div>
                  <div className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>

              {/* Employee Details Grid */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Employee Name</span>
                  <span className="font-bold text-slate-800 text-xs">{employee?.name || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Employee ID</span>
                  <span className="font-mono font-bold text-emerald-700 text-xs">{employee?.employeeId || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Department</span>
                  <span className="font-semibold text-slate-700 text-xs">{employee?.department || 'Operations'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Designation</span>
                  <span className="font-semibold text-slate-700 text-xs">{employee?.designation || 'Specialist'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Division / Scope</span>
                  <span className="font-semibold text-slate-700 text-xs">
                    {Array.isArray(employee?.division) ? employee.division.join(', ') : employee?.division || 'Battery'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Paid / Working Days</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {presentDays} / {totalDays} Days
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bank Account #</span>
                  <span className="font-mono text-slate-700 text-xs">{bankAccount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bank & IFSC</span>
                  <span className="font-mono text-slate-700 text-xs">{ifscCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">PAN Card Number</span>
                  <span className="font-mono text-slate-700 text-xs">{panNumber}</span>
                </div>
              </div>

              {/* Side-by-Side Earnings vs Deductions Table */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left: Earnings Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-emerald-50 text-emerald-900 font-bold p-2.5 text-xs border-b border-emerald-100 flex justify-between">
                    <span>EARNINGS (ALLOWANCES)</span>
                    <span>AMOUNT (₹)</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-2 flex justify-between">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-mono font-semibold">₹{basicPay.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 flex justify-between">
                      <span className="text-slate-600">House Rent Allowance (HRA)</span>
                      <span className="font-mono font-semibold">₹{hra.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 flex justify-between">
                      <span className="text-slate-600">Conveyance Allowance</span>
                      <span className="font-mono font-semibold">₹{conveyance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 flex justify-between">
                      <span className="text-slate-600">Special Allowance</span>
                      <span className="font-mono font-semibold">₹{specialAllowance.toLocaleString('en-IN')}</span>
                    </div>
                    {overtime > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">Overtime & Incentives</span>
                        <span className="font-mono font-semibold">₹{overtime.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-emerald-50/70 p-2.5 border-t border-emerald-200 flex justify-between font-bold text-emerald-950">
                    <span>GROSS EARNINGS:</span>
                    <span className="font-mono">₹{grossEarnings.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Right: Deductions Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-rose-50 text-rose-900 font-bold p-2.5 text-xs border-b border-rose-100 flex justify-between">
                    <span>DEDUCTIONS</span>
                    <span>AMOUNT (₹)</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-2 flex justify-between">
                      <span className="text-slate-600">Provident Fund (EPF)</span>
                      <span className="font-mono font-semibold text-rose-700">₹{epf.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 flex justify-between">
                      <span className="text-slate-600">ESI Contribution</span>
                      <span className="font-mono font-semibold text-rose-700">₹{esi.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 flex justify-between">
                      <span className="text-slate-600">Professional Tax (PT)</span>
                      <span className="font-mono font-semibold text-rose-700">₹{profTax.toLocaleString('en-IN')}</span>
                    </div>
                    {tds > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">TDS / Income Tax</span>
                        <span className="font-mono font-semibold text-rose-700">₹{tds.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {advance > 0 && (
                      <div className="p-2 flex justify-between">
                        <span className="text-slate-600">Loan / Advance Recovery</span>
                        <span className="font-mono font-semibold text-rose-700">₹{advance.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-rose-50/70 p-2.5 border-t border-rose-200 flex justify-between font-bold text-rose-950">
                    <span>TOTAL DEDUCTIONS:</span>
                    <span className="font-mono">₹{totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Highlighted Net Payable Salary Box */}
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
                    <span className="font-bold not-italic text-slate-800">In Words:</span> {amountInWords}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Disbursal Mode: <span className="font-semibold text-slate-700">{paymentMode}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black font-mono tracking-tight" style={{ color: primaryColor }}>
                    ₹{netPay.toLocaleString('en-IN')}
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                    Verified & Disbursed
                  </span>
                </div>
              </div>

              {/* Footer Policy & Signatures */}
              <div className="border-t pt-4 grid grid-cols-2 gap-4 text-[10px] text-slate-500">
                <div className="space-y-1">
                  <div className="font-bold text-slate-700 uppercase">Confidentiality & Statutory Terms</div>
                  <p>1. This payslip is a confidential document generated by EKOSMART Payroll Engine.</p>
                  <p>2. Discrepancies must be notified to HR within 7 days of salary credit.</p>
                  <p>3. PF & ESIC remittances are filed under official employer code.</p>
                </div>

                <div className="text-right flex flex-col justify-between items-end">
                  <div>
                    <div className="font-bold text-slate-800">
                      {tpl.footer?.authorizedSignatoryLabel || 'For EKOSMART EV BATTERY SOLUTION'}
                    </div>
                    <div className="text-[9px] text-slate-400">Head Office & Central Plant, Kota</div>
                  </div>

                  <div className="pt-6">
                    <div className="border-t border-slate-300 w-40 text-center text-[10px] font-bold text-slate-700">
                      {tpl.footer?.signatoryName || 'Authorized HR Signatory'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlipModal;
