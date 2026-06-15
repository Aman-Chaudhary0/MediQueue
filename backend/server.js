import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";

const { default: connectDB } = await import("./src/db/db.js");
const { default: app } = await import("./src/app.js");

connectDB();

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });

const getTokenFromUrl = (url) => {
  try {
    const parsed = new URL(url, "http://localhost");
    return parsed.searchParams.get("token");
  } catch {
    return null;
  }
};

const getAccessUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.id || null;
  } catch {
    return null;
  }
};

const computeLiveQueuePlaceholder = () => ({ tick: true });

wss.on("connection", async (ws, req) => {
  try {
    const token = getTokenFromUrl(req.url);
    const userId = getAccessUserIdFromToken(token);

    if (!userId) {
      ws.close(1008, "Unauthorized");
      return;
    }

    ws._userId = userId;

    ws.on("message", async (raw) => {
      let msg;
      try {
        msg = JSON.parse(String(raw));
      } catch {
        return;
      }

      if (msg?.type !== "subscribeLiveQueue") return;
      if (ws._liveQueueTimer) return;

      ws._liveQueueTimer = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: "liveQueue:update", payload: computeLiveQueuePlaceholder() }));
        }
      }, 5000);
    });

    ws.on("close", () => {
      if (ws._liveQueueTimer) clearInterval(ws._liveQueueTimer);
    });

    ws.on("error", () => {
      if (ws._liveQueueTimer) clearInterval(ws._liveQueueTimer);
    });
  } catch {
    ws.close(1008, "Unauthorized");
  }
});

// Global safety nets — prevent process crash from unhandled rejections
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server running at ws://localhost:${PORT}/ws`);
});
