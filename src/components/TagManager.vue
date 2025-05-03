<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-medium">Manage Tags</h2>
      <button
        @click="showForm = !showForm"
        class="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
      >
        <Plus v-if="!showForm" class="mr-1" :size="16" />
        <X v-else class="mr-1" :size="16" />
        {{ showForm ? 'Cancel' : 'Add Tag' }}
      </button>
    </div>

    <!-- Tag form -->
    <div v-if="showForm" class="rounded-md border bg-card p-4">
      <div class="mb-4 space-y-2">
        <label for="name" class="text-sm font-medium">Tag Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="w-full rounded-md border bg-background px-3 py-2"
          placeholder="Enter tag name"
        />
      </div>
      <div class="mb-4 space-y-2">
        <label class="text-sm font-medium">Color</label>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="color in colors"
            :key="color"
            @click="form.color = color"
            class="h-6 w-6 cursor-pointer rounded-full"
            :class="form.color === color ? 'ring-2 ring-ring ring-offset-2' : ''"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
      </div>
      <div class="flex justify-end">
        <button
          @click="handleSubmit"
          class="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        >
          {{ editingTagId ? 'Update' : 'Add' }} Tag
        </button>
      </div>
    </div>

    <!-- Tag list -->
    <div class="rounded-md border bg-card">
      <div v-if="tags.length === 0" class="p-4 text-center text-muted-foreground">
        No tags created yet
      </div>
      <div v-else class="divide-y divide-border overflow-y-auto max-h-72">
        <div v-for="tag in tags" :key="tag.id" class="flex items-center justify-between p-3">
          <div class="flex items-center space-x-2">
            <div
              class="h-4 w-4 rounded-full flex-shrink-0"
              :style="{ backgroundColor: tag.color }"
            ></div>
            <span class="truncate">{{ tag.name }}</span>
          </div>
          <div class="flex space-x-1 flex-shrink-0">
            <button
              @click="editTag(tag)"
              class="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Edit tag"
            >
              <Pencil :size="16" />
            </button>
            <button
              @click="deleteTag(tag.id)"
              class="rounded-md p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
              aria-label="Delete tag"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, X, Pencil, Trash2 } from 'lucide-vue-next'
import { tags, addTag, updateTag, deleteTag as removeTag } from '@/lib/store'

const showForm = ref(false)
const editingTagId = ref<string | null>(null)

const form = reactive({
  name: '',
  color: '#3b82f6',
})

const colors = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#10b981', // Emerald
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
]

const resetForm = () => {
  form.name = ''
  form.color = '#3b82f6'
  editingTagId.value = null
  showForm.value = false
}

const editTag = (tag: { id: string; name: string; color: string }) => {
  form.name = tag.name
  form.color = tag.color
  editingTagId.value = tag.id
  showForm.value = true
}

const deleteTag = (id: string) => {
  if (confirm('Are you sure you want to delete this tag? It will be removed from all prompts.')) {
    removeTag(id)
  }
}

const handleSubmit = () => {
  if (!form.name.trim()) {
    return
  }

  if (editingTagId.value) {
    updateTag(editingTagId.value, {
      name: form.name.trim(),
      color: form.color,
    })
  } else {
    addTag({
      name: form.name.trim(),
      color: form.color,
    })
  }

  resetForm()
}
</script>
