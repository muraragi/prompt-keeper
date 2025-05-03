<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { Search, Star, Check, ChevronsUpDown, X } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import type { Tag } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  tags: Tag[]
  initialSearch?: string
  initialSelectedTags?: string[]
  initialFavoritesOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialSearch: '',
  initialSelectedTags: () => [],
  initialFavoritesOnly: false,
})

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:tags', value: string[]): void
  (e: 'update:favorites', value: boolean): void
}>()

const searchQuery = ref(props.initialSearch)
const selectedTags = ref<string[]>([...props.initialSelectedTags])
const favoritesOnly = ref(props.initialFavoritesOnly)
const openTagsPopover = ref(false)

const handleTagSelect = (tagId: string) => {
  if (!tagId) return
  const index = selectedTags.value.indexOf(tagId)
  if (index === -1) {
    selectedTags.value = [...selectedTags.value, tagId]
  } else {
    selectedTags.value = selectedTags.value.filter((id) => id !== tagId)
  }
}

const toggleFavoriteFilter = () => {
  favoritesOnly.value = !favoritesOnly.value
  emit('update:favorites', favoritesOnly.value)
}

watch(selectedTags, (newVal) => {
  emit('update:tags', newVal)
})

watch(searchQuery, (newVal) => {
  emit('update:search', newVal)
})

const getTagName = (tagId: string): string => {
  return props.tags.find((t) => t.id === tagId)?.name || 'Unknown'
}

const getTagColor = (tagId: string): string => {
  return props.tags.find((t) => t.id === tagId)?.color || '#888888'
}
</script>

<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
    <div class="relative flex-grow min-w-[250px]">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        v-model="searchQuery"
        type="text"
        placeholder="Search prompts..."
        class="w-full pl-10"
      />
    </div>

    <div class="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
      <span class="text-nowrap text-sm text-muted-foreground">Filter by:</span>

      <Popover v-model:open="openTagsPopover">
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            role="combobox"
            :aria-expanded="openTagsPopover"
            class="w-[200px] justify-between whitespace-nowrap"
          >
            Select Tags...
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  v-for="tag in tags"
                  :key="tag.id"
                  :value="tag.id"
                  @select="handleTagSelect(tag.id)"
                >
                  <Check
                    :class="
                      cn(
                        'mr-2 h-4 w-4',
                        selectedTags.includes(tag.id) ? 'opacity-100' : 'opacity-0',
                      )
                    "
                  />
                  <span
                    class="mr-2 h-2 w-2 rounded-full"
                    :style="{ backgroundColor: tag.color }"
                  ></span>
                  {{ tag.name }}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div class="flex flex-wrap items-center gap-1">
        <Badge
          v-for="tagId in selectedTags"
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

      <Button
        @click="toggleFavoriteFilter"
        variant="outline"
        size="sm"
        class="whitespace-nowrap"
        :class="favoritesOnly ? 'border-amber-500 bg-amber-500 text-white hover:bg-amber-600' : ''"
      >
        <Star :size="16" class="mr-1 shrink-0" :fill="favoritesOnly ? 'currentColor' : 'none'" />
        Favorites
      </Button>
    </div>
  </div>
</template>
