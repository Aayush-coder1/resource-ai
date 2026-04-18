export interface NGORequest {
  id: string
  title: string
  type: "Food" | "Medical" | "Volunteers"
  location: string
  urgency: "High" | "Medium" | "Low"
  createdAt: Date
}

export interface Volunteer {
  id: string
  name: string
  skills: string[]
  location: string
  availability: "Available" | "Busy" | "Offline"
  registeredAt: Date
}

export interface AllocationResult {
  volunteer: string
  request: string
  priority: "High" | "Medium" | "Low"
  reason: string
  matchScore: number
}
