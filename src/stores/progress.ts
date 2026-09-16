import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { availableLessons, totalTopics } from '@/data/modules'
export const progressKey = 'vue-playground:progress:v1'
export const useProgressStore = defineStore('progress', () => {
  const mastered = ref<string[]>([])
  const storageError = ref(false)
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(progressKey) || '[]')
    if (Array.isArray(saved))
      mastered.value = [
        ...new Set(
          saved.filter(
            (id): id is string => typeof id === 'string' && availableLessons.includes(id),
          ),
        ),
      ]
  } catch {
    storageError.value = true
  }
  const percent = computed(() => Math.round((mastered.value.length / totalTopics) * 100))
  function toggle(id: string) {
    if (!availableLessons.includes(id)) return
    mastered.value = mastered.value.includes(id)
      ? mastered.value.filter((item) => item !== id)
      : [...mastered.value, id]
    try {
      localStorage.setItem(progressKey, JSON.stringify(mastered.value))
      storageError.value = false
    } catch {
      storageError.value = true
    }
  }
  function count(moduleId: string) {
    return mastered.value.filter((id) => id.startsWith(`${moduleId}/`)).length
  }
  return { mastered, percent, storageError, toggle, count }
})
