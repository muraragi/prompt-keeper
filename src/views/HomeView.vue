<template>
  <div class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
    <header class="mb-8 flex flex-col gap-6">
      <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-3xl font-bold">Prompt Keeper</h1>
          <p class="text-muted-foreground">Your personal prompt collection</p>
        </div>
        <div class="flex space-x-2">
          <Button @click="openCreateDialog">
            <Plus class="mr-1.5 h-4 w-4" />
            New Prompt
          </Button>
          <Button variant="outline" @click="showTagManager = true">
            <Tags class="mr-1.5 h-4 w-4" />
            Manage Tags
          </Button>
        </div>
      </div>

      <!-- Use the PromptFilter component -->
      <PromptFilter
        :tags="tags"
        @update:search="updateSearch"
        @update:tags="updateTags"
        @update:favorites="updateFavorites"
      />
    </header>

    <!-- Prompts grid -->
    <div v-if="filteredPrompts.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <PromptCard
        v-for="prompt in filteredPrompts"
        :key="prompt.id"
        :prompt="prompt"
        @edit="openEditDialog"
        @delete="deletePrompt"
      />
    </div>
    <div v-else class="mt-8 rounded-lg border-2 border-dashed p-8 text-center">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <FilePenLine :size="24" class="text-muted-foreground" />
      </div>
      <h3 class="mt-4 text-lg font-medium">No prompts found</h3>
      <p class="mt-1 text-sm text-muted-foreground">
        {{
          prompts.length === 0
            ? 'Get started by creating a new prompt.'
            : 'Try changing your search or filters.'
        }}
      </p>
      <Button v-if="prompts.length === 0" @click="openCreateDialog" class="mt-4">
        <Plus class="mr-1.5 h-4 w-4" />
        Create Prompt
      </Button>
    </div>

    <!-- Create/Edit Prompt Dialog -->
    <Dialog :open="showCreateForm || !!editingPrompt" @update:open="closeForm">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ editingPrompt ? 'Edit Prompt' : 'Create New Prompt' }}</DialogTitle>
          <DialogDescription>
            {{
              editingPrompt
                ? 'Make changes to your prompt here.'
                : 'Add a new prompt to your collection.'
            }}
          </DialogDescription>
        </DialogHeader>
        <PromptForm
          :prompt="editingPrompt"
          @submit="handleFormSubmit"
          @cancel="closeForm"
          :key="editingPrompt?.id || 'create'"
        />
      </DialogContent>
    </Dialog>

    <!-- Tag Manager Dialog -->
    <Dialog :open="showTagManager" @update:open="closeTagManager">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Create, edit, or delete tags for organizing your prompts.
          </DialogDescription>
        </DialogHeader>
        <TagManager />
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Tags, FilePenLine } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import PromptCard from '@/components/PromptCard.vue'
import PromptForm from '@/components/PromptForm.vue'
import TagManager from '@/components/TagManager.vue'
import PromptFilter from '@/components/PromptFilter.vue'
import { prompts, tags, deletePrompt as removePrompt } from '@/lib/store'
import type { Prompt } from '@/lib/types'

const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const favoritesOnly = ref(false)
const showCreateForm = ref(false)
const showTagManager = ref(false)
const editingPrompt = ref<Prompt | undefined>(undefined)

const filteredPrompts = computed(() => {
  return prompts.value.filter((prompt) => {
    // Filter by search text
    const textMatch =
      !searchQuery.value ||
      prompt.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Filter by selected tags
    const tagMatch =
      selectedTags.value.length === 0 ||
      selectedTags.value.some((tagId) => prompt.tags.includes(tagId))

    // Filter by favorites
    const favoriteMatch = !favoritesOnly.value || prompt.favorite

    return textMatch && tagMatch && favoriteMatch
  })
})

const updateSearch = (value: string) => {
  searchQuery.value = value
}

const updateTags = (value: string[]) => {
  console.log(value)
  selectedTags.value = value
}

const updateFavorites = (value: boolean) => {
  favoritesOnly.value = value
}

const openEditDialog = (id: string) => {
  const prompt = prompts.value.find((p) => p.id === id)
  if (prompt) {
    editingPrompt.value = { ...prompt }
  }
}

const deletePrompt = (id: string) => {
  if (confirm('Are you sure you want to delete this prompt?')) {
    removePrompt(id)
  }
}

const closeForm = () => {
  showCreateForm.value = false
  editingPrompt.value = undefined
}

const handleFormSubmit = () => {
  closeForm()
}

const openCreateDialog = () => {
  editingPrompt.value = undefined
  showCreateForm.value = true
}

const closeTagManager = () => {
  showTagManager.value = false
}
</script>
