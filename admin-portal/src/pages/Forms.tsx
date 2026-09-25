import { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Loader2,
  List,
  X,
  Tag,
  Sparkles,
  Layers,
  FolderPlus,
  AlertCircle,
} from 'lucide-react';
import { formApi, complaintTypeApi, contentApi } from '../api/client';

const FIELD_TYPES = [
  'Text',
  'Textarea',
  'Number',
  'Email',
  'Mobile',
  'Date',
  'Dropdown',
  'Serial Number',
];

const STANDARD_SECTIONS = ['Showroom', 'Battery', 'Rental', 'Spare Parts'];
const STANDARD_WARRANTY = ['Showroom', 'Plant'];

const Forms = () => {
  const [activeTab, setActiveTab] = useState<'Complaint' | 'Warranty' | 'ComplaintTypes'>('Complaint');
  const [selectedDivision, setSelectedDivision] = useState('Showroom');
  const [selectedCategory, setSelectedCategory] = useState('Showroom');

  // Dynamic sections state
  const [sections, setSections] = useState<string[]>(STANDARD_SECTIONS);
  const [warrantyCategories, setWarrantyCategories] = useState<string[]>(STANDARD_WARRANTY);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionInput, setNewSectionInput] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempOptionInputs, setTempOptionInputs] = useState<Record<number, string>>({});

  // Dynamic Complaint Types state
  const [complaintTypes, setComplaintTypes] = useState<any[]>([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDivision, setNewTypeDivision] = useState('Showroom');
  const [newTypeDescription, setNewTypeDescription] = useState('');
  const [creatingType, setCreatingType] = useState(false);

  // Fetch all dynamic sections from database and content CMS
  const fetchAllSections = async () => {
    try {
      // 1. Fetch from dynamic backend sections endpoint
      let dynamicList: string[] = [];
      try {
        const secRes = await formApi.getSections();
        if (secRes.data.success && Array.isArray(secRes.data.data)) {
          dynamicList = secRes.data.data;
        }
      } catch (e) {
        console.warn('Failed to load dynamic sections endpoint:', e);
      }

      // 2. Fetch from Content CMS service cards
      let cmsList: string[] = [];
      try {
        const cmsRes = await contentApi.getAdmin();
        if (cmsRes.data.success && cmsRes.data.data?.serviceCards) {
          cmsList = cmsRes.data.data.serviceCards.map(
            (c: any) => c.section || c.title
          ).filter(Boolean);
        }
      } catch (e) {
        console.warn('Failed to load CMS service cards for sections:', e);
      }

      // 3. Fetch from existing complaint forms
      let formsList: string[] = [];
      try {
        const formsRes = await formApi.getComplaintForms();
        if (formsRes.data.success && Array.isArray(formsRes.data.data)) {
          formsList = formsRes.data.data.map((f: any) => f.division).filter(Boolean);
        }
      } catch (e) {
        console.warn('Failed to load existing forms list:', e);
      }

      // Merge dynamic sections from CMS and forms
      const dynamicMerged = Array.from(
        new Set([...dynamicList, ...cmsList, ...formsList])
      );
      const finalSections = dynamicMerged.length > 0 ? dynamicMerged : STANDARD_SECTIONS;
      setSections(finalSections);
      if (finalSections.length > 0 && !finalSections.some(s => s.toLowerCase() === selectedDivision.toLowerCase())) {
        setSelectedDivision(finalSections[0]);
      }

      // Also merge warranty categories
      try {
        const warRes = await formApi.getWarrantyForms();
        if (warRes.data.success && Array.isArray(warRes.data.data)) {
          const warList = warRes.data.data.map((w: any) => w.category).filter(Boolean);
          const dynamicWar = Array.from(new Set([...warList]));
          setWarrantyCategories(dynamicWar.length > 0 ? dynamicWar : STANDARD_WARRANTY);
        }
      } catch (e) {
        console.warn('Failed to load warranty categories:', e);
      }
    } catch (err) {
      console.error('Error in fetchAllSections:', err);
    }
  };

  useEffect(() => {
    fetchAllSections();
  }, []);

  const fetchForm = async () => {
    setLoading(true);
    setMessage('');
    setErrorMessage('');
    try {
      if (activeTab === 'Complaint') {
        const res = await formApi.getComplaintForms();
        if (res.data.success) {
          const form = res.data.data.find((f: any) => f.division.toLowerCase() === selectedDivision.toLowerCase());
          if (form && form.fields && form.fields.length > 0) {
            setFields(form.fields);
          } else {
            // Provide clean starter fields for empty/new sections
            setFields([
              {
                name: 'customerName',
                label: 'Customer / Entity Name',
                type: 'Text',
                required: true,
                order: 1,
                isActive: true,
              },
              {
                name: 'contactNumber',
                label: 'Contact Number',
                type: 'Mobile',
                required: true,
                order: 2,
                isActive: true,
              },
              {
                name: 'serviceDetails',
                label: 'Service / Product Specification',
                type: 'Text',
                required: true,
                order: 3,
                isActive: true,
              },
              {
                name: 'problemDescription',
                label: 'Problem Description',
                type: 'Textarea',
                required: true,
                order: 4,
                isActive: true,
              },
            ]);
          }
        }
      } else if (activeTab === 'Warranty') {
        const res = await formApi.getWarrantyForms();
        if (res.data.success) {
          const form = res.data.data.find((f: any) => f.category.toLowerCase() === selectedCategory.toLowerCase());
          if (form && form.fields && form.fields.length > 0) {
            setFields(form.fields);
          } else {
            setFields([
              {
                name: 'customerName',
                label: 'Customer Name',
                type: 'Text',
                required: true,
                order: 1,
                isActive: true,
              },
              {
                name: 'mobile',
                label: 'Mobile Number',
                type: 'Mobile',
                required: true,
                order: 2,
                isActive: true,
              },
              {
                name: 'serialNumber',
                label: 'Serial Number / Unit ID',
                type: 'Serial Number',
                required: true,
                order: 3,
                isActive: true,
              },
            ]);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintTypes = async () => {
    setTypesLoading(true);
    try {
      const res = await complaintTypeApi.getAll({
        division: selectedDivision !== 'All' ? selectedDivision : undefined,
      });
      if (res.data.success) {
        setComplaintTypes(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load complaint types:', err);
    } finally {
      setTypesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ComplaintTypes') {
      fetchComplaintTypes();
    } else {
      fetchForm();
    }
  }, [activeTab, selectedDivision, selectedCategory]);

  const handleAddNewSection = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newSectionInput.trim();
    if (!cleanName) return;

    if (!sections.some((s) => s.toLowerCase() === cleanName.toLowerCase())) {
      setSections([...sections, cleanName]);
    }
    setSelectedDivision(cleanName);
    setNewSectionInput('');
    setShowAddSection(false);
    setMessage(`New service section "${cleanName}" added! Customize its fields below and click "Save Changes".`);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newCategoryInput.trim();
    if (!cleanName) return;

    if (!warrantyCategories.some((c) => c.toLowerCase() === cleanName.toLowerCase())) {
      setWarrantyCategories([...warrantyCategories, cleanName]);
    }
    setSelectedCategory(cleanName);
    setNewCategoryInput('');
    setShowAddCategory(false);
    setMessage(`New warranty category "${cleanName}" added! Customize its fields below and click "Save Changes".`);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleDeleteSectionForm = async (divName: string) => {
    if (!window.confirm(`Are you sure you want to completely remove the service and form configuration for "${divName}"?`)) return;
    try {
      await formApi.deleteComplaintForm(divName);
      setMessage(`Service and form for "${divName}" deleted successfully.`);
      const remaining = sections.filter((s) => s.toLowerCase() !== divName.toLowerCase());
      const nextSections = remaining.length > 0 ? remaining : STANDARD_SECTIONS;
      setSections(nextSections);
      setSelectedDivision(nextSections[0]);
      setTimeout(() => setMessage(''), 3500);
      fetchAllSections();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete section form');
    }
  };

  const handleCreateComplaintType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    setCreatingType(true);
    const targetDiv = selectedDivision === 'All' ? newTypeDivision : selectedDivision;
    try {
      const res = await complaintTypeApi.create({
        name: newTypeName.trim(),
        division: targetDiv,
        description: newTypeDescription.trim(),
      });
      if (res.data.success) {
        setNewTypeName('');
        setNewTypeDescription('');
        setMessage(`Complaint type added for ${targetDiv} successfully!`);
        fetchComplaintTypes();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to create complaint type');
    } finally {
      setCreatingType(false);
    }
  };

  const handleToggleComplaintType = async (id: string, currentActive: boolean) => {
    try {
      const res = await complaintTypeApi.update(id, { isActive: !currentActive });
      if (res.data.success) {
        fetchComplaintTypes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComplaintType = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this complaint type?')) return;
    try {
      const res = await complaintTypeApi.delete(id);
      if (res.data.success) {
        setMessage('Complaint type deleted successfully.');
        fetchComplaintTypes();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addField = () => {
    const newField = {
      name: `custom_field_${Date.now()}`,
      label: 'New Field',
      type: 'Text',
      required: false,
      options: [],
      order: fields.length + 1,
      isActive: true,
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: string, val: any) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: val };
    
    // If switching type to Dropdown and options is not set, initialize array
    if (key === 'type' && val === 'Dropdown' && !updated[index].options) {
      updated[index].options = ['Option 1', 'Option 2'];
    }
    
    setFields(updated);
  };

  const handleAddDropdownOption = (index: number) => {
    const rawVal = (tempOptionInputs[index] || '').trim();
    if (!rawVal) return;

    const currentOptions = fields[index].options || [];
    // Allow comma-separated additions
    const added = rawVal.includes(',')
      ? rawVal.split(',').map((s) => s.trim()).filter(Boolean)
      : [rawVal];

    updateField(index, 'options', [...currentOptions, ...added]);
    setTempOptionInputs({ ...tempOptionInputs, [index]: '' });
  };

  const handleRemoveDropdownOption = (fieldIndex: number, optionIndex: number) => {
    const currentOptions = fields[fieldIndex].options || [];
    const updated = currentOptions.filter((_: any, i: number) => i !== optionIndex);
    updateField(fieldIndex, 'options', updated);
  };

  const handleSaveForm = async () => {
    setSaving(true);
    setMessage('');
    setErrorMessage('');
    try {
      if (activeTab === 'Complaint') {
        await formApi.saveComplaintForm({
          division: selectedDivision,
          fields,
        });
        setMessage(`Complaint Form for "${selectedDivision}" saved and active!`);
        fetchAllSections();
      } else if (activeTab === 'Warranty') {
        await formApi.saveWarrantyForm({
          category: selectedCategory,
          fields,
        });
        setMessage(`Warranty Form for "${selectedCategory}" saved and active!`);
        fetchAllSections();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to save form.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dynamic Form & Issue Builder</h1>
          <p className="text-slate-500 text-sm">Configure dynamic fields, options, and service division categories</p>
        </div>
        {activeTab !== 'ComplaintTypes' && (
          <button
            onClick={handleSaveForm}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>Save Changes</span>
          </button>
        )}
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-fadeIn">
          <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-fadeIn">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('Complaint')}
          className={`pb-2 px-4 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'Complaint' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Complaint Forms
        </button>
        <button
          onClick={() => setActiveTab('Warranty')}
          className={`pb-2 px-4 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'Warranty' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Warranty Forms
        </button>
        <button
          onClick={() => setActiveTab('ComplaintTypes')}
          className={`pb-2 px-4 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'ComplaintTypes' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Complaint Types & Categories
        </button>
      </div>

      {/* Division / Category Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-green-600" />
            <span className="text-sm font-bold text-slate-800">
              {activeTab === 'Complaint'
                ? 'Select Service / Complaint Section:'
                : activeTab === 'Warranty'
                ? 'Select Warranty Category:'
                : 'Filter Categories by Section:'}
            </span>
          </div>

          {/* Add New Section / Category Trigger */}
          {activeTab === 'Complaint' && (
            <button
              type="button"
              onClick={() => setShowAddSection(!showAddSection)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto"
            >
              <FolderPlus size={14} />
              <span>{showAddSection ? 'Cancel' : '+ Add Service Section'}</span>
            </button>
          )}

          {activeTab === 'Warranty' && (
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto"
            >
              <FolderPlus size={14} />
              <span>{showAddCategory ? 'Cancel' : '+ Add Warranty Category'}</span>
            </button>
          )}
        </div>

        {/* Add New Section Inline Form */}
        {showAddSection && activeTab === 'Complaint' && (
          <form onSubmit={handleAddNewSection} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-emerald-900">New Section Name:</span>
            <input
              type="text"
              required
              placeholder="e.g. EV Retrofit, Solar Service, Commercial Unit"
              value={newSectionInput}
              onChange={(e) => setNewSectionInput(e.target.value)}
              className="px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[240px]"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Create Section
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddSection(false);
                setNewSectionInput('');
              }}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Add New Category Inline Form */}
        {showAddCategory && activeTab === 'Warranty' && (
          <form onSubmit={handleAddNewCategory} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-emerald-900">New Category Name:</span>
            <input
              type="text"
              required
              placeholder="e.g. Commercial, Fast Charger, Solar Battery"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              className="px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[240px]"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Create Category
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddCategory(false);
                setNewCategoryInput('');
              }}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Section Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {activeTab === 'Complaint' ? (
            sections.map((div) => {
              const isSelected = selectedDivision === div;
              const isCustom = !STANDARD_SECTIONS.includes(div);
              return (
                <div key={div} className="inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedDivision(div)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{div}</span>
                    {isCustom && (
                      <span className="text-[9px] px-1 py-0.2 bg-emerald-800 text-white rounded font-normal">
                        Custom
                      </span>
                    )}
                  </button>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSectionForm(div)}
                      className="ml-1 text-slate-400 hover:text-red-600 p-1 cursor-pointer transition"
                      title={`Delete form for ${div}`}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              );
            })
          ) : activeTab === 'Warranty' ? (
            warrantyCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })
          ) : (
            ['All', ...sections, 'Warranty', 'Plant'].filter((v, i, a) => a.indexOf(v) === i).map((div) => {
              const isSelected = selectedDivision === div;
              return (
                <button
                  key={div}
                  type="button"
                  onClick={() => setSelectedDivision(div)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {div}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Field List Builder (When tab is Complaint or Warranty) */}
      {activeTab !== 'ComplaintTypes' ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-600" />
                <span>Configured Fields for {activeTab === 'Complaint' ? selectedDivision : selectedCategory}</span>
              </h3>
              <p className="text-xs text-slate-400">
                These dynamic inputs are presented to customers when registering tickets under {activeTab === 'Complaint' ? selectedDivision : selectedCategory}.
              </p>
            </div>
            <button
              onClick={addField}
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>Add New Field</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-green-600" size={32} />
            </div>
          ) : fields.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <FileText size={40} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No fields configured yet. Click "+ Add New Field" to start building.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((f, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 transition hover:border-slate-300"
                >
                  {/* Main Field Control Row */}
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-8 text-xs font-bold text-slate-400">#{index + 1}</div>

                    <div className="flex-1 w-full">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Field Label</label>
                      <input
                        type="text"
                        value={f.label}
                        onChange={(e) => updateField(index, 'label', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. Battery Model Type"
                      />
                    </div>

                    <div className="w-full md:w-44">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Type</label>
                      <select
                        value={f.type}
                        onChange={(e) => updateField(index, 'type', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id={`req-${index}`}
                        checked={f.required}
                        onChange={(e) => updateField(index, 'required', e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <label htmlFor={`req-${index}`} className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Required
                      </label>
                    </div>

                    <button
                      onClick={() => removeField(index)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition mt-4 cursor-pointer"
                      title="Delete Field"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* DROPDOWN OPTIONS MANAGER SECTION */}
                  {f.type === 'Dropdown' && (
                    <div className="mt-3 pt-3 border-t border-slate-200 bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <List size={15} className="text-green-600" />
                          <span>Configure Dropdown Options</span>
                        </label>
                        <span className="text-[11px] font-semibold text-green-800 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                          {(f.options || []).length} Options Configured
                        </span>
                      </div>

                      {/* Active Options Tag List */}
                      <div className="flex flex-wrap gap-2 min-h-[32px] items-center">
                        {(f.options || []).map((opt: string, optIdx: number) => (
                          <span
                            key={optIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 shadow-2xs"
                          >
                            <Tag size={12} className="text-slate-500" />
                            <span>{opt}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveDropdownOption(index, optIdx)}
                              className="text-slate-400 hover:text-red-600 cursor-pointer ml-1"
                              title="Remove option"
                            >
                              <X size={13} />
                            </button>
                          </span>
                        ))}
                        {(!f.options || f.options.length === 0) && (
                          <p className="text-xs text-amber-600 font-medium">
                            No dropdown options added yet. Type an option below and click "Add Option".
                          </p>
                        )}
                      </div>

                      {/* Add Option Input Bar */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Type option name (e.g. 48V Lithium Battery Pack or comma separated) and press Enter"
                          value={tempOptionInputs[index] || ''}
                          onChange={(e) =>
                            setTempOptionInputs({ ...tempOptionInputs, [index]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddDropdownOption(index);
                            }
                          }}
                          className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddDropdownOption(index)}
                          disabled={!(tempOptionInputs[index] || '').trim()}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Plus size={15} />
                          <span>Add Option</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        💡 Tip: You can type multiple options separated by commas (e.g. <code>Standard, Express, Heavy Duty</code>) to add them all at once.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* COMPLAINT TYPES & CATEGORIES MANAGER SECTION */
        <div className="space-y-6">
          {/* Create New Type Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Plus size={18} className="text-green-600" />
              <span>
                Add Dynamic Complaint Type for{' '}
                {selectedDivision === 'All' ? newTypeDivision : selectedDivision}
              </span>
            </h3>

            <form onSubmit={handleCreateComplaintType} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {selectedDivision === 'All' && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Target Section <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newTypeDivision}
                    onChange={(e) => setNewTypeDivision(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-green-500 focus:outline-none font-medium"
                  >
                    {sections.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                    <option value="Warranty">Warranty</option>
                    <option value="Plant">Plant</option>
                  </select>
                </div>
              )}

              <div className={selectedDivision === 'All' ? 'sm:col-span-1' : 'sm:col-span-2'}>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Complaint Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Battery Voltage Drop / BMS Error"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Description / Guidance
                </label>
                <input
                  type="text"
                  placeholder="Brief guidance for customers or engineers"
                  value={newTypeDescription}
                  onChange={(e) => setNewTypeDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={creatingType || !newTypeName.trim()}
                  className="w-full px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {creatingType ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                  <span>Add Issue Category</span>
                </button>
              </div>
            </form>
          </div>

          {/* Types List Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <span className="font-bold text-sm text-slate-800">
                Active Categories for {selectedDivision} ({complaintTypes.length})
              </span>
              <button
                onClick={fetchComplaintTypes}
                className="text-xs text-green-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Refresh</span>
              </button>
            </div>

            {typesLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="animate-spin text-green-600" size={32} />
              </div>
            ) : complaintTypes.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No complaint types found for {selectedDivision}. Add one above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Division</th>
                      <th className="py-3 px-4">Complaint Type Name</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaintTypes.map((ct) => (
                      <tr key={ct._id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-[10px] text-slate-700">
                            {ct.division}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">{ct.name}</td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{ct.description || '—'}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleComplaintType(ct._id, ct.isActive)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                              ct.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {ct.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteComplaintType(ct._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Delete Complaint Type"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Forms;
