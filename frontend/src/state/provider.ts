import { create } from "zustand";
import { io, Socket } from "socket.io-client";
type Types = {
  isVideo: boolean;
  isAudio: boolean;
  socket: Socket | null;
  peerConnection: RTCPeerConnection | null;
  localStream: null | MediaStream;
  participants: Map<
    string,
    {
      id: string;
      name: string;
      isVideoOn: boolean;
      isAudioOn: boolean;
      stream: MediaStream;
      joinedAt: string;
    }
  >;
  currentUserId: null | string;
  //actions

  toggleVideo: () => void;
  toggleAudio: () => void;
  setSocket: (socket: Socket) => void;
  setPeerConnection: (peer: RTCPeerConnection) => void;
  setLocalStream: (stream: MediaStream) => void;
  setCurrentUserId:(userId:string)=>void
  addParticipant:(participant:any)=>void
};

const useZustand = create<Types>((set, get) => ({
  socket: null,
  peerConnection: null,
  isVideo: true,
  isAudio: true,
  localStream: null,
  currentUserId: null,
  participants: new Map(),

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

    setCurrentUserId: (userId:string) => set({ currentUserId: userId }),

 addParticipant: (participant) => set((state) => {
      const newParticipants = new Map(state.participants);
      newParticipants.set(participant.id, {
        id: participant.id,
        name: participant.name,
        isVideoOn: participant.isVideoOn ?? true,
        isAudioOn: participant.isAudioOn ?? true,
        stream: participant.stream || null,
        joinedAt: new Date(),
        ...participant
      });
      return { participants: newParticipants };
    }),
}));

export default useZustand;
