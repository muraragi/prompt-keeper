<template>
  <div
    class="group relative flex h-full flex-col rounded-lg border bg-card p-5 shadow-md transition-all hover:shadow-lg"
    :class="{ 'border-primary': prompt.favorite }"
  >
    <!-- Favorite button -->
    <button
      @click="toggleFavorite"
      class="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-amber-500"
      :class="{ 'text-amber-500': prompt.favorite }"
    >
      <Star v-if="prompt.favorite" :size="18" fill="currentColor" />
      <Star v-else :size="18" />
    </button>

    <!-- Title -->
    <h3 class="mb-2 line-clamp-1 text-xl font-semibold">{{ prompt.title }}</h3>

    <!-- Tags -->
    <div class="mb-3 flex flex-wrap gap-2">
      <span
        v-for="tagId in prompt.tags"
        :key="tagId"
        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
        :style="{ backgroundColor: getTagColor(tagId), color: 'white' }"
      >
        {{ getTagName(tagId) }}
      </span>
    </div>

    <!-- Content -->
    <p class="mb-4 flex-grow text-muted-foreground">
      {{ truncateText(prompt.content, 120) }}
    </p>

    <!-- Footer -->
    <div class="mt-auto flex items-center justify-between">
      <span class="text-xs text-muted-foreground">{{ formatDate(prompt.updatedAt) }}</span>
      <div class="flex space-x-2">
        <button
          @click="$emit('edit', prompt.id)"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
        >
          <Pencil :size="16" />
        </button>
        <button
          @click="$emit('delete', prompt.id)"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star, Pencil, Trash2 } from 'lucide-vue-next'
import type { Prompt } from '@/lib/types'
import { formatDate, truncateText } from '@/lib/utils'
import { tags, updatePrompt } from '@/lib/store'

const props = defineProps<{
  prompt: Prompt
}>()

defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()

const getTagName = (tagId: string) => {
  const tag = tags.value.find((t) => t.id === tagId)
  return tag?.name || 'Unknown'
}

const getTagColor = (tagId: string) => {
  const tag = tags.value.find((t) => t.id === tagId)
  return tag?.color || '#888888'
}

const toggleFavorite = () => {
  updatePrompt(props.prompt.id, {
    favorite: !props.prompt.favorite,
  })
}
</script>
