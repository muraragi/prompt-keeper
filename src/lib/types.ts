export interface Tag {
  id: string
  name: string
  color: string
}

export interface Prompt {
  id: string
  title: string
  content: string
  tags: string[] // Tag IDs
  createdAt: string
  updatedAt: string
  favorite: boolean
}
