import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Participant } from "@/types/video-call";

type Types = {
  participants: Map<string, Participant>;
  currentUserId: null | string;
  //actions

  setCurrentUserId: (userId: string) => void;
  updateParticipant:(participantId:string,updates:Partial<Participant>)=>void
  addParticipant: (participant: Omit<Participant, "joinedAt">) => void;
  updateCurrentUserStream:(stream:MediaStream)=>void
};

const useParticipantsStore = create<Types>()(
  subscribeWithSelector((set, get) => ({
    currentUserId: null,
    participants: new Map(),
    setCurrentUserId: (userId: string) => set({ currentUserId: userId }),

    addParticipant: (participant) =>
      set((state) => {
        const newParticipants = new Map(state.participants);
        newParticipants.set(participant.id!, {
          id: participant.id,
          name: participant.name,
          isVideoOn: participant.isVideoOn ,
          isAudioOn: participant.isAudioOn,
          stream: participant.stream || null,
          joinedAt: new Date(),
          isLocal: participant.isLocal,
        });
        return { participants: newParticipants };
      }),

         updateParticipant: (participantId, updates) => set((state) => {
      const newParticipants = new Map(state.participants);
      const existing = newParticipants.get(participantId);
      if (existing) {
        newParticipants.set(participantId, { ...existing, ...updates });
      }
      return { participants: newParticipants };
    }),
    updateCurrentUserStream: (stream) => {
      const { currentUserId } = get();
      if (!currentUserId) return;

      get().updateParticipant(currentUserId, { stream });
    },
  }))
);

export default useParticipantsStore;
