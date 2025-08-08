export interface Participant {
  id: string
  name: string
  isLocal: boolean
  isMuted: boolean
  isVideoOn: boolean
  initials: string
  stream:MediaStream
  // color: string
}
