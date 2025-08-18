import { create } from "zustand";
import { Socket } from "socket.io-client";
type Types = {
  isVideo: boolean;
  isAudio: boolean;
  socket: Socket | null;
  peerConnection: RTCPeerConnection | null;
  localStream: null | MediaStream;
  loading: boolean;
  rtcDatachannel: RTCDataChannel | null;

  //actions

  toggleVideo: () => void;
  setLoading: (val: boolean) => void;
  toggleAudio: () => void;
  setSocket: (socket: Socket) => void;
  setPeerConnection: (peer: RTCPeerConnection) => void;
  setLocalStream: (stream: MediaStream) => void;
  resetPeerConnection: () => void;
  setRtcDatachannel: (data: RTCDataChannel) => void;
};

const useZustand = create<Types>((set, get) => ({
  socket: null,
  peerConnection: new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:64.227.129.105:3478",
        username: "sunil",
        credential: "yourpassword123",
      },
    ],
  }),
  isVideo: true,
  isAudio: true,
  localStream: null,
  loading: false,
  rtcDatachannel: null,

  setLoading: (val: boolean) => {
    set({ loading: val });
  },
  setSocket: (socket) => set({ socket }),
  setPeerConnection: (peer) => set({ peerConnection: peer }),
  toggleVideo: () => {
    const { localStream, isVideo } = get();
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideo;
        set((state) => ({ isVideo: !state.isVideo }));
      }
    }
  },
  toggleAudio: () => {
    const { localStream, isAudio } = get();
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudio;
        set((state) => ({ isAudio: !state.isAudio }));
      }
    }
  },
  setLocalStream: (stream: MediaStream) => {
    set({ localStream: stream });
  },
  resetPeerConnection: () =>
    set({
      peerConnection: new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      }),
    }),
  setRtcDatachannel: (data) => {
    set({ rtcDatachannel: data });
  },
}));

export default useZustand;
