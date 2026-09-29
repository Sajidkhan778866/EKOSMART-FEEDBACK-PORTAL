import React, { useState } from 'react';
import { Calendar, ChevronDown, Clock, Filter, X } from 'lucide-react';

export type DateFilterPreset =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thismonth'
  | 'custom'
  | 'all';

export interface DateRangeState {
  filter: DateFilterPreset;
  startDate?: string;
  endDate?: string;
}

interface DateRangeFilterProps {
  value?: DateRangeState;
  onChange: (range: DateRangeState) => void;
  className?: string;
  showAllOption?: boolean;
}

export const PRESET_LABELS: Record<DateFilterPreset, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7days: 'Last 7 Days',
  last30days: 'Last 30 Days',
  thismonth: 'This Month',
  custom: 'Custom Range',
  all: 'All Time',
};

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value = { filter: 'today' },
  onChange,
  className = '',
  showAllOption = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value.startDate || '');
  const [customEnd, setCustomEnd] = useState(value.endDate || '');

  const presets: DateFilterPreset[] = [
    'today',
    'yesterday',
    'last7days',
    'last30days',
    'thismonth',
    'custom',
    ...(showAllOption ? (['all'] as DateFilterPreset[]) : []),
  ];

  const handleSelectPreset = (preset: DateFilterPreset) => {
    if (preset === 'custom') {
      onChange({ filter: 'custom', startDate: customStart, endDate: customEnd });
    } else {
      onChange({ filter: preset });
      setIsOpen(false);
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({
      filter: 'custom',
      startDate: customStart,
      endDate: customEnd,
    });
    setIsOpen(false);
  };

  const getActiveDisplayLabel = () => {
    if (value.filter === 'custom' && (value.startDate || value.endDate)) {
      const s = value.startDate ? new Date(value.startDate).toLocaleDateString('en-GB') : 'Start';
      const e = value.endDate ? new Date(value.endDate).toLocaleDateString('en-GB') : 'End';
      return `${s} - ${e}`;
    }
    return PRESET_LABELS[value.filter] || 'Today';
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            value.filter === 'today'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
          }`}
        >
          <Calendar size={14} className={value.filter === 'today' ? 'text-emerald-600' : 'text-slate-500'} />
          <span>{getActiveDisplayLabel()}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {/* Quick today shortcut if not active */}
        {value.filter !== 'today' && (
          <button
            type="button"
            onClick={() => handleSelectPreset('today')}
            title="Reset to Today"
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Clock size={12} />
            <span>Today</span>
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Filter size={13} className="text-emerald-600" />
                <span>Filter by Date Range</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            {/* Presets List */}
            <div className="grid grid-cols-2 gap-1.5 py-2.5 border-b border-slate-100">
              {presets.map((preset) => {
                const isSelected = value.filter === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{PRESET_LABELS[preset]}</span>
                    {preset === 'today' && !isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Range Inputs */}
            <form onSubmit={handleApplyCustom} className="pt-2.5 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                Custom Date Range
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5 font-semibold">From</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5 font-semibold">To</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!customStart && !customEnd}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
                >
                  Apply Custom
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('today')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
