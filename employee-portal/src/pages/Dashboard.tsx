import { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle, UserCheck, Loader2, QrCode, Eye } from 'lucide-react';
import { empAuthApi, resolveImageUrl } from '../api/client';

import { useAuth } from '../context/AuthContext';
import { IdCardModal } from '../components/IdCardModal';
import { TicketDetailModal } from '../components/TicketDetailModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIdCard, setShowIdCard] = useState(false);
  const [selectedTicketIdOrNumber, setSelectedTicketIdOrNumber] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const empId = user?.employeeId || 'TEST-EMP-001';
      const res = await empAuthApi.getDashboard(empId);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load employee dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin text-indigo-600 mb-3" size={36} />
        <p className="text-sm font-medium">Loading your assignments...</p>
      </div>
    );
  }

  const employee = data?.employee || user;
  const stats = data?.stats || { assignedComplaints: 0, pendingComplaints: 0, inProgressComplaints: 0, resolvedComplaints: 0 };
  const recent = data?.recentAssignments || [];

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 border-l-4 border-indigo-600">
        <div className="flex items-center gap-4">
          {employee?.photoUrl ? (
            <img
              src={resolveImageUrl(employee.photoUrl)}
              alt={employee.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow"
            />
          ) : (

            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xl flex items-center justify-center border-2 border-indigo-500">
              {employee?.name?.slice(0, 2).toUpperCase() || 'EM'}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-800">{employee?.name}</h1>
            <p className="text-xs text-slate-500 font-medium">{employee?.designation} • {employee?.department}</p>
            <div className="flex gap-1.5 mt-2">
              {employee?.division?.map((div: string) => (
                <span key={div} className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-200">
                  {div}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-200 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Employee ID</span>
            <span className="font-mono font-bold text-indigo-700 text-sm">{employee?.employeeId}</span>
          </div>

          <button
            onClick={() => setShowIdCard(true)}
            className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            title="View & Download Official ID Badge"
          >
            <QrCode size={18} />
            <span className="hidden sm:inline">My ID Badge</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 border-t-4 border-t-indigo-500">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Assigned Tickets</h3>
            <p className="text-3xl font-bold text-slate-800">{stats.assignedComplaints}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 border-t-4 border-t-amber-500">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">In Progress</h3>
            <p className="text-3xl font-bold text-slate-800">{stats.inProgressComplaints}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 border-t-4 border-t-emerald-500">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Resolved</h3>
            <p className="text-3xl font-bold text-slate-800">{stats.resolvedComplaints}</p>
          </div>
        </div>
      </div>

      {/* Recent Assignments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Assigned Service Tickets</h2>
        {recent.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <UserCheck size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No service tickets currently assigned to you.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Division</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned On</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((c: any) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedTicketIdOrNumber(c.ticketNumber)}
                        className="font-mono font-bold text-indigo-600 hover:text-indigo-800 hover:underline text-xs cursor-pointer flex items-center gap-1"
                        title="Click to view full problem dossier & update progress"
                      >
                        <span>{c.ticketNumber}</span>
                        <Eye size={12} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-800">{c.customer?.name} ({c.customer?.mobile})</td>
                    <td className="py-3 px-4 text-xs font-bold text-slate-700">{c.division}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">{new Date(c.updatedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicketIdOrNumber(c.ticketNumber)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Inspect & Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ID Card Modal */}
      {showIdCard && (
        <IdCardModal
          employee={employee}
          onClose={() => setShowIdCard(false)}
        />
      )}

      {/* Ticket Dossier & Update Modal */}
      {selectedTicketIdOrNumber && (
        <TicketDetailModal
          ticketIdOrNumber={selectedTicketIdOrNumber}
          onClose={() => setSelectedTicketIdOrNumber(null)}
          onUpdated={fetchDashboard}
        />
      )}
    </div>
  );
};

export default Dashboard;
