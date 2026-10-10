import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Component,
  Save,
} from 'lucide-react';
import { frontendBuilderApi } from '../../api/client';

interface FormSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormSchemaModal: React.FC<FormSchemaModalProps> = ({ isOpen, onClose }) => {
  const [forms, setForms] = useState<any[]>([]);
  const [selectedFormKey, setSelectedFormKey] = useState<string>('contact_form');
  const [activeForm, setActiveForm] = useState<any>(null);
  const [, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchForms();
    }
  }, [isOpen]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await frontendBuilderApi.getForms();
      if (res.data?.success) {
        const formList = res.data.data || [];
        setForms(formList);
        if (formList.length > 0) {
          const match = formList.find((f: any) => f.formKey === selectedFormKey) || formList[0];
          setSelectedFormKey(match.formKey);
          setActiveForm(JSON.parse(JSON.stringify(match)));
        }
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to load forms' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectForm = (key: string) => {
    setSelectedFormKey(key);
    const match = forms.find((f) => f.formKey === key);
    if (match) {
      setActiveForm(JSON.parse(JSON.stringify(match)));
    }
  };

  const handleAddField = () => {
    if (!activeForm) return;
    const newField = {
      fieldKey: `field_${Date.now().toString().slice(-4)}`,
      label: 'New Field Label',
      type: 'text',
      placeholder: 'Enter details...',
      required: false,
      width: 'full',
      order: (activeForm.fields || []).length + 1,
      options: [],
    };
    setActiveForm({
      ...activeForm,
      fields: [...(activeForm.fields || []), newField],
    });
  };

  const handleUpdateField = (index: number, key: string, val: any) => {
    if (!activeForm) return;
    const updated = [...activeForm.fields];
    updated[index] = { ...updated[index], [key]: val };
    setActiveForm({ ...activeForm, fields: updated });
  };

  const handleRemoveField = (index: number) => {
    if (!activeForm) return;
    const updated = activeForm.fields.filter((_: any, i: number) => i !== index);
    setActiveForm({ ...activeForm, fields: updated });
  };

  const handleSaveForm = async () => {
    if (!activeForm) return;
    try {
      setSaving(true);
      const res = await frontendBuilderApi.saveForm(activeForm);
      if (res.data?.success) {
        setMsg({ type: 'success', text: `Form schema [${activeForm.formKey}] saved successfully!` });
        setTimeout(() => setMsg(null), 3000);
        fetchForms();
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save form' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Component size={18} />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Dynamic Form Schemas Builder</h3>
              <p className="text-[10px] text-slate-400">Add, reorder & configure fields for Complaints, Inquiries & Warranty</p>
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

        {/* Message Banner */}
        {msg && (
          <div
            className={`p-3 text-xs font-bold flex items-center justify-between ${
              msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            <span>{msg.text}</span>
            <button type="button" onClick={() => setMsg(null)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>
        )}

        {/* Form Selector Bar */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Select Form:</span>
            <select
              value={selectedFormKey}
              onChange={(e) => handleSelectForm(e.target.value)}
              className="p-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
            >
              {forms.map((f) => (
                <option key={f.formKey} value={f.formKey}>
                  {f.title} ({f.formKey})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleAddField}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus size={13} />
            <span>+ Add Field</span>
          </button>
        </div>

        {/* Form Editor Body */}
        {activeForm && (
          <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Form Title</label>
                <input
                  type="text"
                  value={activeForm.title}
                  onChange={(e) => setActiveForm({ ...activeForm, title: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Workflow</label>
                <select
                  value={activeForm.destinationWorkflow}
                  onChange={(e) => setActiveForm({ ...activeForm, destinationWorkflow: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                >
                  <option value="ticket_submission">Technical Ticket / Complaint Registration</option>
                  <option value="warranty_registration">Official Battery Warranty Registration</option>
                  <option value="contact_inquiry">General Inquiry / Lead Collection</option>
                </select>
              </div>
            </div>

            {/* Field List */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs">Form Fields & Validation Rules:</h4>
              {(activeForm.fields || []).map((field: any, idx: number) => (
                <div
                  key={field.fieldKey || idx}
                  className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2 hover:border-slate-300 transition"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Field Key</label>
                      <input
                        type="text"
                        value={field.fieldKey}
                        onChange={(e) => handleUpdateField(idx, 'fieldKey', e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleUpdateField(idx, 'label', e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Input Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => handleUpdateField(idx, 'type', e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                      >
                        <option value="text">Text (Single Line)</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone / Mobile</option>
                        <option value="textarea">Textarea (Multi Line)</option>
                        <option value="select">Dropdown Select</option>
                        <option value="date">Date Picker</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={Boolean(field.required)}
                          onChange={(e) => handleUpdateField(idx, 'required', e.target.checked)}
                          className="rounded text-emerald-600"
                        />
                        <span className="text-[11px]">Required</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveForm}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <Save size={13} />
            <span>{saving ? 'Saving Schema...' : 'Save Form Schema'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
