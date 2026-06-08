import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Search, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ManageDocNav from "../../components/adminComponents/ManageDocNav";
import ManageDocInfo from "../../components/adminComponents/ManageDocInfo";
import DoctorInfoCard from "../../components/adminComponents/DoctorInfoCard";
import AddDoctorForm from "../../components/adminComponents/AddDoctorForm";
import authService from "../../api/authService";

const ManageDoctors = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const searchTimeoutRef = useRef(null);

  const [deletingDoctorId, setDeletingDoctorId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [workflowLoadingId, setWorkflowLoadingId] = useState(null);
  const [workflowError, setWorkflowError] = useState("");
  const [workflowSuccess, setWorkflowSuccess] = useState("");

  const fetchDoctors = useCallback(
    async (pageNum = 1) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setError("");

        const response = await authService.getAdminDoctors(pageNum, 10, searchQuery);
        const newDoctors = Array.isArray(response?.doctors) ? response.doctors : [];

        if (pageNum === 1) {
          setDoctors(newDoctors);
        } else {
          setDoctors((prev) => [...prev, ...newDoctors]);
        }

        const totalPages = response?.pages || 1;
        setHasMore(pageNum < totalPages);
        setPage(pageNum);
      } catch (err) {
        if (pageNum === 1) {
          setError(err?.response?.data?.message || "Failed to load doctors");
          setDoctors([]);
        }
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    setPage(1);
    setDoctors([]);
    setHasMore(true);
    fetchDoctors(1);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setPage(1);
    setDoctors([]);
    setHasMore(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loading) {
          fetchDoctors(page + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loading, page, fetchDoctors]);

  const handleAddDoctorSuccess = () => {
    setIsModalOpen(false);
    setPage(1);
    setSearchQuery("");
    setDoctors([]);
    fetchDoctors(1);
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
        setPage(1);
        setSearchQuery("");
        setDoctors([]);
        await fetchDoctors(1);
      } catch (err) {
        setDeleteError(err?.response?.data?.message || "Failed to delete doctor");
      }
    },
    [fetchDoctors]
  );

  const handleWorkflowAction = useCallback(
    async (doctorProfileId, action) => {
      if (!doctorProfileId) return;
      try {
        setWorkflowLoadingId(doctorProfileId);
        setWorkflowError("");
        setWorkflowSuccess("");
        const response = await authService.updateDoctorApprovalStatus(doctorProfileId, action);
        setWorkflowSuccess(response?.message || "Doctor status updated");
        setPage(1);
        setDoctors([]);
        await fetchDoctors(1);
      } catch (err) {
        setWorkflowError(err?.response?.data?.message || "Failed to update doctor status");
      } finally {
        setWorkflowLoadingId(null);
      }
    },
    [fetchDoctors]
  );

  const cards = useMemo(() => {
    return doctors.map((d) => {
      const statusRaw = d.doctorProfile?.status ?? d.status ?? "active";
      return {
        ...d,
        id: d._id,
        doctorProfileId: d.doctorProfile?._id,
        verificationStatus: d.doctorProfile?.verificationStatus ?? "approved",
        name: d.user?.name || d.name,
        email: d.user?.email || d.email,
        phone: d.mobileNo || d.phone,
        specialty: d.doctorProfile?.specialization || "—",
        department: d.doctorProfile?.department || "—",
        experience: d.doctorProfile?.experience || "—",
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
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>

      <ManageDocNav />

      <AddDoctorForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddDoctorSuccess}
      />

      <ManageDocInfo />

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or speciality..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {workflowError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 text-center">
          {workflowError}
        </div>
      ) : null}

      {workflowSuccess ? (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 text-center">
          {workflowSuccess}
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
              {loading && cards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-sm text-gray-600">
                    Loading doctors...
                  </td>
                </tr>
              ) : cards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-sm text-gray-600">
                    No doctors found
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
                    onWorkflowAction={handleWorkflowAction}
                    actionLoading={workflowLoadingId === doctor.doctorProfileId}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 lg:hidden">
          {loading && cards.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600">
              Loading doctors...
            </div>
          ) : cards.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600">
              No doctors found
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
                onWorkflowAction={handleWorkflowAction}
                actionLoading={workflowLoadingId === doctor.doctorProfileId}
              />
            ))
          )}
        </div>

        {hasMore && cards.length > 0 && (
          <div ref={observerTarget} className="py-6 text-center">
            {isLoadingMore && (
              <div className="text-sm text-gray-600">
                <div className="inline-block animate-spin">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <span className="ml-2">Loading more...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDoctors;
