import { CircleSlash, Clock, Users } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import authService from "../../api/authService";

const REFRESH_MS = 5000;

const QueueSummary = () => {
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await authService.getLiveQueueStatus();
      setQueueStatus(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load queue summary");
      setQueueStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    const id = window.setInterval(fetch, REFRESH_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalInQueue = useMemo(() => {
    const list = queueStatus?.queue;
    if (!Array.isArray(list)) return null;
    return list.length;
  }, [queueStatus]);

  const avgWaitText = useMemo(() => {
    return queueStatus?.estimatedWaitingTime?.text || null;
  }, [queueStatus]);

  const queueStateText = useMemo(() => {
    if (loading) return "—";
    if (queueStatus?.live === false) return "No active queue";
    return queueStatus?.currentlyServing?.tokenNumber ? "Live" : "Normal";
  }, [queueStatus, loading]);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Queue Summary</h2>

      {error ? (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 text-center">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total in Queue */}
        <div className="flex items-center justify-between gap-4 bg-blue-100 p-4 rounded-xl">
          <div className="flex min-w-0 items-center gap-3">
            <Users className="text-blue-600 bg-gray-100 rounded-full h-10 w-10 p-2" />
            <p className="text-sm sm:text-base text-gray-600">Total in Queue</p>
          </div>
          <span className="shrink-0 font-bold text-xl sm:text-2xl text-gray-800">
            {loading ? "..." : totalInQueue ?? "—"}
          </span>
        </div>

        {/* Avg Wait Time */}
        <div className="flex items-center justify-between gap-4 bg-blue-100 p-4 rounded-xl">
          <div className="flex min-w-0 items-center gap-3">
            <Clock className="text-blue-600 bg-gray-100 rounded-full h-10 w-10 p-2" />
            <p className="text-sm sm:text-base text-gray-600">Avg Wait Time</p>
          </div>
          <span className="shrink-0 font-bold text-xl sm:text-2xl text-gray-800">
            {loading ? "..." : avgWaitText ?? "—"}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between gap-4 bg-blue-100 p-4 rounded-xl">
          <div className="flex min-w-0 items-center gap-3">
            <CircleSlash className="text-blue-600 bg-gray-100 rounded-full h-10 w-10 p-2" />
            <p className="text-sm sm:text-base text-gray-600">Queue Status</p>
          </div>
          <span className="shrink-0 font-bold text-xl sm:text-2xl text-gray-800">
            {queueStateText}
          </span>
        </div>
      </div>
    </section>
  );
};

export default QueueSummary;
