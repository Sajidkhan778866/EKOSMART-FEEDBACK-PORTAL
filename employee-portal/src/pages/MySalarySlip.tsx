import { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

const numberToWordsINR = (num: number): string => {
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
  const [copied, setCopied] = useState(false);

  const currentDate = new Date();
  const currentMonthIdx = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[currentMonthIdx]);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  // Attendance
  const totalDays = 30;
  const presentDays = 28;
  const leaveDays = 2;

  // Earnings
  const basicPay = 25000;
  const hra = 10000;
  const conveyance = 3000;
  const specialAllowance = 5000;
  const overtime = 0;

  // Deductions
  const epf = 1800;
  const esi = 500;
  const profTax = 200;
  const tds = 0;

  const grossEarnings = basicPay + hra + conveyance + specialAllowance + overtime;
  const totalDeductions = epf + esi + profTax + tds;
  const netPay = grossEarnings - totalDeductions;
  const amountInWords = numberToWordsINR(netPay);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `EKOSMART SALARY SLIP: ${selectedMonth} ${selectedYear} | Employee: ${user?.name} (${user?.employeeId}) | Net Pay: ₹${netPay.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">My Monthly Salary Slip</h2>
            <p className="text-xs text-slate-500">Official soft-coded employee remuneration statement</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-20 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center"
            />
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/20"
          >
            <Printer size={14} />
            <span>Print Official Payslip</span>
          </button>
        </div>
      </div>

      {/* Printable Payslip Card */}
      <div
        id="printable-payslip"
        className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-600 shadow-xl space-y-5 text-slate-900 font-sans text-xs"
      >
        {/* Company Header */}
        <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-600" />
              <h1 className="text-base font-black tracking-tight text-emerald-800">
                EKOSMART EV BATTERY SOLUTION
              </h1>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold">Clean Energy & Smart Electric Mobility</p>
            <p className="text-[10px] text-slate-600 max-w-sm mt-0.5">
              Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-0.5">
              <span>Ph: +91 8949049003</span>
              <span>•</span>
              <span>Email: hr@ekosmartdrive.in</span>
            </div>
            <div className="text-[10px] font-mono font-bold text-slate-700">
              GSTIN: <span className="text-slate-900">08DTUPM4205B1Z0</span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-block px-3 py-1 rounded-lg text-white font-black text-xs tracking-wider bg-emerald-600">
              PAYSLIP
            </div>
            <div className="text-[11px] font-bold text-slate-700 uppercase">
              {selectedMonth} {selectedYear}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Slip Ref: EBS-SLIP-{(user?.employeeId || 'EMP').toUpperCase()}-{selectedMonth.slice(0, 3).toUpperCase()}{selectedYear.slice(-2)}
            </div>
            <div className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        {/* Employee Details Grid */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Employee Name</span>
            <span className="font-bold text-slate-800 text-xs">{user?.name || 'Staff Member'}</span>
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
            <span className="font-semibold text-slate-700 text-xs">{user?.designation || 'Staff'}</span>
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
              {presentDays} / {totalDays} Days (Leaves: {leaveDays})
            </span>
          </div>
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
            </div>
            <div className="bg-emerald-50/70 p-2.5 border-t border-emerald-200 flex justify-between font-bold text-emerald-950">
              <span>GROSS EARNINGS:</span>
              <span className="font-mono">₹{grossEarnings.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-rose-50 text-rose-950 font-bold p-2.5 text-xs border-b border-rose-100 flex justify-between">
              <span>DEDUCTIONS</span>
              <span>AMOUNT (₹)</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="p-2 flex justify-between">
                <span className="text-slate-600">Provident Fund (EPF 12%)</span>
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
            </div>
            <div className="bg-rose-50/70 p-2.5 border-t border-rose-200 flex justify-between font-bold text-rose-950">
              <span>TOTAL DEDUCTIONS:</span>
              <span className="font-mono">₹{totalDeductions.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Net Salary Box */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              NET SALARY PAYABLE (TAKE HOME)
            </div>
            <div className="text-xs text-slate-600 italic mt-0.5">
              <span className="font-bold not-italic text-slate-800">In Words:</span> {amountInWords}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Disbursal: <span className="font-semibold text-slate-700">Bank Transfer (Credited to Salary Account)</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black font-mono tracking-tight text-emerald-700">
              ₹{netPay.toLocaleString('en-IN')}
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
              Disbursed & Audited
            </span>
          </div>
        </div>

        {/* Footer Policy & Signatures */}
        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-[10px] text-slate-500">
          <div className="space-y-1">
            <div className="font-bold text-slate-700 uppercase">Company Policy & Notes</div>
            <p>1. This payslip is a confidential document generated by EKOSMART Payroll Engine.</p>
            <p>2. Discrepancies must be notified to HR within 7 days of salary credit.</p>
            <p>3. PF & ESIC remittances are filed under official employer code.</p>
          </div>

          <div className="text-right flex flex-col justify-between items-end">
            <div>
              <div className="font-bold text-slate-800">For EKOSMART EV BATTERY SOLUTION</div>
              <div className="text-[9px] text-slate-400">Head Office & Central Plant, Kota</div>
            </div>

            <div className="pt-6">
              <div className="border-t border-slate-300 w-40 text-center text-[10px] font-bold text-slate-700">
                Authorized HR Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySalarySlip;
