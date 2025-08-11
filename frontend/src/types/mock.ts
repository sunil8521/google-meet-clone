// import type { Participant } from "@/types/video-call"

// const names = [
//   "John Smith",
//   "Emma Johnson",
//   "Michael Brown",
//   "Olivia Davis",
//   "William Wilson",
//   "Sophia Martinez",
//   "James Anderson",
//   "Isabella Taylor",
//   "Robert Thomas",
//   "Mia Garcia",
// ]

const colors = [
  "#4f46e5", // indigo
  "#0891b2", // cyan
  "#7c3aed", // violet
  "#0d9488", // teal
  "#c026d3", // fuchsia
  "#ea580c", // orange
  "#0369a1", // sky
  "#4d7c0f", // lime
  "#9333ea", // purple
  "#be123c", // rose
  "#dc2626", // red
  "#059669", // emerald
  "#7c2d12", // amber
  "#1d4ed8", // blue
  "#991b1b", // red-800
  "#065f46", // emerald-800
  "#92400e", // amber-700
  "#1e40af", // blue-700
  "#581c87", // purple-800
  "#be185d", // pink-600
]

// export function generateParticipants(count: number): Participant[] {
//   const participants: Participant[] = []

//   for (let i = 0; i < count; i++) {
//     const name = names[i % names.length]
//     const nameParts = name.split(" ")
//     const initials = nameParts.map((part) => part[0]).join("")

//     participants.push({
//       id: `participant-${i + 1}`,
//       name,
//       isLocal: false,
//       isMuted: Math.random() > 0.7,
//       isVideoOn: Math.random() > 0.3,
//       initials,
//       color: colors[i % colors.length],
//     })
//   }

//   return participants
// }

export function getColor():string{
  return colors[Math.floor(Math.random() * colors.length)]
}

