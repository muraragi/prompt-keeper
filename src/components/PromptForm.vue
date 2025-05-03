<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-2">
      <label for="title" class="text-sm font-medium">Title</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        class="w-full rounded-md border bg-background px-3 py-2"
        placeholder="Prompt title"
        required
      />
    </div>

    <div class="space-y-2">
      <label for="content" class="text-sm font-medium">Content</label>
      <textarea
        id="content"
        v-model="form.content"
        class="h-40 w-full rounded-md border bg-background px-3 py-2"
        placeholder="Write your prompt here..."
        required
      ></textarea>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Tags</label>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="tag in tags"
          :key="tag.id"
          @click="toggleTag(tag.id)"
          class="cursor-pointer rounded-full px-3 py-1 text-sm"
          :class="form.tags.includes(tag.id) ? 'text-white' : 'text-foreground bg-muted'"
          :style="form.tags.includes(tag.id) ? { backgroundColor: tag.color } : {}"
        >
          {{ tag.name }}
        </div>
        <div
          @click="showTagForm = true"
          class="cursor-pointer rounded-full border border-dashed border-muted-foreground px-3 py-1 text-sm text-muted-foreground hover:bg-muted"
        >
          + Add Tag
        </div>
      </div>
    </div>

    <div v-if="showTagForm" class="rounded-md border bg-card p-4">
      <div class="mb-4 space-y-2">
        <label for="tagName" class="text-sm font-medium">Tag Name</label>
        <input
          id="tagName"
          v-model="newTag.name"
          type="text"
          class="w-full rounded-md border bg-background px-3 py-1.5"
          placeholder="Enter tag name"
          required
        />
      </div>
      <div class="mb-4 space-y-2">
        <label class="text-sm font-medium">Color</label>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="color in colors"
            :key="color"
            @click="newTag.color = color"
            class="h-6 w-6 cursor-pointer rounded-full"
            :class="newTag.color === color ? 'ring-2 ring-ring ring-offset-2' : ''"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <button
          type="button"
          @click="showTagForm = false"
          class="rounded-md border px-3 py-1.5 text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="createTag"
          class="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        >
          Add
        </button>
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-2">
      <button type="button" @click="$emit('cancel')" class="rounded-md border px-4 py-2 text-sm">
        Cancel
      </button>
      <button type="submit" class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
        {{ props.prompt ? 'Update' : 'Create' }} Prompt
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Prompt } from '@/lib/types'
import { addPrompt, updatePrompt, tags, addTag } from '@/lib/store'

const props = defineProps<{
  prompt?: Prompt
}>()

const emit = defineEmits<{
  (e: 'submit', prompt: Prompt): void
  (e: 'cancel'): void
}>()

const form = reactive({
  title: '',
  content: '',
  tags: [] as string[],
  favorite: false,
})

const showTagForm = ref(false)
const newTag = reactive({
  name: '',
  color: '#3b82f6',
})

const colors = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
]

onMounted(() => {
  if (props.prompt) {
    form.title = props.prompt.title
    form.content = props.prompt.content
    form.tags = [...props.prompt.tags]
    form.favorite = props.prompt.favorite
  }
})

const toggleTag = (tagId: string) => {
  const index = form.tags.indexOf(tagId)
  if (index === -1) {
    form.tags.push(tagId)
  } else {
    form.tags.splice(index, 1)
  }
}

const createTag = () => {
  if (newTag.name.trim()) {
    const createdTag = addTag({
      name: newTag.name.trim(),
      color: newTag.color,
    })
    form.tags.push(createdTag.id)
    newTag.name = ''
    showTagForm.value = false
  }
}

const handleSubmit = () => {
  if (props.prompt) {
    const updated = updatePrompt(props.prompt.id, {
      title: form.title,
      content: form.content,
      tags: form.tags,
      favorite: form.favorite,
    })
    if (updated) {
      emit('submit', updated)
    }
  } else {
    const newPrompt = addPrompt({
      title: form.title,
      content: form.content,
      tags: form.tags,
      favorite: form.favorite,
    })
    emit('submit', newPrompt)
  }
}
</script>
