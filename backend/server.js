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

// Parse Bearer token from query string: ws://.../ws?token=...
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
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded?.id || null;
};

// Lazy queue computation by calling the existing REST logic
// Note: we reuse Appointment/Patient logic by re-fetching via REST endpoint on the client side later.
// For now, we will keep a backend-side poll by importing the controller directly would create tight coupling.
// So instead: we compute queue state by reusing the same logic via direct DB calls in a tiny helper
// that will call the controller code later if you want. For correctness now: trigger client to poll via fallback.
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

      // Start sending updates every 5 seconds
      if (ws._liveQueueTimer) return;

      ws._liveQueueTimer = setInterval(async () => {
        // We can’t call auth middleware from here, so we’ll use the same endpoint payload
        // by computing queue state using the existing controller import is the next step.
        // For now, send a ping to confirm subscription; the frontend will also be able to fallback.
        ws.send(
          JSON.stringify({
            type: "liveQueue:update",
            payload: computeLiveQueuePlaceholder(),
          })
        );
      }, 5000);
    });

    ws.on("close", () => {
      if (ws._liveQueueTimer) clearInterval(ws._liveQueueTimer);
    });
  } catch {
    ws.close(1008, "Unauthorized");
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("WebSocket server running at ws://localhost:3000/ws");
});
