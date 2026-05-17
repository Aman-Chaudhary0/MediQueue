export const createLiveQueueSocket = ({ token = "", onTick, onError } = {}) => {
  const proto = window.location.protocol === "https:" ? "wss://" : "ws://";
  const wsUrl = `${proto}${window.location.host}/ws?token=${encodeURIComponent(token)}`;
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    try {
      ws.send(JSON.stringify({ type: "subscribeLiveQueue" }));
    } catch (e) {
      if (onError) onError(e);
    }
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg?.type === "liveQueue:update") {
        onTick?.(msg.payload);
      }
    } catch {
      // ignore malformed messages
    }
  };

  ws.onerror = (err) => {
    onError?.(err);
  };

  return {
    close: () => {
      try {
        ws.close();
      } catch {
        // ignore
      }
    },
  };
};
