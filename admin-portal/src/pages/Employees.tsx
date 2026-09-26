import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import {
  Users,
  Plus,
  Search,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  QrCode,
  UserCheck,
  UserX,
  Key,
  Edit3,
  FileSpreadsheet,
  ShieldCheck,
  Building,
  Award,
  ClipboardList,
  CheckCircle,
  ShieldAlert,
  Sparkles,
  Trash2,
  BadgeCheck,
  Zap,
  Package,
  Box,
} from 'lucide-react';
import { employeeApi, formApi, contentApi, resolveImageUrl } from '../api/client';

import { IdCardModal } from '../components/IdCardModal';

export interface ICertificate {
  id?: string;
  title: string;
  issuingAuthority?: string;
  certificateNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  verificationStatus?: 'Verified' | 'Pending' | 'Master';
  notes?: string;
}

export interface IIssuedItem {
  id?: string;
  name: string;
  category?: string;
  serialNumber?: string;
  assetTag?: string;
  issueDate?: string;
  returnDate?: string;
  condition?: 'New' | 'Good' | 'Refurbished' | 'Needs Service';
  status?: 'Issued' | 'Returned' | 'Damaged' | 'Audited';
  issuedBy?: string;
  notes?: string;
}

export interface IWarrantyPermissions {
  registration: boolean;
  verification: boolean;
  claim: boolean;
  claimApproval?: boolean;
  check: boolean;
  customerRecords: boolean;
  voidWarranty?: boolean;
}

export type WarrantyAccessTier = 'Disabled' | 'View Only' | 'Registrar' | 'Inspector' | 'Manager' | 'Full Access' | 'Custom';

export interface IWarrantyAccess {
  enabled: boolean;
  accessType?: WarrantyAccessTier;
  divisionScope?: string[];
  permissions: IWarrantyPermissions;
}

