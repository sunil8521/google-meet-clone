// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";
export const socket: Socket = io(URL, {});

export const webRtc=new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:64.227.129.105:3478",
          username: "sunil",
          credential: "yourpassword123",
        },
      ],
    });

// webRtc.
