import { create } from "zustand";
import { io, Socket } from "socket.io-client";
type Types = {
  isVideo: boolean;
  isAudio: boolean;
  socket: Socket | null;
  peerConnection: RTCPeerConnection | null;
  localStream: null | MediaStream;
  //actions

  toggleVideo: () => void;
  toggleAudio: () => void;
  setSocket: (socket: Socket) => void;
  setPeerConnection: (peer: RTCPeerConnection) => void;
  setLocalStream: (stream: MediaStream) => void;
};

const useZustand = create<Types>((set, get) => ({
  socket: null,
  peerConnection: null,
  isVideo: true,
  isAudio: true,
  localStream: null,

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
}));

export default useZustand;