export interface EmployeeItem {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  department: string;
  section?: string;
  division: string[];
  designation: string;
  role: string;
  plainPassword?: string;
  photoUrl?: string;
  barcode?: string;
  permissions?: string[];
  certificates?: ICertificate[];
  issuedItems?: IIssuedItem[];
  warrantyAccess?: IWarrantyAccess;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const DEFAULT_DIVISIONS = ['Battery', 'Rental', 'Showroom', 'Spare Parts', 'Plant', 'Customer Support', 'Warranty'];
const DEFAULT_DEPARTMENTS = [
  'Technical',
  'Sales & Dealership',
  'Operations',
  'Quality & Testing',
  'Plant & Assembly',
  'Customer Support',
  'Warranty Operations',
];

const SOFT_CODED_DESIGNATION_PRESETS = [
  'Senior Battery Technician',
  'EV Diagnostic Engineer',
  'Smart BMS & Firmware Specialist',
  'High Voltage (HV) Safety Engineer',
  'Lithium-Ion Pack Assembly Lead',
  'Junior Full Stack Developer',
  'Senior Full Stack Developer',
  'Operations & Logistics Lead',
  'Quality Assurance & Testing Inspector',
  'Customer Support Executive',
  'Spare Parts Store Manager',
  'Field Service & Breakdown Engineer',
  'Dealership & Sales Consultant',
  'Warranty Claims Specialist',
  'Kota Plant Operations Supervisor',
  'Other / Custom Designation...',
];

const SOFT_CODED_CERTIFICATE_PRESETS = [
  'High Voltage (HV) & Battery Safety Specialist (Level 3)',
  'Smart BMS, CAN-Bus & Cell Diagnostics Expert',
  'OEM Electric Vehicle Powertrain & Motor License',
  'Lithium-Ion & LFP Pack Re-Balancing Certificate',
  'Kota Manufacturing Plant Senior Assembly Engineer',
  'Spare Parts Quality Assurance & Genuine Parts Auditor',
  'ISO 9001:2015 Service Quality & Safety Inspector',
  'Fast Charger (67.2V/72V) & Power Electronics Technician',
  'EV Fleet Operations & Roadside Assistance Specialist',
  'Customer Experience & Warranty Verification Master',
];

const SOFT_CODED_GIVING_PRESETS = [
  'High Voltage (1000V) Insulated Safety Gloves & Helmet Kit',
  'Smart BMS CAN-Bus Diagnostic Scanner & Harness Set',
  'Digital Cell Internal Resistance & Voltage Analyzer',
  'Ekosmart Heavy-Duty Field Toolbag & Torque Wrench Kit',
  'OEM Portable High-Power Fast Charger (67.2V / 72V 10A)',
  'Company Diagnostics Laptop / Tablet (Preloaded Software)',
  'Ekosmart Senior Engineer Uniform & Industrial Safety Boots',
  'Mobile Handheld Diagnostic Terminal & Barcode Scanner',
  'Lithium Cell Micro Spot Welder & Hot Air Rework Station',
  'Kota Plant Security NFC Access Card & Biometric Token',
  'Company Service Two-Wheeler (EV Fleet Vehicle)',
  'Thermal Imaging Infrared Camera & Laser Temp Gun',
  'Digital Multimeter & AC/DC Clamp Meter (True RMS 600V)',
  'Aluminium Heavy-Duty Battery Transport & Delivery Crate',
];

const GIVING_CATEGORIES = [
  'Diagnostic Tool',
  'Safety Gear',
  'Hardware / IT',
  'Tooling',
  'Vehicle',
  'Access Token',
  'Logistics & Transport',
  'Uniform & Apparel',
  'Other Asset',
];

const defaultWarrantyAccess: IWarrantyAccess = {
  enabled: false,
  accessType: 'Disabled',
  divisionScope: ['All'],
  permissions: {
    registration: false,
    verification: false,
    claim: false,
    claimApproval: false,
    check: false,
    customerRecords: false,
    voidWarranty: false,
  },
};

const Employees = () => {
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [availableDivisions, setAvailableDivisions] = useState<string[]>(DEFAULT_DIVISIONS);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(DEFAULT_DEPARTMENTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [exporting, setExporting] = useState(false);

  // Password Visibility Toggle for List
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Reset Password Modal
  const [resetModalEmployee, setResetModalEmployee] = useState<EmployeeItem | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  // ID Card Modal
  const [selectedEmployeeForCard, setSelectedEmployeeForCard] = useState<EmployeeItem | null>(null);

  // Assigned Tasks Modal
  const [selectedEmployeeForTasks, setSelectedEmployeeForTasks] = useState<EmployeeItem | null>(null);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksData, setTasksData] = useState<any>(null);
  const [tasksFilter, setTasksFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [tasksSearch, setTasksSearch] = useState('');

  // Certificates Modal (Quick View)
  const [selectedEmployeeForCerts, setSelectedEmployeeForCerts] = useState<EmployeeItem | null>(null);

  // Equipment & Assets Issued (Giving) Modal (Quick View)
  const [selectedEmployeeForGivings, setSelectedEmployeeForGivings] = useState<EmployeeItem | null>(null);

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [department, setDepartment] = useState('Technical');
  const [section, setSection] = useState('Service & Diagnostics');
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>(['Battery']);
  const [designation, setDesignation] = useState('Service Engineer');
  const [role, setRole] = useState('Technician');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [warrantyAccess, setWarrantyAccess] = useState<IWarrantyAccess>(defaultWarrantyAccess);
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [issuedItems, setIssuedItems] = useState<IIssuedItem[]>([]);

  // Soft-Coded Form Customization State
  const [isCustomDesignation, setIsCustomDesignation] = useState(false);
  const [isCustomDepartment, setIsCustomDepartment] = useState(false);
  const [showAddDivisionInput, setShowAddDivisionInput] = useState(false);
  const [newDivisionInput, setNewDivisionInput] = useState('');

  // Certificate Form Draft in Modal
  const [draftCertTitle, setDraftCertTitle] = useState('');
  const [draftCertAuthority, setDraftCertAuthority] = useState('Ekosmart Technical Academy');
  const [draftCertNumber, setDraftCertNumber] = useState('');
  const [draftCertIssueDate, setDraftCertIssueDate] = useState('');
  const [draftCertExpiryDate, setDraftCertExpiryDate] = useState('No Expiry');
  const [draftCertStatus, setDraftCertStatus] = useState<'Verified' | 'Pending' | 'Master'>('Verified');
  const [showAddCertForm, setShowAddCertForm] = useState(false);

  // Equipment & Assets Issued (Giving) Form Draft in Modal
  const [draftItemName, setDraftItemName] = useState('');
  const [draftItemCategory, setDraftItemCategory] = useState('Diagnostic Tool');
  const [draftItemSerial, setDraftItemSerial] = useState('');
  const [draftItemAssetTag, setDraftItemAssetTag] = useState('');
  const [draftItemIssueDate, setDraftItemIssueDate] = useState('');
  const [draftItemReturnDate, setDraftItemReturnDate] = useState('Returnable');
  const [draftItemCondition, setDraftItemCondition] = useState<'New' | 'Good' | 'Refurbished' | 'Needs Service'>('Good');
  const [draftItemStatus, setDraftItemStatus] = useState<'Issued' | 'Returned' | 'Damaged' | 'Audited'>('Issued');
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await employeeApi.getAll({
        search: search || undefined,
        division: divisionFilter || undefined,
        status: statusFilter || undefined,
      });
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.allSettled([
      formApi.getSections(),
      contentApi.getAdmin(),
    ])
      .then(([secResult, contentResult]) => {
        const discoveredDivisions = new Set<string>(DEFAULT_DIVISIONS);

        if (
          secResult.status === 'fulfilled' &&
          secResult.value.data?.success &&
          Array.isArray(secResult.value.data.data)
        ) {
          secResult.value.data.data.forEach((s: string) => {
            if (s && s.trim()) discoveredDivisions.add(s.trim());
          });
        }

        if (
          contentResult.status === 'fulfilled' &&
          contentResult.value.data?.success &&
          contentResult.value.data.data
        ) {
          const cmsData = contentResult.value.data.data;
          if (Array.isArray(cmsData.serviceCards)) {
            cmsData.serviceCards.forEach((c: any) => {
              if (c.isVisible !== false) {
                if (c.section && c.section !== 'General' && c.section.trim()) {
                  discoveredDivisions.add(c.section.trim());
                }
                if (c.title && c.title.trim()) {
                  discoveredDivisions.add(c.title.trim());
                }
              }
            });
          }
        }

        const allDivs = Array.from(discoveredDivisions);
        setAvailableDivisions(allDivs);

        const coreDepts = [
          'Technical',
          'Sales & Dealership',
          'Operations',
          'Quality & Testing',
          'Plant & Assembly',
          'Customer Support',
          'Warranty Operations',
        ];
        setAvailableDepartments(Array.from(new Set([...coreDepts, ...allDivs])));
      })
      .catch((e: any) => console.warn('Failed to load dynamic sections and CMS services in Employees:', e));
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [divisionFilter, statusFilter]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleDivisionToggle = (div: string) => {
    if (selectedDivisions.includes(div)) {
      if (selectedDivisions.length > 1) {
        setSelectedDivisions(selectedDivisions.filter((d) => d !== div));
      }
    } else {
      setSelectedDivisions([...selectedDivisions, div]);
    }
  };

  const handleAddCustomDivision = () => {
    const trimmed = newDivisionInput.trim();
    if (!trimmed) return;
    if (!availableDivisions.includes(trimmed)) {
      setAvailableDivisions((prev) => [...prev, trimmed]);
      setAvailableDepartments((prev) => Array.from(new Set([...prev, trimmed])));
    }
    if (!selectedDivisions.includes(trimmed)) {
      setSelectedDivisions((prev) => [...prev, trimmed]);
    }
    setNewDivisionInput('');
    setShowAddDivisionInput(false);
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        setFormError('Please select a valid image file (JPEG, PNG, or WebP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError('File size exceeds 5MB limit.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setFormError('');
    }
  };

  // Preset switch for warranty access
  const applyWarrantyAccessPreset = (preset: WarrantyAccessTier) => {
    switch (preset) {
      case 'Disabled':
        setWarrantyAccess({
          enabled: false,
          accessType: 'Disabled',
          divisionScope: ['All'],
          permissions: {
            registration: false,
            verification: false,
            claim: false,
            claimApproval: false,
            check: false,
            customerRecords: false,
            voidWarranty: false,
          },
        });
        break;
      case 'View Only':
        setWarrantyAccess({
          enabled: true,
          accessType: 'View Only',
          divisionScope: warrantyAccess.divisionScope || ['All'],
          permissions: {
            registration: false,
            verification: true,
            claim: false,
            claimApproval: false,
            check: true,
            customerRecords: false,
            voidWarranty: false,
          },
        });
        break;
      case 'Registrar':
        setWarrantyAccess({
          enabled: true,
          accessType: 'Registrar',
          divisionScope: warrantyAccess.divisionScope || ['All'],
          permissions: {
            registration: true,
            verification: true,
            claim: false,
            claimApproval: false,
            check: true,
            customerRecords: true,
            voidWarranty: false,
          },
        });
        break;
      case 'Inspector':
        setWarrantyAccess({
          enabled: true,
          accessType: 'Inspector',
          divisionScope: warrantyAccess.divisionScope || ['All'],
          permissions: {
            registration: false,
            verification: true,
            claim: true,
            claimApproval: false,
            check: true,
            customerRecords: false,
            voidWarranty: false,
          },
        });
        break;
      case 'Manager':
        setWarrantyAccess({
          enabled: true,
          accessType: 'Manager',
          divisionScope: warrantyAccess.divisionScope || ['All'],
          permissions: {
            registration: true,
            verification: true,
            claim: true,
            claimApproval: true,
            check: true,
            customerRecords: true,
            voidWarranty: false,
          },
        });
        break;
      case 'Full Access':
        setWarrantyAccess({
          enabled: true,
          accessType: 'Full Access',
          divisionScope: ['All'],
          permissions: {
            registration: true,
            verification: true,
            claim: true,
            claimApproval: true,
            check: true,
            customerRecords: true,
            voidWarranty: true,
          },
        });
        break;
      case 'Custom':
      default:
        setWarrantyAccess((prev) => ({
          ...prev,
          enabled: true,
          accessType: 'Custom',
        }));
        break;
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingEmployeeId(null);
    setFormError('');
    setEmployeeId(`EMP-${Date.now().toString().slice(-4)}`);
    setName('');
    setEmail('');
    setMobile('');
    setAddress('');
    setDepartment('Technical');
    setSection('Service & Diagnostics');
    setSelectedDivisions(['Battery']);
    setDesignation('Senior Battery Technician');
    setRole('Technician');
    setPassword('');
    setConfirmPassword('');
    setPhotoFile(null);
    setPhotoPreview('');
    setStatus('Active');
    setWarrantyAccess(defaultWarrantyAccess);
    setCertificates([]);
    setIssuedItems([]);
    setIsCustomDesignation(false);
    setIsCustomDepartment(false);
    setShowAddDivisionInput(false);
    setNewDivisionInput('');
    setShowAddCertForm(false);
    setShowAddItemForm(false);
    resetDraftCert();
    resetDraftItem();
    setShowModal(true);
  };

  const openEditModal = (emp: EmployeeItem) => {
    setIsEditing(true);
    setEditingEmployeeId(emp._id);
    setFormError('');
    setEmployeeId(emp.employeeId || '');
    setName(emp.name || '');
    setEmail(emp.email || '');
    setMobile(emp.mobile || '');
    setAddress(emp.address || '');
    setDepartment(emp.department || 'Technical');
    setSection(emp.section || '');
    setSelectedDivisions(emp.division && emp.division.length > 0 ? emp.division : ['Battery']);
    setDesignation(emp.designation || 'Senior Battery Technician');
    setRole(emp.role || 'Technician');
    setPassword('');
    setConfirmPassword('');
    setPhotoFile(null);
    setPhotoPreview(emp.photoUrl ? resolveImageUrl(emp.photoUrl) : '');
    setStatus(emp.status || 'Active');


    const isStandardDesignation = SOFT_CODED_DESIGNATION_PRESETS
      .filter((p) => p !== 'Other / Custom Designation...')
      .includes(emp.designation || '');
    setIsCustomDesignation(!isStandardDesignation);

    const isStandardDepartment = availableDepartments.includes(emp.department || '');
    setIsCustomDepartment(!isStandardDepartment && Boolean(emp.department));
    setShowAddDivisionInput(false);
    setNewDivisionInput('');

    const rawWarranty = emp.warrantyAccess || defaultWarrantyAccess;
    setWarrantyAccess({
      enabled: Boolean(rawWarranty.enabled),
      accessType: rawWarranty.accessType || (rawWarranty.enabled ? 'Custom' : 'Disabled'),
      divisionScope: Array.isArray(rawWarranty.divisionScope) ? rawWarranty.divisionScope : ['All'],
      permissions: {
        registration: Boolean(rawWarranty.permissions?.registration),
        verification: Boolean(rawWarranty.permissions?.verification),
        claim: Boolean(rawWarranty.permissions?.claim),
        claimApproval: Boolean(rawWarranty.permissions?.claimApproval),
        check: Boolean(rawWarranty.permissions?.check),
        customerRecords: Boolean(rawWarranty.permissions?.customerRecords),
        voidWarranty: Boolean(rawWarranty.permissions?.voidWarranty),
      },
    });

    setCertificates(emp.certificates || []);
    setIssuedItems(emp.issuedItems || []);
    setShowAddCertForm(false);
    setShowAddItemForm(false);
    resetDraftCert();
    resetDraftItem();
    setShowModal(true);
  };

  const resetDraftCert = () => {
    setDraftCertTitle('');
    setDraftCertAuthority('Ekosmart Technical Academy');
    setDraftCertNumber(`EBS-${Date.now().toString().slice(-4)}`);
    setDraftCertIssueDate(new Date().toISOString().slice(0, 10));
    setDraftCertExpiryDate('No Expiry');
    setDraftCertStatus('Verified');
  };

  const resetDraftItem = () => {
    setDraftItemName('');
    setDraftItemCategory('Diagnostic Tool');
    setDraftItemSerial(`EQ-${Date.now().toString().slice(-4)}`);
    setDraftItemAssetTag(`TAG-${Date.now().toString().slice(-4)}`);
    setDraftItemIssueDate(new Date().toISOString().slice(0, 10));
    setDraftItemReturnDate('Returnable');
    setDraftItemCondition('Good');
    setDraftItemStatus('Issued');
  };

  const handleAddCertificate = () => {
    if (!draftCertTitle.trim()) {
      setFormError('Please select or type a Certificate Title.');
      return;
    }
    const newCert: ICertificate = {
      id: `cert-${Date.now()}`,
      title: draftCertTitle.trim(),
      issuingAuthority: draftCertAuthority.trim() || 'Ekosmart Technical Academy',
      certificateNumber: draftCertNumber.trim(),
      issueDate: draftCertIssueDate || new Date().toISOString().slice(0, 10),
      expiryDate: draftCertExpiryDate || 'No Expiry',
      verificationStatus: draftCertStatus,
    };
    setCertificates((prev) => [...prev, newCert]);
    resetDraftCert();
    setShowAddCertForm(false);
  };

  const handleRemoveCertificate = (index: number) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddIssuedItem = () => {
    if (!draftItemName.trim()) {
      setFormError('Please select or type an Equipment / Asset name to issue.');
      return;
    }
    const newItem: IIssuedItem = {
      id: `item-${Date.now()}`,
      name: draftItemName.trim(),
      category: draftItemCategory || 'Diagnostic Tool',
      serialNumber: draftItemSerial.trim(),
      assetTag: draftItemAssetTag.trim(),
      issueDate: draftItemIssueDate || new Date().toISOString().slice(0, 10),
      returnDate: draftItemReturnDate || 'Returnable',
      condition: draftItemCondition,
      status: draftItemStatus,
      issuedBy: 'Super Admin',
    };
    setIssuedItems((prev) => [...prev, newItem]);
    resetDraftItem();
    setShowAddItemForm(false);
  };

  const handleRemoveIssuedItem = (index: number) => {
    setIssuedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!employeeId || !name || !email || !mobile || !department || !role) {
      setFormError('Please fill in all required basic fields.');
      return;
    }

    if (!isEditing && !password) {
      setFormError('Password is required for new employee account.');
      return;
    }

    if (password && password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (selectedDivisions.length === 0) {
      setFormError('Please assign at least one division to the employee.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('employeeId', employeeId.trim());
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('mobile', mobile.trim());
      formData.append('address', address.trim());
      formData.append('department', department);
      formData.append('section', section.trim());
      formData.append('division', JSON.stringify(selectedDivisions));
      formData.append('designation', designation.trim());
      formData.append('role', role);
      formData.append('status', status);
      formData.append('certificates', JSON.stringify(certificates));
      formData.append('issuedItems', JSON.stringify(issuedItems));
      formData.append('warrantyAccess', JSON.stringify(warrantyAccess));

      if (password) {
        formData.append('password', password);
      }

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      let res;
      if (isEditing && editingEmployeeId) {
        res = await employeeApi.update(editingEmployeeId, formData);
      } else {
        res = await employeeApi.create(formData);
      }

      if (res.data.success) {
        setSuccessBanner(
          isEditing
            ? `Employee ${name} (${employeeId}) updated successfully!`
            : `Employee ${name} (${employeeId}) created successfully!`
        );
        setShowModal(false);
        await fetchEmployees();
      } else {
        setFormError(res.data.message || 'Operation failed');
      }
    } catch (err: any) {
      console.error('Error saving employee:', err);
      setFormError(err.response?.data?.message || 'Server error. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await employeeApi.toggleStatus(id);
      fetchEmployees();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const togglePasswordView = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!resetModalEmployee || !newPassword) return;

    setResettingPassword(true);
    try {
      const formData = new FormData();
      formData.append('password', newPassword);
      const res = await employeeApi.update(resetModalEmployee._id, formData);
      if (res.data.success) {
        setSuccessBanner(`Password reset successfully for ${resetModalEmployee.name}!`);
        setResetModalEmployee(null);
        setNewPassword('');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update password');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);

      let blobData: Blob | null = null;
      try {
        const res = await employeeApi.export({
          division: divisionFilter || undefined,
          status: statusFilter || undefined,
          search: search || undefined,
        });
        if (res.data instanceof Blob) {
          blobData = res.data;
        } else if (typeof res.data === 'string' && res.data.length > 20) {
          blobData = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        }
      } catch (apiErr) {
        console.warn('API export encountered error, using client-side CSV generator:', apiErr);
      }

      // Client-side fallback generator ensuring export NEVER fails
      if (!blobData || blobData.size < 20) {
        const headers = [
          'Employee ID',
          'Employee Name',
          'Email',
          'Mobile',
          'Department',
          'Section',
          'Designation',
          'Role',
          'Status',
          'Certificates Count',
          'Certificates Details',
          'Equipment & Assets Given Count',
          'Equipment & Assets Given Details',
          'Warranty Access Tier',
          'Warranty Scope',
          'Warranty Permissions',
          'Address',
          'Date Added',
          'Last Updated',
        ];

        const escapeCsv = (str: any) => {
          if (str === null || str === undefined) return '""';
          const s = String(str).replace(/"/g, '""');
          return `"${s}"`;
        };

        const rows = employees.map((emp) => {
          const warrantyTier = emp.warrantyAccess?.enabled ? (emp.warrantyAccess?.accessType || 'Authorized') : 'Disabled';
          const scope = emp.warrantyAccess?.divisionScope?.join('; ') || 'All';
          const perms: string[] = [];
          if (emp.warrantyAccess?.permissions?.registration) perms.push('Registration');
          if (emp.warrantyAccess?.permissions?.verification) perms.push('Verification');
          if (emp.warrantyAccess?.permissions?.claim) perms.push('Claim Filing');
          if (emp.warrantyAccess?.permissions?.claimApproval) perms.push('Claim Approval');
          if (emp.warrantyAccess?.permissions?.check) perms.push('Serial Check');
          if (emp.warrantyAccess?.permissions?.customerRecords) perms.push('Customer Records');
          if (emp.warrantyAccess?.permissions?.voidWarranty) perms.push('Voiding');

          const certs = emp.certificates || [];
          const certTitles = certs.map((c) => `${c.title} (${c.verificationStatus || 'Verified'})`).join('; ');

          const items = emp.issuedItems || [];
          const itemTitles = items.map((i) => `${i.name} [${i.category || 'Asset'}${i.serialNumber ? ` - ${i.serialNumber}` : ''}] (${i.condition || 'Good'})`).join('; ');

          return [
            escapeCsv(emp.employeeId),
            escapeCsv(emp.name),
            escapeCsv(emp.email),
            escapeCsv(emp.mobile),
            escapeCsv(emp.department),
            escapeCsv(emp.section || ''),
            escapeCsv(emp.designation || ''),
            escapeCsv(emp.role),
            escapeCsv(emp.status),
            escapeCsv(certs.length),
            escapeCsv(certTitles || 'None'),
            escapeCsv(items.length),
            escapeCsv(itemTitles || 'None'),
            escapeCsv(warrantyTier),
            escapeCsv(scope),
            escapeCsv(perms.join(', ') || 'None'),
            escapeCsv(emp.address || ''),
            escapeCsv(emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : ''),
            escapeCsv(new Date().toLocaleDateString()),
          ].join(',');
        });

        const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
        blobData = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      }

      const url = window.URL.createObjectURL(blobData);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Ekosmart_Staff_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccessBanner(`Staff Excel/CSV directory exported successfully (${employees.length} employee records).`);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export employees list.');
    } finally {
      setExporting(false);
    }
  };

  // Open Assigned Tasks Modal
  const openTasksModal = async (emp: EmployeeItem) => {
    setSelectedEmployeeForTasks(emp);
    setTasksLoading(true);
    setTasksData(null);
    try {
      const res = await employeeApi.getTasks(emp._id);
      if (res.data.success) {
        setTasksData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load employee tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  };

  const getWarrantyTierBadge = (access?: IWarrantyAccess) => {
    if (!access || !access.enabled) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
          Disabled
        </span>
      );
    }
    const tier = access.accessType || 'Custom';
    switch (tier) {
      case 'Full Access':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full shadow-xs">
            <ShieldAlert size={12} className="text-purple-600" />
            <span>Full Super Access</span>
          </span>
        );
      case 'Manager':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-xs">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Warranty Manager</span>
          </span>
        );
      case 'Registrar':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full shadow-xs">
            <BadgeCheck size={12} className="text-blue-600" />
            <span>Registrar</span>
          </span>
        );
      case 'Inspector':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-xs">
            <Zap size={12} className="text-amber-600" />
            <span>Inspector / Tech</span>
          </span>
        );
      case 'View Only':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-300 px-2.5 py-0.5 rounded-full shadow-xs">
            <Eye size={12} className="text-cyan-600" />
            <span>View & Check Only</span>
          </span>
        );
      case 'Custom':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full shadow-xs">
            <ShieldCheck size={12} />
            <span>Custom Tier</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Export / Add Employee Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-green-600" />
            Staff & Employee Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage service engineers, technical certificates, assigned tasks & work orders, warranty permissions, and credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 rounded-xl text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
            <span>Export Excel</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-2xl flex justify-between items-center text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner('')} className="text-emerald-600 hover:text-emerald-800">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by Name, Employee ID, Mobile, Certificate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 bg-white"
          >
            <option value="">All Divisions</option>
            {availableDivisions.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* EMPLOYEE LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin text-green-600 mb-2" size={32} />
            <p className="text-xs font-semibold">Loading employees & engineers...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Users size={40} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold text-slate-600">No employees found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or click Add Employee above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Contact & Station</th>
                  <th className="py-3.5 px-6">Department & Section</th>
                  <th className="py-3.5 px-6">Certificates & Badges</th>
                  <th className="py-3.5 px-6">Equipment & Assets Given</th>
                  <th className="py-3.5 px-6">Warranty Access</th>
                  <th className="py-3.5 px-6">Password / Mask</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/75 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {emp.photoUrl ? (
                          <img
                            src={resolveImageUrl(emp.photoUrl)}
                            alt={emp.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-xs"
                          />
                        ) : (

                          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200 text-sm">
                            {emp.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{emp.name}</h4>
                          <span className="font-mono text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                            {emp.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="text-xs font-medium text-slate-700">{emp.email}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{emp.mobile}</p>
                      {emp.address && <p className="text-[11px] text-slate-400 truncate max-w-xs">{emp.address}</p>}
                    </td>

                    <td className="py-4 px-6">
                      <p className="text-xs font-bold text-slate-800">{emp.department}</p>
                      <p className="text-xs text-slate-500">
                        {emp.designation} {emp.section ? `• ${emp.section}` : ''}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {emp.division &&
                          emp.division.map((div) => (
                            <span
                              key={div}
                              className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                            >
                              {div}
                            </span>
                          ))}
                      </div>
                    </td>

                    {/* Certificates & Badges Column */}
                    <td className="py-4 px-6">
                      {emp.certificates && emp.certificates.length > 0 ? (
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => setSelectedEmployeeForCerts(emp)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition cursor-pointer shadow-2xs"
                          >
                            <Award size={13} className="text-amber-600" />
                            <span>{emp.certificates.length} Credentials</span>
                          </button>
                          <p className="text-[10px] text-slate-500 truncate max-w-[140px]" title={emp.certificates[0].title}>
                            {emp.certificates[0].title}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No certs recorded</span>
                      )}
                    </td>

                    {/* Equipment & Assets Given (Giving) Column */}
                    <td className="py-4 px-6">
                      {emp.issuedItems && emp.issuedItems.length > 0 ? (
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => setSelectedEmployeeForGivings(emp)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 px-2.5 py-1 rounded-lg transition cursor-pointer shadow-2xs"
                          >
                            <Box size={13} className="text-teal-600" />
                            <span>{emp.issuedItems.length} Assets Given</span>
                          </button>
                          <p className="text-[10px] text-slate-500 truncate max-w-[140px]" title={emp.issuedItems[0].name}>
                            {emp.issuedItems[0].name}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">None issued</span>
                      )}
                    </td>

                    {/* Warranty Access Tier Column */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {getWarrantyTierBadge(emp.warrantyAccess)}
                        {emp.warrantyAccess?.enabled && (
                          <p className="text-[10px] text-slate-500">
                            {[
                              emp.warrantyAccess.permissions?.registration && 'Reg',
                              emp.warrantyAccess.permissions?.verification && 'Verif',
                              emp.warrantyAccess.permissions?.claim && 'Claim',
                              emp.warrantyAccess.permissions?.check && 'Check',
                            ]
                              .filter(Boolean)
                              .join(' • ') || 'Active Scope'}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Password / Credentials Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 w-fit">
                        <span className="font-mono text-xs text-slate-700 font-semibold tracking-wider">
                          {visiblePasswords[emp._id]
                            ? emp.plainPassword || (emp.employeeId?.startsWith('TEST-') || emp.employeeId?.startsWith('EMP-') ? 'employee123' : 'employee123')
                            : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordView(emp._id)}
                          className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                          title="Toggle Password Mask"
                        >
                          {visiblePasswords[emp._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          emp.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'Active' ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        ></span>
                        {emp.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Assigned Tasks Button */}
                        <button
                          onClick={() => openTasksModal(emp)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Assigned Tasks & Tickets Dossier"
                        >
                          <ClipboardList size={16} />
                        </button>

                        {/* Edit Employee Button */}
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition cursor-pointer"
                          title="Edit Employee & Certificates & Warranty"
                        >
                          <Edit3 size={16} />
                        </button>

                        {/* Password Reset Button */}
                        <button
                          onClick={() => setResetModalEmployee(emp)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Set / Reset Password"
                        >
                          <Key size={16} />
                        </button>

                        {/* Official ID Card Button */}
                        <button
                          onClick={() => setSelectedEmployeeForCard(emp)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                          title="View & Print ID Card"
                        >
                          <QrCode size={17} />
                        </button>

                        {/* Status Toggle Button */}
                        <button
                          onClick={() => handleToggleStatus(emp._id)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            emp.status === 'Active'
                              ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={emp.status === 'Active' ? 'Deactivate Employee' : 'Activate Employee'}
                        >
                          {emp.status === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
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

      {/* COMPREHENSIVE ADD / EDIT EMPLOYEE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {isEditing ? `Edit Employee Dossier — ${name || employeeId}` : 'Register New Employee & Engineer'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEditing
                      ? 'Modify profile, technical certificates, department assignments, and warranty access tier'
                      : 'Enter credentials, technical credentials, department, and warranty privileges'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold">
                  <AlertCircle size={18} className="shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* SECTION 1: EMPLOYEE BASIC INFORMATION */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <Users className="text-green-600" size={18} />
                  <h4 className="text-sm font-bold text-slate-800">1. Employee Basic Information</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Photo Upload */}
                  <div className="sm:col-span-2 flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-green-500 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">
                        Photo
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="block font-bold text-slate-700 mb-1">Employee Photograph</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400">JPEG, PNG, WebP up to 5MB</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g. EMP-1002"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-green-700 focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@ekosmartdrive.in"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Address / Plant Station</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Rang Talab, Kota Facility / Showroom Counter"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isEditing ? 'Change Password (Leave blank to keep)' : 'Initial Password *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required={!isEditing}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isEditing ? '••••••••' : 'Enter login password'}
                        className="w-full border border-slate-300 rounded-xl p-2.5 pr-10 text-xs text-slate-800 focus:ring-2 focus:ring-green-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold bg-white text-slate-800"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: EMPLOYEE DEPARTMENT / SECTION */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <Building className="text-blue-600" size={18} />
                  <h4 className="text-sm font-bold text-slate-800">2. Department, Section & Role</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Department with Soft-Codes and Custom Option */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">Department</label>
                      <span className="text-[10px] text-blue-600 font-medium">Core & Dynamic Services</span>
                    </div>
                    <select
                      value={
                        isCustomDepartment || (!availableDepartments.includes(department) && department !== '')
                          ? 'Other / Custom Department...'
                          : department
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Other / Custom Department...') {
                          setIsCustomDepartment(true);
                          if (availableDepartments.includes(department)) {
                            setDepartment('');
                          }
                        } else {
                          setIsCustomDepartment(false);
                          setDepartment(val);
                        }
                      }}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs bg-white text-slate-800 font-semibold mb-1.5"
                    >
                      {availableDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                      <option value="Other / Custom Department...">Other / Custom Department...</option>
                    </select>

                    {(isCustomDepartment || (!availableDepartments.includes(department) && department !== '')) && (
                      <div className="relative animate-in fade-in duration-150">
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="Enter custom department (e.g. Battery R&D Lab)"
                          className="w-full border-2 border-blue-400 rounded-xl p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 bg-blue-50/40 font-medium"
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          💡 Linked to staff profile & Soft ID card.
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sub-Section / Unit</label>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="e.g. Diagnostic Lab, Spare Parts Logistics"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  {/* Designation with Soft-Coded Presets and 'Other / Custom' Option */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">Designation</label>
                      <span className="text-[10px] text-blue-600 font-medium">Soft-coded with 'Other' option</span>
                    </div>
                    <select
                      value={
                        isCustomDesignation ||
                        (!SOFT_CODED_DESIGNATION_PRESETS.filter((p) => p !== 'Other / Custom Designation...').includes(designation) &&
                          designation !== '')
                          ? 'Other / Custom Designation...'
                          : designation
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Other / Custom Designation...') {
                          setIsCustomDesignation(true);
                          if (SOFT_CODED_DESIGNATION_PRESETS.includes(designation)) {
                            setDesignation('');
                          }
                        } else {
                          setIsCustomDesignation(false);
                          setDesignation(val);
                        }
                      }}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs bg-white text-slate-800 font-semibold mb-1.5"
                    >
                      {SOFT_CODED_DESIGNATION_PRESETS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    {(isCustomDesignation ||
                      (!SOFT_CODED_DESIGNATION_PRESETS.filter((p) => p !== 'Other / Custom Designation...').includes(designation) &&
                        designation !== '')) && (
                      <div className="relative animate-in fade-in duration-150">
                        <input
                          type="text"
                          required
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="Enter custom designation (e.g. Chief Battery Architect)"
                          className="w-full border-2 border-blue-400 rounded-xl p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 bg-blue-50/40 font-medium"
                          autoFocus
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          💡 Reflected on Soft ID badge, directory, & task lists.
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">System Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs bg-white text-slate-800 font-semibold"
                    >
                      <option value="Technician">Technician / Engineer</option>
                      <option value="Manager">Manager / Lead</option>
                      <option value="Staff">Desk Staff</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  {/* Authorized Service Divisions with Quick Add New Service */}
                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block font-bold text-slate-700">Authorized Service Divisions</label>
                        <p className="text-[11px] text-slate-500">
                          Connected to CMS service cards, form divisions, and dynamic services.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddDivisionInput(!showAddDivisionInput)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>{showAddDivisionInput ? 'Close' : 'Add New Service Division'}</span>
                      </button>
                    </div>

                    {showAddDivisionInput && (
                      <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
                        <input
                          type="text"
                          value={newDivisionInput}
                          onChange={(e) => setNewDivisionInput(e.target.value)}
                          placeholder="e.g. Solar EV Charging, Mobile Breakdown Van"
                          className="flex-1 border border-blue-300 rounded-lg p-2 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomDivision();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomDivision}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Add & Select
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {availableDivisions.map((div) => {
                        const active = selectedDivisions.includes(div);
                        return (
                          <button
                            key={div}
                            type="button"
                            onClick={() => handleDivisionToggle(div)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                              active
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span>{active ? '✓' : '+'}</span>
                            <span>{div}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: TECHNICAL CERTIFICATES & TRAINING CREDENTIALS (SOFT-CODED DROPDOWN) */}
              <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-amber-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="text-amber-600" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-amber-950">3. Certificates & Qualifications</h4>
                      <p className="text-[11px] text-slate-500">
                        Award soft-coded technical certifications, safety credentials, and verifiable licenses to this employee.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddCertForm(!showAddCertForm)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>{showAddCertForm ? 'Close Form' : 'Add Certificate'}</span>
                  </button>
                </div>

                {/* New Certificate Form Drawer */}
                {showAddCertForm && (
                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={13} />
                      <span>Issue New Technical Credential</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Soft-coded Certificate Dropdown */}
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Select Certificate Preset (or choose custom below)
                        </label>
                        <select
                          value={draftCertTitle}
                          onChange={(e) => setDraftCertTitle(e.target.value)}
                          className="w-full border border-amber-300 rounded-xl p-2 text-xs bg-white text-slate-800 font-semibold"
                        >
                          <option value="">-- Choose from Soft-Coded Presets --</option>
                          {SOFT_CODED_CERTIFICATE_PRESETS.map((preset) => (
                            <option key={preset} value={preset}>
                              {preset}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Title Input */}
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Certificate / Credential Title (Custom or Edited)
                        </label>
                        <input
                          type="text"
                          value={draftCertTitle}
                          onChange={(e) => setDraftCertTitle(e.target.value)}
                          placeholder="e.g. Lithium-Ion High Voltage Master Engineer"
                          className="w-full border border-amber-300 rounded-xl p-2 text-xs bg-white text-slate-800 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Issuing Authority / Academy</label>
                        <input
                          type="text"
                          value={draftCertAuthority}
                          onChange={(e) => setDraftCertAuthority(e.target.value)}
                          placeholder="e.g. Ekosmart Technical Academy"
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Certificate ID / Serial Number</label>
                        <input
                          type="text"
                          value={draftCertNumber}
                          onChange={(e) => setDraftCertNumber(e.target.value)}
                          placeholder="e.g. EBS-CERT-2026-90"
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Issue Date</label>
                        <input
                          type="date"
                          value={draftCertIssueDate}
                          onChange={(e) => setDraftCertIssueDate(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Expiry / Valid Until</label>
                        <input
                          type="text"
                          value={draftCertExpiryDate}
                          onChange={(e) => setDraftCertExpiryDate(e.target.value)}
                          placeholder="e.g. 2029-06-30 or No Expiry"
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Verification Status</label>
                        <select
                          value={draftCertStatus}
                          onChange={(e) => setDraftCertStatus(e.target.value as any)}
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white font-semibold"
                        >
                          <option value="Verified">Verified Official</option>
                          <option value="Master">Master Expert Badge</option>
                          <option value="Pending">Pending Audit</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleAddCertificate}
                          className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle size={14} />
                          <span>Attach to Employee</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* List of Assigned Certificates */}
                {certificates.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No technical certificates assigned yet. Click &ldquo;Add Certificate&rdquo; above to award credentials.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {certificates.map((cert, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-amber-50/40 border border-amber-200/80 rounded-xl p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                            🎓
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-800 text-xs">{cert.title}</h5>
                            <p className="text-[11px] text-slate-500">
                              {cert.issuingAuthority || 'Ekosmart Academy'} • ID: {cert.certificateNumber || 'EBS-01'} •{' '}
                              <span className="font-semibold text-emerald-700">{cert.verificationStatus || 'Verified'}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCertificate(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Remove Certificate"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 4: EQUIPMENT & ASSETS ISSUED (GIVING) (SOFT-CODED DROPDOWN) */}
              <div className="bg-white p-5 rounded-2xl border-2 border-teal-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-teal-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Package className="text-teal-600" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-teal-950">4. Equipment & Assets Issued (Giving)</h4>
                      <p className="text-[11px] text-slate-500">
                        Issue soft-coded diagnostic gear, safety kits, laptops, tools, and company assets to this employee.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddItemForm(!showAddItemForm)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>{showAddItemForm ? 'Close Form' : 'Issue Equipment / Asset'}</span>
                  </button>
                </div>

                {/* New Issued Item Form Drawer */}
                {showAddItemForm && (
                  <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 space-y-3">
                    <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={13} />
                      <span>Issue New Tool, Device or Company Asset</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Soft-coded Item Dropdown */}
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Select Equipment / Asset Preset (or choose custom below)
                        </label>
                        <select
                          value={draftItemName}
                          onChange={(e) => setDraftItemName(e.target.value)}
                          className="w-full border border-teal-300 rounded-xl p-2 text-xs bg-white text-slate-800 font-semibold"
                        >
                          <option value="">-- Choose from Soft-Coded Presets --</option>
                          {SOFT_CODED_GIVING_PRESETS.map((preset) => (
                            <option key={preset} value={preset}>
                              {preset}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Title Input */}
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Equipment / Asset Title (Custom or Edited)
                        </label>
                        <input
                          type="text"
                          value={draftItemName}
                          onChange={(e) => setDraftItemName(e.target.value)}
                          placeholder="e.g. Fluke 87V Industrial Multimeter"
                          className="w-full border border-teal-300 rounded-xl p-2 text-xs bg-white text-slate-800 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Asset Category</label>
                        <select
                          value={draftItemCategory}
                          onChange={(e) => setDraftItemCategory(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white font-semibold"
                        >
                          {GIVING_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Serial Number / Unique ID</label>
                        <input
                          type="text"
                          value={draftItemSerial}
                          onChange={(e) => setDraftItemSerial(e.target.value)}
                          placeholder="e.g. SN-FLK-88902"
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Asset Tag / QR Code</label>
                        <input
                          type="text"
                          value={draftItemAssetTag}
                          onChange={(e) => setDraftItemAssetTag(e.target.value)}
                          placeholder="e.g. EBS-ASSET-092"
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Issue Date</label>
                        <input
                          type="date"
                          value={draftItemIssueDate}
                          onChange={(e) => setDraftItemIssueDate(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Returnable / Expiry Policy</label>
                        <input
                          type="text"
                          value={draftItemReturnDate}
                          onChange={(e) => setDraftItemReturnDate(e.target.value)}
                          placeholder="e.g. Returnable on Exit, Permanent, 2027-12-31"
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Physical Condition</label>
                        <select
                          value={draftItemCondition}
                          onChange={(e) => setDraftItemCondition(e.target.value as any)}
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white font-semibold"
                        >
                          <option value="New">Brand New (Factory Sealed)</option>
                          <option value="Good">Good (Operational)</option>
                          <option value="Refurbished">Refurbished / Certified</option>
                          <option value="Needs Service">Needs Service / Audit</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Allocation Status</label>
                        <select
                          value={draftItemStatus}
                          onChange={(e) => setDraftItemStatus(e.target.value as any)}
                          className="w-full border border-slate-300 rounded-xl p-2 text-xs bg-white font-semibold"
                        >
                          <option value="Issued">Currently Issued & Active</option>
                          <option value="Returned">Returned to Inventory</option>
                          <option value="Audited">Audited & Verified</option>
                          <option value="Damaged">Damaged / Replaced</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleAddIssuedItem}
                          className="py-2.5 px-6 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle size={14} />
                          <span>Attach Asset to Employee</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* List of Issued Equipment & Assets */}
                {issuedItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No equipment or assets given yet. Click &ldquo;Issue Equipment / Asset&rdquo; above to assign tools, safety gear, or devices.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {issuedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-teal-50/40 border border-teal-200/80 rounded-xl p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                            📦
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-800 text-xs">{item.name}</h5>
                            <p className="text-[11px] text-slate-500">
                              <span className="font-semibold text-teal-700">{item.category || 'Tool'}</span> • SN: {item.serialNumber || 'N/A'} • Tag: {item.assetTag || 'N/A'} •{' '}
                              <span className="font-semibold text-slate-700">Condition: {item.condition || 'Good'}</span> •{' '}
                              <span className="font-semibold text-emerald-700">{item.status || 'Issued'}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveIssuedItem(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Remove Issued Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 5: GRANULAR WARRANTY ACCESS TYPES & PRIVILEGES */}
              <div className="bg-white p-5 rounded-2xl border-2 border-indigo-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-indigo-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-indigo-600" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-indigo-950">5. Warranty Access Type & Scope</h4>
                      <p className="text-[11px] text-slate-500">
                        Choose an authorization tier preset or fine-tune individual warranty permissions.
                      </p>
                    </div>
                  </div>

                  {/* Access Tier Preset Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-900">Access Tier:</span>
                    <select
                      value={warrantyAccess.accessType || (warrantyAccess.enabled ? 'Custom' : 'Disabled')}
                      onChange={(e) => applyWarrantyAccessPreset(e.target.value as WarrantyAccessTier)}
                      className="border-2 border-indigo-300 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-950 bg-indigo-50/70"
                    >
                      <option value="Disabled">Disabled (No Access)</option>
                      <option value="View Only">View & Check Only</option>
                      <option value="Registrar">Warranty Registrar</option>
                      <option value="Inspector">Field Inspector / Technician</option>
                      <option value="Manager">Warranty Approver & Manager</option>
                      <option value="Full Access">Full Super Admin Warranty</option>
                      <option value="Custom">Custom Granular Access</option>
                    </select>
                  </div>
                </div>

                {warrantyAccess.enabled ? (
                  <div className="space-y-4 pt-1">
                    {/* Granular Checkboxes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/50 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={warrantyAccess.permissions.registration}
                          onChange={(e) =>
                            setWarrantyAccess({
                              ...warrantyAccess,
                              accessType: 'Custom',
                              permissions: { ...warrantyAccess.permissions, registration: e.target.checked },
                            })
                          }
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Warranty Registration</span>
                          <span className="text-[10px] text-slate-500">Register new battery serials & customer bills</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/50 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={warrantyAccess.permissions.verification}
                          onChange={(e) =>
                            setWarrantyAccess({
                              ...warrantyAccess,
                              accessType: 'Custom',
                              permissions: { ...warrantyAccess.permissions, verification: e.target.checked },
                            })
                          }
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Warranty Verification</span>
                          <span className="text-[10px] text-slate-500">Validate active validity period & certificates</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/50 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={warrantyAccess.permissions.claim}
                          onChange={(e) =>
                            setWarrantyAccess({
                              ...warrantyAccess,
                              accessType: 'Custom',
                              permissions: { ...warrantyAccess.permissions, claim: e.target.checked },
                            })
                          }
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Warranty Claim Processing</span>
                          <span className="text-[10px] text-slate-500">Process replacement cell claims & field logs</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/50 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(warrantyAccess.permissions.claimApproval)}
                          onChange={(e) =>
                            setWarrantyAccess({
                              ...warrantyAccess,
                              accessType: 'Custom',
                              permissions: { ...warrantyAccess.permissions, claimApproval: e.target.checked },
                            })
                          }
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Claim Approval & Dispatch</span>
                          <span className="text-[10px] text-slate-500">Approve replacement authorizations & clearance</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/50 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={warrantyAccess.permissions.check}
                          onChange={(e) =>
                            setWarrantyAccess({
                              ...warrantyAccess,
                              accessType: 'Custom',
                              permissions: { ...warrantyAccess.permissions, check: e.target.checked },
                            })
                          }
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Warranty Check & Diagnostics</span>
                          <span className="text-[10px] text-slate-500">Look up barcode serial status & SoH logs</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/50 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={warrantyAccess.permissions.customerRecords}
                          onChange={(e) =>
                            setWarrantyAccess({
                              ...warrantyAccess,
                              accessType: 'Custom',
                              permissions: { ...warrantyAccess.permissions, customerRecords: e.target.checked },
                            })
                          }
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Customer Records Access</span>
                          <span className="text-[10px] text-slate-500">Access registered customer ownership history</span>
                        </div>
                      </label>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Warranty access is currently disabled for this staff member. Select an access tier above to grant privileges.
                  </p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  <span>{submitting ? 'Saving...' : isEditing ? 'Save Employee Changes' : 'Create Employee'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGNED TASK LIST DOSSIER MODAL */}
      {selectedEmployeeForTasks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Assigned Task List — {selectedEmployeeForTasks.name} ({selectedEmployeeForTasks.employeeId})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live service tickets, problem dossiers, and warranty work orders assigned to this engineer.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployeeForTasks(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
              {tasksLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                  <p className="text-xs font-semibold">Loading assigned tasks & tickets...</p>
                </div>
              ) : tasksData ? (
                <>
                  {/* KPI Summary Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Total Tasks</span>
                      <p className="text-2xl font-bold text-slate-800 mt-0.5">{tasksData.stats?.total || 0}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-amber-600 uppercase">Pending / New</span>
                      <p className="text-2xl font-bold text-amber-700 mt-0.5">{tasksData.stats?.pending || 0}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">In Progress</span>
                      <p className="text-2xl font-bold text-blue-700 mt-0.5">{tasksData.stats?.inProgress || 0}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Resolved</span>
                      <p className="text-2xl font-bold text-emerald-700 mt-0.5">{tasksData.stats?.resolved || 0}</p>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setTasksFilter('all')}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          tasksFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All ({tasksData.tasks?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTasksFilter('pending')}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          tasksFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Pending ({tasksData.stats?.pending || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTasksFilter('in_progress')}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          tasksFilter === 'in_progress' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        In Progress ({tasksData.stats?.inProgress || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTasksFilter('resolved')}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          tasksFilter === 'resolved' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Resolved ({tasksData.stats?.resolved || 0})
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Search ticket # or customer..."
                      value={tasksSearch}
                      onChange={(e) => setTasksSearch(e.target.value)}
                      className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs bg-white text-slate-800 w-full sm:w-64"
                    />
                  </div>

                  {/* Task Items Table */}
                  {(() => {
                    const filteredTasks = (tasksData.tasks || []).filter((t: any) => {
                      if (tasksFilter === 'pending' && !['New', 'Pending', 'Assigned'].includes(t.status)) return false;
                      if (tasksFilter === 'in_progress' && t.status !== 'In Progress') return false;
                      if (tasksFilter === 'resolved' && !['Resolved', 'Closed'].includes(t.status)) return false;
                      if (tasksSearch) {
                        const q = tasksSearch.toLowerCase();
                        const matchNum = t.ticketNumber?.toLowerCase().includes(q);
                        const matchCust = t.customer?.name?.toLowerCase().includes(q);
                        const matchMob = t.customer?.mobile?.toLowerCase().includes(q);
                        const matchDiv = t.division?.toLowerCase().includes(q);
                        if (!matchNum && !matchCust && !matchMob && !matchDiv) return false;
                      }
                      return true;
                    });

                    if (filteredTasks.length === 0) {
                      return (
                        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 space-y-2">
                          <CheckCircle2 size={36} className="text-slate-300 mx-auto" />
                          <h4 className="font-bold text-slate-700 text-sm">No Assigned Tasks Matching Filter</h4>
                          <p className="text-xs text-slate-400">All tasks in this status are clear or not assigned yet.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                              <th className="py-3 px-4">Ticket</th>
                              <th className="py-3 px-4">Customer</th>
                              <th className="py-3 px-4">Division</th>
                              <th className="py-3 px-4">Priority</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4">Assigned / Updated</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {filteredTasks.map((t: any) => (
                              <tr key={t._id} className="hover:bg-slate-50">
                                <td className="py-3 px-4">
                                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                    {t.ticketNumber}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <p className="font-bold text-slate-800">{t.customer?.name || 'Customer'}</p>
                                  <p className="text-[11px] text-slate-500">{t.customer?.mobile}</p>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-semibold text-slate-700">{t.division}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      t.priority === 'Urgent' || t.priority === 'High'
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {t.priority || 'Medium'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      ['Resolved', 'Closed'].includes(t.status)
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : t.status === 'In Progress'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {t.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-500 text-[11px]">
                                  {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div className="p-8 text-center text-slate-400">Failed to load task dossier.</div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 flex justify-end bg-white">
              <button
                type="button"
                onClick={() => setSelectedEmployeeForTasks(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Close Task Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATES QUICK VIEW MODAL */}
      {selectedEmployeeForCerts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Award className="text-amber-500" size={20} />
                <span>Technical Credentials & Badges</span>
              </h3>
              <button onClick={() => setSelectedEmployeeForCerts(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  {selectedEmployeeForCerts.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{selectedEmployeeForCerts.name}</h4>
                  <span className="font-mono text-xs text-green-700">{selectedEmployeeForCerts.employeeId}</span>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {selectedEmployeeForCerts.certificates && selectedEmployeeForCerts.certificates.length > 0 ? (
                  selectedEmployeeForCerts.certificates.map((cert, i) => (
                    <div key={i} className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-slate-800 text-xs">{cert.title}</h5>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {cert.verificationStatus || 'Verified'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Authority: <span className="font-semibold">{cert.issuingAuthority || 'Ekosmart Technical Academy'}</span>
                      </p>
                      <p className="text-[10px] text-slate-500">
                        ID: {cert.certificateNumber || 'EBS-01'} • Issued: {cert.issueDate || '2026'} • Valid: {cert.expiryDate || 'No Expiry'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">No certificates recorded.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedEmployeeForCerts(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EQUIPMENT & ASSETS GIVEN (GIVING) QUICK VIEW MODAL */}
      {selectedEmployeeForGivings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Package className="text-teal-600" size={20} />
                <span>Equipment & Assets Issued (Giving)</span>
              </h3>
              <button onClick={() => setSelectedEmployeeForGivings(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                  {selectedEmployeeForGivings.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{selectedEmployeeForGivings.name}</h4>
                  <span className="font-mono text-xs text-teal-700 font-semibold">{selectedEmployeeForGivings.employeeId}</span>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {selectedEmployeeForGivings.issuedItems && selectedEmployeeForGivings.issuedItems.length > 0 ? (
                  selectedEmployeeForGivings.issuedItems.map((item, i) => (
                    <div key={i} className="p-3 bg-teal-50/50 border border-teal-200 rounded-xl space-y-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-slate-800 text-xs">{item.name}</h5>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                          {item.status || 'Issued'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Category: <span className="font-semibold">{item.category || 'Asset'}</span> • Condition: <span className="font-semibold text-slate-700">{item.condition || 'Good'}</span>
                      </p>
                      <p className="text-[10px] text-slate-500">
                        SN: {item.serialNumber || 'N/A'} • Tag: {item.assetTag || 'N/A'} • Issued: {item.issueDate || '2026'} • Return: {item.returnDate || 'Returnable'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">No equipment or assets recorded.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedEmployeeForGivings(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ID Card Modal */}
      {selectedEmployeeForCard && (
        <IdCardModal employee={selectedEmployeeForCard} onClose={() => setSelectedEmployeeForCard(null)} />
      )}

      {/* Reset Password Modal */}
      {resetModalEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Key className="text-amber-500" size={18} />
                <span>Reset Password for {resetModalEmployee.name}</span>
              </h3>
              <button onClick={() => setResetModalEmployee(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (e.g. Pass@123)"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalEmployee(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingPassword}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {resettingPassword ? 'Updating...' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
