import { useEffect } from "react";
import { io } from "socket.io-client";

export default function LiveDashboard() {
  useEffect(() => {
    const socket = io("http://localhost:3001", {
      path: "/api/socket",
      transports: ["websocket"], // WebSocket only
    });

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO:", socket.id);
    });

    socket.on("ot_update", (data) => {
      console.log("🔄 OT Update received:", data);
      // here you can call a callback to update dashboard state
    });

    return () => socket.disconnect();
  }, []);

  return <div>Live Dashboard</div>;
}
