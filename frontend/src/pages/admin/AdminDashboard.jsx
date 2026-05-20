import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import AdminDashNav from "../../components/adminComponents/AdminDashNav";
import DoctorsInfo from "../../components/adminComponents/DoctorsInfo";
import authService from "../../api/authService";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [errorDoctors, setErrorDoctors] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Fetch doctors with pagination and search
  const fetchDoctors = useCallback(
    async (pageNum = 1, isSearching = false) => {
      try {
        if (pageNum === 1) {
          setLoadingDoctors(true);
        } else {
          setIsLoadingMore(true);
        }
        setErrorDoctors("");

        const response = await authService.getAdminDoctors(pageNum, 10, searchQuery);
        const newDoctors = Array.isArray(response?.doctors) ? response.doctors : [];

        if (pageNum === 1) {
          setDoctors(newDoctors);
        } else {
          setDoctors((prev) => [...prev, ...newDoctors]);
        }

        // Check if there are more pages
        const totalPages = response?.pages || 1;
        setHasMore(pageNum < totalPages);
        setPage(pageNum);
      } catch (err) {
        if (pageNum === 1) {
          setErrorDoctors(err?.response?.data?.message || "Failed to load doctors");
          setDoctors([]);
        }
      } finally {
        setLoadingDoctors(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery]
  );

  // Initial load
  useEffect(() => {
    setPage(1);
    setDoctors([]);
    setHasMore(true);
    fetchDoctors(1, true);
  }, [searchQuery]);

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Reset pagination on new search
    setPage(1);
    setDoctors([]);
    setHasMore(true);
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loadingDoctors) {
          fetchDoctors(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadingDoctors, page, fetchDoctors]);

  const rows = useMemo(() => {
    return doctors.map((d) => ({
      id: d._id || d.id || "",
      name: d.user?.name || d.name || "Doctor",
      email: d.user?.email || d.email || "--",
      specialization: d.doctorProfile?.specialization || "--",
      department: d.doctorProfile?.department || "--",
      experience: d.doctorProfile?.experience || "--",
      status: d.status || "active",
      phone: d.mobileNo || d.phone || "--",
    }));
  }, [doctors]);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <AdminDashNav />

      <DoctorsInfo />

      <div className="mt-6 w-full rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 className="text-lg font-semibold text-gray-800">Doctors</h2>

          <div className="relative w-full sm:w-auto">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full sm:w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="hidden grid-cols-5 gap-4 rounded-t-xl bg-gray-50 px-6 py-3 text-left text-sm text-gray-500 lg:grid">
            <div className="font-medium">Doctor</div>
            <div className="font-medium">Specialty</div>
            <div className="font-medium">Department</div>
            <div className="font-medium">Experience</div>
            <div className="font-medium">Status</div>
          </div>

          {loadingDoctors && rows.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600">
              Loading doctors...
            </div>
          ) : errorDoctors ? (
            <div className="rounded-xl bg-red-50 p-6 text-center text-sm text-red-600">
              {errorDoctors}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600">
              No doctors found.
            </div>
          ) : (
            <div className="space-y-4 lg:space-y-0">
              {/* Mobile cards */}
              <div className="lg:hidden space-y-4">
                {rows.map((d) => (
                  <div key={d.id || d.email} className="rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{d.name}</p>
                        <p className="text-sm text-gray-500 truncate">{d.email}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {String(d.status)}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Specialty</p>
                        <p>{d.specialization}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Department</p>
                        <p>{d.department}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Experience</p>
                        <p>{d.experience}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop rows */}
              <div className="hidden lg:block">
                {rows.map((d) => (
                  <div
                    key={d.id || d.email}
                    className="grid grid-cols-5 gap-4 items-center border-b border-gray-100 py-4 px-6"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{d.name}</p>
                      <p className="text-sm text-gray-500 truncate">{d.email}</p>
                    </div>
                    <div className="text-gray-700">{d.specialization}</div>
                    <div className="text-gray-700">{d.department}</div>
                    <div className="text-gray-700">{d.experience}</div>
                    <div>
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {String(d.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Infinite scroll trigger */}
              {hasMore && rows.length > 0 && (
                <div ref={observerTarget} className="py-6 text-center">
                  {isLoadingMore && (
                    <div className="text-sm text-gray-600">
                      <div className="inline-block animate-spin">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-2">Loading more...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
