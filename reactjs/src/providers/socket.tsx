import React, { createContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export interface CustomSockets {
  chatSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const SocketContext = createContext<null | CustomSockets>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode; userId: string | null }> = ({ children, userId }) => {
  console.log(userId)
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  useEffect(() => {
    if (userId) {
      const socket = io("http://localhost:3002", {
        query: { userId: userId },
      });

      setChatSocket(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [userId]);

  return (
    <SocketContext.Provider value={chatSocket ? { chatSocket } : null}>
      {children}
    </SocketContext.Provider>
  );
};
