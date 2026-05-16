import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import ManageDocNav from "../../components/adminComponents/ManageDocNav";
import ManageDocInfo from "../../components/adminComponents/ManageDocInfo";
import DoctorInfoCard from "../../components/adminComponents/DoctorInfoCard";
import AddDoctorForm from "../../components/adminComponents/AddDoctorForm";
import authService from "../../api/authService";

const ManageDoctors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingDoctorId, setDeletingDoctorId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authService.getAdminDoctors();
      const list = Array.isArray(response?.doctors) ? response.doctors : response?.doctors ?? [];
      setDoctors(list);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleAddDoctorSuccess = () => {
    setIsModalOpen(false);
    fetchDoctors();
  };

  const handleDeleteRequest = useCallback((doctorId) => {
    setDeleteError("");
    setDeletingDoctorId(doctorId);
  }, []);

  const handleDeleteAbort = useCallback(() => {
    setDeleteError("");
    setDeletingDoctorId(null);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (doctorId) => {
      try {
        setDeleteError("");
        setDeletingDoctorId(doctorId);
        await authService.deleteUser(doctorId);
        setDeletingDoctorId(null);
        await fetchDoctors();
      } catch (err) {
        setDeleteError(err?.response?.data?.message || "Failed to delete doctor");
      }
    },
    [fetchDoctors]
  );

  const cards = useMemo(() => {
    return doctors.map((d) => {
      const statusRaw = d.status ?? d.user?.status ?? "active";
      return {
        ...d,
        id: d._id,
        name: d.user?.name || d.name,
        email: d.user?.email || d.email,
        phone: d.mobileNo || d.phone,
        status:
          String(statusRaw).toLowerCase() === "on-leave" || String(statusRaw).toLowerCase() === "on leave"
            ? "On Leave"
            : String(statusRaw).toLowerCase() === "inactive"
              ? "Inactive"
              : "Active",
        image: d.profilePic || d.image || "https://via.placeholder.com/100",
      };
    });
  }, [doctors]);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <ManageDocNav />

      <AddDoctorForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddDoctorSuccess}
      />

      <ManageDocInfo />

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or speciality..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          Add Doctor
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 text-center">
          {error}
        </div>
      ) : null}

      {deleteError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 text-center">
          {deleteError}
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-275">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                <th className="pb-4 font-semibold">Doctor</th>
                <th className="pb-4 font-semibold">Specialty</th>
                <th className="pb-4 font-semibold">Department</th>
                <th className="pb-4 font-semibold">Experience</th>
                <th className="pb-4 font-semibold">Contact</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-sm text-gray-600">
                    Loading doctors...
                  </td>
                </tr>
              ) : (
                cards.map((doctor) => (
                  <DoctorInfoCard
                    key={doctor.id}
                    doctor={doctor}
                    isTableRow={true}
                    isConfirmingDelete={deletingDoctorId === doctor.id}
                    onRequestDelete={() => handleDeleteRequest(doctor.id)}
                    onConfirmDelete={() => handleDeleteConfirm(doctor.id)}
                    onAbortDelete={handleDeleteAbort}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 lg:hidden">
          {loading ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600">
              Loading doctors...
            </div>
          ) : (
            cards.map((doctor) => (
              <DoctorInfoCard
                key={doctor.id}
                doctor={doctor}
                index={doctor.id}
                isTableRow={false}
                isConfirmingDelete={deletingDoctorId === doctor.id}
                onRequestDelete={() => handleDeleteRequest(doctor.id)}
                onConfirmDelete={() => handleDeleteConfirm(doctor.id)}
                onAbortDelete={handleDeleteAbort}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;
