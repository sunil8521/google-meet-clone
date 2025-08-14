export interface Participant {
  id?: string;
  name?: string;
  isLocal?: boolean;
  isAudioOn?: boolean;
  isVideoOn?: boolean;
  stream?: MediaStream|null;
  color?: string;
  joinedAt: Date;
}
