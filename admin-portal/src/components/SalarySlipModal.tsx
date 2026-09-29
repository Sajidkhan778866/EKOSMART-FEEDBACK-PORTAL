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
  Save,
  Send,
  History,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { billTemplateApi, employeeApi } from '../api/client';
import { normalizeTemplate, type IBillTemplate } from './BillTemplateDesigner';
import { printElement } from '../utils/print';

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
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingStructure, setSavingStructure] = useState(false);
  const [generatingPayslip, setGeneratingPayslip] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Payslip History
  const [payslipsHistory, setPayslipsHistory] = useState<any[]>([]);
  const [selectedHistoricalSlip, setSelectedHistoricalSlip] = useState<any | null>(null);

  // Pay Period State
  const currentDate = new Date();
  const currentMonthIdx = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[currentMonthIdx]);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  // Attendance State
  const [totalDays, setTotalDays] = useState(30);
  const [presentDays, setPresentDays] = useState(28);
  const [leaveDays, setLeaveDays] = useState(2);
  const [overtimeHours, setOvertimeHours] = useState(0);

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
  const [bonus, setBonus] = useState(0);
  const [arrears, setArrears] = useState(0);
  const [otherEarnings, setOtherEarnings] = useState(0);

  // Deductions State
  const [epf, setEpf] = useState(1800);
  const [esi, setEsi] = useState(450);
  const [profTax, setProfTax] = useState(200);
  const [tds, setTds] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [lateDeduction, setLateDeduction] = useState(0);
  const [loan, setLoan] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);

  // Calculations
  const grossEarnings =
    Number(basicPay || 0) +
    Number(hra || 0) +
    Number(conveyance || 0) +
    Number(specialAllowance || 0) +
    Number(overtime || 0) +
    Number(bonus || 0) +
    Number(arrears || 0) +
    Number(otherEarnings || 0);

  const totalDeductions =
    Number(epf || 0) +
    Number(esi || 0) +
    Number(profTax || 0) +
    Number(tds || 0) +
    Number(advance || 0) +
    Number(lateDeduction || 0) +
    Number(loan || 0) +
    Number(otherDeductions || 0);

  const netPay = Math.max(0, grossEarnings - totalDeductions);
  const amountInWords = numberToWordsINR(netPay);

  useEffect(() => {
    fetchActiveSalaryTemplate();
    if (employee?._id) {
      loadEmployeeSalaryStructure(employee._id);
      loadEmployeePayslipsHistory(employee._id);
    }
  }, [employee]);

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

  const loadEmployeeSalaryStructure = async (empId: string) => {
    try {
      setLoading(true);
      const res = await employeeApi.getSalary(empId);
      if (res.data?.success && res.data.data) {
        const salary = res.data.data;
        if (salary.earnings) {
          setBasicPay(salary.earnings.basicSalary || 0);
          setHra(salary.earnings.hra || 0);
          setConveyance(salary.earnings.conveyance || 0);
          setSpecialAllowance(salary.earnings.specialAllowance || 0);
          setOvertime(salary.earnings.overtime || 0);
          setBonus(salary.earnings.bonus || 0);
          setArrears(salary.earnings.arrears || 0);
          setOtherEarnings(salary.earnings.otherEarnings || 0);
        }
        if (salary.deductions) {
          setEpf(salary.deductions.epf || 0);
          setEsi(salary.deductions.esi || 0);
          setProfTax(salary.deductions.professionalTax || 0);
          setTds(salary.deductions.tds || 0);
          setAdvance(salary.deductions.advance || 0);
          setLateDeduction(salary.deductions.lateDeduction || 0);
          setLoan(salary.deductions.loan || 0);
          setOtherDeductions(salary.deductions.otherDeductions || 0);
        }
        if (salary.bankDetails) {
          setBankName(salary.bankDetails.bankName || 'HDFC Bank Ltd');
          setBankAccount(salary.bankDetails.accountNumber || `50200${(employee?.mobile || '8899').slice(-6)}`);
          setIfscCode(salary.bankDetails.ifscCode || 'HDFC0001234');
          setPanNumber(salary.bankDetails.panNumber || `ABCDE${(employee?.mobile || '1234').slice(-4)}F`);
          setUanNumber(salary.bankDetails.uanNumber || `10123456${(employee?.mobile || '78').slice(-4)}`);
          setPaymentMode(salary.bankDetails.paymentMode || 'Bank Transfer (NEFT/RTGS)');
        }
      }
    } catch (err) {
      console.warn('Could not load existing salary structure, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeePayslipsHistory = async (empId: string) => {
    try {
      const res = await employeeApi.getPayslips(empId);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setPayslipsHistory(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load payslips history:', err);
    }
  };

  const handleSaveSalaryStructure = async () => {
    if (!employee?._id) return;
    try {
      setSavingStructure(true);
      setFeedback(null);
      const salaryStructure = {
        earnings: {
          basicSalary: Number(basicPay),
          hra: Number(hra),
          conveyance: Number(conveyance),
          specialAllowance: Number(specialAllowance),
          overtime: Number(overtime),
          bonus: Number(bonus),
          arrears: Number(arrears),
          otherEarnings: Number(otherEarnings),
        },
        deductions: {
          epf: Number(epf),
          esi: Number(esi),
          professionalTax: Number(profTax),
          tds: Number(tds),
          advance: Number(advance),
          lateDeduction: Number(lateDeduction),
          loan: Number(loan),
          otherDeductions: Number(otherDeductions),
        },
        bankDetails: {
          bankName,
          accountNumber: bankAccount,
          ifscCode,
          panNumber,
          uanNumber,
          paymentMode,
        },
        effectiveFrom: new Date(),
      };

      const res = await employeeApi.updateSalary(employee._id, salaryStructure);
      if (res.data?.success) {
        setFeedback({ type: 'success', message: 'Individual salary structure saved successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.data?.message || 'Failed to save salary structure.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Error saving salary structure.' });
    } finally {
      setSavingStructure(false);
    }
  };

  const handleGenerateAndIssuePayslip = async () => {
    if (!employee?._id) return;
    try {
      setGeneratingPayslip(true);
      setFeedback(null);
      const payload = {
        month: selectedMonth,
        year: Number(selectedYear),
        workingDays: totalDays,
        paidDays: presentDays,
        leaveDays: leaveDays,
        overtimeHours: overtimeHours,
        earnings: {
          basicSalary: Number(basicPay),
          hra: Number(hra),
          conveyance: Number(conveyance),
          specialAllowance: Number(specialAllowance),
          overtime: Number(overtime),
          bonus: Number(bonus),
          arrears: Number(arrears),
          otherEarnings: Number(otherEarnings),
        },
        deductions: {
          epf: Number(epf),
          esi: Number(esi),
          professionalTax: Number(profTax),
          tds: Number(tds),
          advance: Number(advance),
          lateDeduction: Number(lateDeduction),
          loan: Number(loan),
          otherDeductions: Number(otherDeductions),
        },
        bankDetails: {
          bankName,
          accountNumber: bankAccount,
          ifscCode,
          panNumber,
          uanNumber,
          paymentMode,
        },
        status: 'Issued',
        paymentStatus: 'Paid',
        isPublishedToEmployee: true,
      };

      const res = await employeeApi.generatePayslip(employee._id, payload);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: `Official payslip for ${selectedMonth} ${selectedYear} generated & published to employee!`,
        });
        await loadEmployeePayslipsHistory(employee._id);
      } else {
        setFeedback({ type: 'error', message: res.data?.message || 'Failed to generate payslip.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Error generating payslip.' });
    } finally {
      setGeneratingPayslip(false);
    }
  };

  const handleSelectHistoricalSlip = (slip: any) => {
    setSelectedHistoricalSlip(slip);
    if (slip) {
      setSelectedMonth(slip.month || selectedMonth);
      setSelectedYear(slip.year?.toString() || selectedYear);
      setTotalDays(slip.workingDays || 30);
      setPresentDays(slip.paidDays || 28);
      setLeaveDays(slip.leaveDays || 2);
      setOvertimeHours(slip.overtimeHours || 0);

      if (slip.earnings) {
        setBasicPay(slip.earnings.basicSalary || 0);
        setHra(slip.earnings.hra || 0);
        setConveyance(slip.earnings.conveyance || 0);
        setSpecialAllowance(slip.earnings.specialAllowance || 0);
        setOvertime(slip.earnings.overtime || 0);
        setBonus(slip.earnings.bonus || 0);
        setArrears(slip.earnings.arrears || 0);
        setOtherEarnings(slip.earnings.otherEarnings || 0);
      }
      if (slip.deductions) {
        setEpf(slip.deductions.epf || 0);
        setEsi(slip.deductions.esi || 0);
        setProfTax(slip.deductions.professionalTax || 0);
        setTds(slip.deductions.tds || 0);
        setAdvance(slip.deductions.advance || 0);
        setLateDeduction(slip.deductions.lateDeduction || 0);
        setLoan(slip.deductions.loan || 0);
        setOtherDeductions(slip.deductions.otherDeductions || 0);
      }
      if (slip.bankDetails) {
        setBankName(slip.bankDetails.bankName || bankName);
        setBankAccount(slip.bankDetails.accountNumber || bankAccount);
        setIfscCode(slip.bankDetails.ifscCode || ifscCode);
        setPanNumber(slip.bankDetails.panNumber || panNumber);
        setUanNumber(slip.bankDetails.uanNumber || uanNumber);
        setPaymentMode(slip.bankDetails.paymentMode || paymentMode);
      }
      setActiveTab('generate');
    }
  };

  const handleDeleteHistoricalSlip = async (slipId: string) => {
    if (!confirm('Are you sure you want to delete this historical payslip record?')) return;
    try {
      const res = await employeeApi.deletePayslip(slipId);
      if (res.data?.success) {
        setFeedback({ type: 'success', message: 'Payslip record deleted.' });
        if (employee?._id) loadEmployeePayslipsHistory(employee._id);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Error deleting payslip.' });
    }
  };

  const handlePrint = () => {
    printElement(
      'printable-salary-slip',
      `EKOSMART_Payslip_${employee?.employeeId || 'STAFF'}_${selectedMonth}_${selectedYear}`
    );
  };

  const handleCopySummary = () => {
    const summary = `
========================================
EKOSMART EV BATTERY SOLUTION
OFFICIAL SALARY SLIP - ${selectedMonth.toUpperCase()} ${selectedYear}
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
- Bonus/Incent: ₹${bonus.toLocaleString('en-IN')}
----------------------------------------
TOTAL DEDUCTIONS: ₹${totalDeductions.toLocaleString('en-IN')}
- EPF (12%)   : ₹${epf.toLocaleString('en-IN')}
- ESI         : ₹${esi.toLocaleString('en-IN')}
- Prof. Tax   : ₹${profTax.toLocaleString('en-IN')}
- TDS / Tax   : ₹${tds.toLocaleString('en-IN')}
- Advance     : ₹${advance.toLocaleString('en-IN')}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-7xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[96vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap justify-between items-center gap-3 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              {loading ? <Loader2 size={22} className="animate-spin text-emerald-400" /> : <FileSpreadsheet size={22} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Employee Salary Structure & Payslip Generator</h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Soft-Coded System
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configuring for <span className="text-white font-bold">{employee?.name}</span> ({employee?.employeeId}) •{' '}
                {employee?.designation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Tabs */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700 mr-2">
              <button
                type="button"
                onClick={() => setActiveTab('generate')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'generate' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign size={13} />
                <span>Salary Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'history' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <History size={13} />
                <span>Past History ({payslipsHistory.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Print official payslip or choose 'Save as PDF' in the print dialog"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
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
            #printable-salary-slip,
            #printable-salary-slip * {
              visibility: visible !important;
            }
            #printable-salary-slip {
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

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between shrink-0 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-500 hover:text-slate-800">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Modal Main Body Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {activeTab === 'history' ? (
            /* Payslip History Dossier View */
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <History size={16} className="text-emerald-600" />
                    <span>Issued Monthly Payslips History</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    All generated and published payslips for {employee?.name} are archived here permanently.
                  </p>
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
                  {payslipsHistory.length} Records Found
                </span>
              </div>

              {payslipsHistory.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-3">
                  <FileSpreadsheet size={40} className="mx-auto text-slate-300" />
                  <p className="text-sm font-semibold">No payslips have been generated yet for this employee.</p>
                  <p className="text-xs text-slate-400">
                    Switch to the &ldquo;Salary Slip&rdquo; tab and click &ldquo;Generate & Issue Payslip&rdquo; to create the first
                    record.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="py-3 px-4">Pay Period</th>
                        <th className="py-3 px-4">Payslip #</th>
                        <th className="py-3 px-4">Gross Earnings</th>
                        <th className="py-3 px-4">Deductions</th>
                        <th className="py-3 px-4">Net Take-Home</th>
                        <th className="py-3 px-4">Disbursed Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payslipsHistory.map((slip) => (
                        <tr key={slip._id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4 font-bold text-slate-800">
                            {slip.month} {slip.year}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-emerald-700 font-bold">
                            {slip.payslipNumber || `EBS-${slip.month?.slice(0, 3)}-${slip.year}`}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">
                            ₹{(slip.grossEarnings || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-rose-600">
                            ₹{(slip.totalDeductions || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 font-mono font-black text-emerald-700 bg-emerald-50/50">
                            ₹{(slip.netPayable || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {new Date(slip.generatedAt || slip.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {slip.status || 'Issued'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSelectHistoricalSlip(slip)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                title="Load & View Slip"
                              >
                                <Eye size={12} />
                                <span>View</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteHistoricalSlip(slip._id)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                title="Delete Record"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Salary Generator & Live Printable Preview */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Side: Interactive Controls */}
              <div className="lg:col-span-5 space-y-4 text-xs">
                {/* Actions Top Toolbar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Save size={14} className="text-emerald-600" />
                      <span>Individual Salary Actions</span>
                    </span>
                    {selectedHistoricalSlip && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                        Viewing Record #{selectedHistoricalSlip.payslipNumber}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      disabled={savingStructure}
                      onClick={handleSaveSalaryStructure}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      {savingStructure ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      <span>Save Base Structure</span>
                    </button>

                    <button
                      type="button"
                      disabled={generatingPayslip}
                      onClick={handleGenerateAndIssuePayslip}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {generatingPayslip ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                      <span>Generate & Issue Slip</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">
                    Generating a payslip saves a permanent snapshot and publishes it to the employee portal.
                  </p>
                </div>

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
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">Total Days</label>
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
                      <span className="text-slate-600">Special / Tech Allowance</span>
                      <input
                        type="number"
                        value={specialAllowance}
                        onChange={(e) => setSpecialAllowance(parseInt(e.target.value) || 0)}
                        className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-600">Overtime & Field Pay</span>
                      <input
                        type="number"
                        value={overtime}
                        onChange={(e) => setOvertime(parseInt(e.target.value) || 0)}
                        className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-600">Performance Bonus</span>
                      <input
                        type="number"
                        value={bonus}
                        onChange={(e) => setBonus(parseInt(e.target.value) || 0)}
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
                      <span className="text-slate-600">Advance / Loan Recovery</span>
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
                        Slip Ref:{' '}
                        {selectedHistoricalSlip?.payslipNumber ||
                          `EBS-SLIP-${employee?.employeeId}-${selectedMonth.slice(0, 3).toUpperCase()}${selectedYear.slice(-2)}`}
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
                          <span className="font-mono font-semibold">₹{Number(basicPay).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2 flex justify-between">
                          <span className="text-slate-600">House Rent Allowance (HRA)</span>
                          <span className="font-mono font-semibold">₹{Number(hra).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2 flex justify-between">
                          <span className="text-slate-600">Conveyance Allowance</span>
                          <span className="font-mono font-semibold">₹{Number(conveyance).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2 flex justify-between">
                          <span className="text-slate-600">Special / Tech Allowance</span>
                          <span className="font-mono font-semibold">₹{Number(specialAllowance).toLocaleString('en-IN')}</span>
                        </div>
                        {Number(overtime) > 0 && (
                          <div className="p-2 flex justify-between">
                            <span className="text-slate-600">Overtime Pay</span>
                            <span className="font-mono font-semibold">₹{Number(overtime).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {Number(bonus) > 0 && (
                          <div className="p-2 flex justify-between">
                            <span className="text-slate-600">Bonus & Incentive</span>
                            <span className="font-mono font-semibold">₹{Number(bonus).toLocaleString('en-IN')}</span>
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
                          <span className="font-mono font-semibold text-rose-700">₹{Number(epf).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2 flex justify-between">
                          <span className="text-slate-600">ESI Contribution</span>
                          <span className="font-mono font-semibold text-rose-700">₹{Number(esi).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2 flex justify-between">
                          <span className="text-slate-600">Professional Tax (PT)</span>
                          <span className="font-mono font-semibold text-rose-700">₹{Number(profTax).toLocaleString('en-IN')}</span>
                        </div>
                        {Number(tds) > 0 && (
                          <div className="p-2 flex justify-between">
                            <span className="text-slate-600">TDS / Income Tax</span>
                            <span className="font-mono font-semibold text-rose-700">₹{Number(tds).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {Number(advance) > 0 && (
                          <div className="p-2 flex justify-between">
                            <span className="text-slate-600">Advance / Loan Recovery</span>
                            <span className="font-mono font-semibold text-rose-700">₹{Number(advance).toLocaleString('en-IN')}</span>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SalarySlipModal;
