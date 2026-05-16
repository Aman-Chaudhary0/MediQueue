import { Megaphone } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { assets } from "../../assets/assets";
import authService from "../../api/authService";

const REFRESH_MS = 5000;

const LiveQueueCard = () => {
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await authService.getLiveQueueStatus();
      setQueue(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load live queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const id = window.setInterval(fetchStatus, REFRESH_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const yourToken = useMemo(() => queue?.yourTokenNumber || "--", [queue]);
  const yourPosition = useMemo(() => queue?.yourPosition ?? null, [queue]);
  const aheadCountText = useMemo(() => {
    if (queue?.aheadCount === null || queue?.aheadCount === undefined) return "—";
    return String(queue.aheadCount);
  }, [queue]);

  const waitingText = useMemo(() => queue?.estimatedWaitingTime?.text || "-- mins", [queue]);

  return (
    <div className="lg:col-span-1 bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="w-full h-40 sm:h-48">
        <img
          src={assets.live_queue}
          alt="Live queue"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 text-center divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-4">
          <p className="text-sm sm:text-base text-gray-500">Your Token</p>
          <h2 className="text-3xl sm:text-4xl py-2 font-semibold text-blue-600">
            {loading ? "..." : yourToken}
          </h2>
          <p className="mx-auto w-full max-w-35 rounded bg-blue-200 py-2 text-center text-sm font-semibold text-blue-600">
            You
          </p>
        </div>

        <div className="p-4">
          <p className="text-sm sm:text-base text-gray-500">Your Position</p>
          <h2 className="text-3xl sm:text-4xl py-2 font-semibold">
            {loading ? "..." : yourPosition ?? "—"}
          </h2>
          <p className="text-sm text-gray-500">People ahead: {loading ? "..." : aheadCountText}</p>
        </div>

        <div className="p-4">
          <p className="text-sm sm:text-base text-gray-500">Est. Wait</p>
          <h2 className="text-lg sm:text-xl py-2 font-semibold text-green-600">
            {loading ? "..." : waitingText}
          </h2>
          <p className="text-sm text-gray-500">Approx</p>
        </div>
      </div>

      {error ? (
        <div className="px-4 py-3 bg-red-50 border-t border-red-200 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex px-4 py-5 sm:py-6 bg-blue-100 items-start sm:items-center gap-2">
        <Megaphone className="text-blue-600 w-5 h-5 shrink-0" />
        <p className="text-sm text-gray-500">You will get notified when it's your turn.</p>
      </div>
    </div>
  );
};

export default LiveQueueCard;
