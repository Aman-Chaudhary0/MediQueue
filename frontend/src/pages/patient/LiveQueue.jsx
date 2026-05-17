import React, { useEffect, useMemo, useState } from "react";
import LiveQueueCard from "../../components/patientComponents/LiveQueueCard";
import QueueStatusCard from "../../components/patientComponents/QueueStatusCard";
import QueueSummary from "../../components/patientComponents/QueueSummary";
import LiveQueueNotification from "../../components/patientComponents/LiveQueueNotification";
import ImportantInstructions from "../../components/patientComponents/ImportantInstructions";
import authService from "../../api/authService";
import { createLiveQueueSocket } from "../../socket/liveQueueSocket";

const REFRESH_MS = 5000;

const getStatusStyle = (status) => {
  if (status === "In Progress") return "bg-blue-100 text-blue-700";
  if (status === "Completed") return "bg-green-100 text-green-700";
  return "bg-yellow-100 text-yellow-700";
};

const LiveQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await authService.getLiveQueueStatus();
      const nextQueue = Array.isArray(data?.queue) ? data.queue : [];
      setQueue(nextQueue);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load live queue");
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const id = window.setInterval(() => {
      // keep REST fallback to ensure functionality never decreases
      fetchStatus();
    }, REFRESH_MS);

    // WS tick is optional; if it fails, polling keeps it working.
    let socket = null;
    try {
      socket = createLiveQueueSocket({
        token: "",
        onTick: () => fetchStatus(),
        onError: () => {},
      });
    } catch {
      // ignore
    }

    return () => {
      window.clearInterval(id);
      socket?.close?.();
    };
  }, []);

  const rows = useMemo(() => {
    if (!queue?.length) return [];
    return queue;
  }, [queue]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Live Queue
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            See your position in the queue and stay updated instantly
          </p>
        </div>

        {/* Keep layout consistent; doctor selection is not used for live queue */}
        <div className="w-full lg:max-w-sm opacity-90">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Queue
          </label>
          <div className="w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-700">
            Auto-updating
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
        <LiveQueueCard />

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Queue Status</h2>
            <button className="w-fit bg-green-100 rounded px-4 py-1 text-green-600 font-bold text-sm">
              <span className="text-lg">•</span> Live
            </button>
          </div>

          <div className="hidden sm:grid grid-cols-3 font-medium text-gray-600 border-b pb-2">
            <div className="text-sm font-bold">Token No.</div>
            <div className="text-sm font-bold">Patient Name</div>
            <div className="text-sm font-bold">Status</div>
          </div>

          {error ? (
            <div className="py-6 text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          ) : loading ? (
            <div className="py-6 text-center text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded">
              Loading live queue...
            </div>
          ) : rows.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded">
              No queue data found yet.
            </div>
          ) : (
            rows.map((item, index) => (
              <QueueStatusCard
                key={item.tokenNumber || `${item.patientName}-${index}`}
                item={{
                  token: item.tokenNumber || "--",
                  name: item.patientName || "--",
                  status: item.status || "Waiting",
                }}
                index={index}
                getStatusStyle={getStatusStyle}
              />
            ))
          )}
        </div>
      </section>

      <QueueSummary />
      <LiveQueueNotification />
      <ImportantInstructions />
    </div>
  );
};

export default LiveQueue;
