import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Prompt, Tag } from './types'

// Local storage keys
const PROMPTS_STORAGE_KEY = 'prompt-keeper-prompts'
const TAGS_STORAGE_KEY = 'prompt-keeper-tags'

// Default tags
const defaultTags: Tag[] = [
  { id: uuidv4(), name: 'Work', color: '#22c55e' }, // Green
  { id: uuidv4(), name: 'Personal', color: '#3b82f6' }, // Blue
  { id: uuidv4(), name: 'Important', color: '#ef4444' }, // Red
]

// Load data from localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key)
    return storedData ? JSON.parse(storedData) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

// Save data to localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Initialize store
export const prompts = ref<Prompt[]>(loadFromStorage(PROMPTS_STORAGE_KEY, []))
export const tags = ref<Tag[]>(loadFromStorage(TAGS_STORAGE_KEY, defaultTags))

// Save changes to localStorage whenever data changes
export const savePrompts = () => saveToStorage(PROMPTS_STORAGE_KEY, prompts.value)
export const saveTags = () => saveToStorage(TAGS_STORAGE_KEY, tags.value)

// Computed getters
export const getTagById = (id: string) => computed(() => tags.value.find((tag) => tag.id === id))
export const getPromptById = (id: string) =>
  computed(() => prompts.value.find((prompt) => prompt.id === id))

// Actions
export const addPrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString()
  const newPrompt: Prompt = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    ...promptData,
  }
  prompts.value.push(newPrompt)
  savePrompts()
  return newPrompt
}

export const updatePrompt = (id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => {
  const index = prompts.value.findIndex((p) => p.id === id)
  if (index !== -1) {
    prompts.value[index] = {
      ...prompts.value[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    savePrompts()
    return prompts.value[index]
  }
  return null
}

export const deletePrompt = (id: string) => {
  const index = prompts.value.findIndex((p) => p.id === id)
  if (index !== -1) {
    prompts.value.splice(index, 1)
    savePrompts()
    return true
  }
  return false
}

export const addTag = (tagData: Omit<Tag, 'id'>) => {
  const newTag: Tag = {
    id: uuidv4(),
    ...tagData,
  }
  tags.value.push(newTag)
  saveTags()
  return newTag
}

export const updateTag = (id: string, updates: Partial<Omit<Tag, 'id'>>) => {
  const index = tags.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    tags.value[index] = {
      ...tags.value[index],
      ...updates,
    }
    saveTags()
    return tags.value[index]
  }
  return null
}

export const deleteTag = (id: string) => {
  const index = tags.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    // Remove tag from all prompts that have it
    prompts.value.forEach((prompt) => {
      if (prompt.tags.includes(id)) {
        prompt.tags = prompt.tags.filter((tagId) => tagId !== id)
      }
    })
    tags.value.splice(index, 1)
    saveTags()
    savePrompts()
    return true
  }
  return false
}

// Filter functions
export const filterPrompts = (
  searchText = '',
  selectedTags: string[] = [],
  favoritesOnly = false,
) => {
  return computed(() => {
    return prompts.value.filter((prompt) => {
      // Filter by search text
      const textMatch =
        !searchText ||
        prompt.title.toLowerCase().includes(searchText.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchText.toLowerCase())

      // Filter by selected tags
      const tagMatch =
        selectedTags.length === 0 || selectedTags.some((tagId) => prompt.tags.includes(tagId))

      // Filter by favorites
      const favoriteMatch = !favoritesOnly || prompt.favorite

      return textMatch && tagMatch && favoriteMatch
    })
  })
}
