import React from 'react';
import { X, History, RotateCcw, CheckCircle2, Clock, User } from 'lucide-react';
import type { IPage } from './types';

interface RevisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: IPage | null;
  onRollback: (version: number) => Promise<void>;
}

export const RevisionsModal: React.FC<RevisionsModalProps> = ({
  isOpen,
  onClose,
  page,
  onRollback,
}) => {
  const [rollingBackVersion, setRollingBackVersion] = React.useState<number | null>(null);

  if (!isOpen || !page) return null;

  const handleRollback = async (v: number) => {
    if (!window.confirm(`Are you sure you want to rollback to published Version ${v}? Your current draft will be overwritten with Version ${v}.`)) {
      return;
    }
    try {
      setRollingBackVersion(v);
      await onRollback(v);
      onClose();
    } finally {
      setRollingBackVersion(null);
    }
  };

  const revisions = page.revisions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <History size={18} />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Version History & Revisions</h3>
              <p className="text-[10px] text-slate-400">
                {page.title} ({page.slug})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Revisions List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
          {revisions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <History size={24} className="mx-auto text-slate-300" />
              <p className="font-semibold text-xs">No previous published revisions recorded yet.</p>
              <p className="text-[11px] text-slate-400">Publishing changes creates an immutable version snapshot.</p>
            </div>
          ) : (
            revisions.map((rev) => {
              const isCurrent = rev.version === page.currentVersion;
              return (
                <div
                  key={rev.version}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 font-mono text-sm">Version {rev.version}</span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full">
                          Active Live Version
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-slate-400" />
                        <span>{new Date(rev.publishedAt).toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={11} className="text-slate-400" />
                        <span>{rev.publishedBy || 'Admin'}</span>
                      </span>
                    </div>
                    {rev.changeNote && (
                      <p className="text-[11px] text-slate-600 italic">"{rev.changeNote}"</p>
                    )}
                  </div>

                  <div>
                    {!isCurrent ? (
                      <button
                        type="button"
                        disabled={rollingBackVersion === rev.version}
                        onClick={() => handleRollback(rev.version)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <RotateCcw size={12} />
                        <span>{rollingBackVersion === rev.version ? 'Restoring...' : 'Rollback'}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 size={16} />
                        <span>Current</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
