<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="space-y-2">
      <Label for="title">Title</Label>
      <Input id="title" v-model="form.title" type="text" placeholder="Prompt title" required />
    </div>

    <div class="space-y-2">
      <Label for="content">Content</Label>
      <Textarea
        id="content"
        v-model="form.content"
        class="h-40"
        placeholder="Write your prompt here..."
        required
      />
    </div>

    <div class="space-y-2">
      <Label>Tags</Label>
      <Popover v-model:open="tagsPopoverOpen">
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            role="combobox"
            :aria-expanded="tagsPopoverOpen"
            class="w-full justify-between whitespace-nowrap"
          >
            {{ form.tags.length > 0 ? `${form.tags.length} selected` : 'Select Tags...' }}
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  v-for="tag in availableTags"
                  :key="tag.id"
                  :value="tag.id"
                  @select="handleTagSelect(tag.id)"
                >
                  <Check
                    :class="
                      cn('mr-2 h-4 w-4', form.tags.includes(tag.id) ? 'opacity-100' : 'opacity-0')
                    "
                  />
                  <span
                    class="mr-2 h-2 w-2 rounded-full"
                    :style="{ backgroundColor: tag.color }"
                  ></span>
                  {{ tag.name }}
                </CommandItem>
                <!-- Option to add tag creation item here later -->
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <!-- Display Selected Tags Below -->
      <div v-if="form.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
        <Badge
          v-for="tagId in form.tags"
          :key="tagId"
          variant="secondary"
          class="flex items-center border pr-1"
          :style="{
            backgroundColor: getTagColor(tagId),
            color: 'white',
            borderColor: getTagColor(tagId),
          }"
        >
          <span class="mr-1">{{ getTagName(tagId) }}</span>
          <button
            type="button"
            class="ml-auto h-4 w-4 rounded-full text-white/70 transition-colors hover:text-white focus:outline-none focus:ring-1 focus:ring-white/50"
            @click.stop="handleTagSelect(tagId)"
            aria-label="Remove tag"
          >
            <X class="h-3 w-3" />
          </button>
        </Badge>
      </div>
    </div>

    <!-- Removed inline tag creation form -->

    <div class="flex justify-end space-x-3 pt-4">
      <Button type="button" variant="outline" @click="$emit('cancel')">Cancel</Button>
      <Button type="submit"> {{ props.prompt ? 'Update' : 'Create' }} Prompt </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Check, ChevronsUpDown, X } from 'lucide-vue-next'
import type { Prompt } from '@/lib/types'
import { addPrompt, updatePrompt, tags } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const props = defineProps<{ prompt?: Prompt }>()

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

const tagsPopoverOpen = ref(false)

const availableTags = computed(() => tags.value)

onMounted(() => {
  if (props.prompt) {
    form.title = props.prompt.title
    form.content = props.prompt.content
    form.tags = [...props.prompt.tags]
    form.favorite = props.prompt.favorite
  }
})

const handleTagSelect = (tagId: string) => {
  if (!tagId) return
  const index = form.tags.indexOf(tagId)
  if (index === -1) {
    form.tags.push(tagId)
  } else {
    form.tags.splice(index, 1)
  }
}

const handleSubmit = () => {
  if (props.prompt) {
    const updated = updatePrompt(props.prompt.id, { ...form })
    if (updated) emit('submit', updated)
  } else {
    const newPrompt = addPrompt({ ...form })
    emit('submit', newPrompt)
  }
}

const getTagName = (tagId: string): string => {
  return availableTags.value.find((t) => t.id === tagId)?.name || 'Unknown'
}

const getTagColor = (tagId: string): string => {
  return availableTags.value.find((t) => t.id === tagId)?.color || '#888888'
}
</script>
