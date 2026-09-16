<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })
const paths: Record<string, string> = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  pulse: 'M2 12h4l3-8 5 16 3-8h5',
  message: 'M21 11a8 8 0 0 1-8 8H7l-4 3V11a9 9 0 0 1 18 0Z M7 9h10 M7 13h6',
  layers: 'm12 3 10 5-10 5L2 8Z M2 12l10 5 10-5 M2 16l10 5 10-5',
  cycle: 'M20 7a9 9 0 1 0 1 8 M20 2v5h-5',
  box: 'm12 2 9 5v10l-9 5-9-5V7Z M3 7l9 5 9-5 M12 12v10 M7 4l9 5',
  terminal: 'm5 7 5 5-5 5 M13 17h6',
  code: 'm8 6-6 6 6 6 M16 6l6 6-6 6 M14 3l-4 18',
  route: 'M6 3v12a4 4 0 0 0 8 0V9a4 4 0 0 1 4-4h3 M17 2l4 3-4 3 M3 3h6',
  database:
    'M20 6c0 2-4 4-8 4S4 8 4 6s4-4 8-4 8 2 8 4Z M4 6v12c0 2 4 4 8 4s8-2 8-4V6 M4 12c0 2 4 4 8 4s8-2 8-4',
  bolt: 'M13 2 3 14h8l-1 8 11-13h-8Z',
  board: 'M3 4h18v16H3z M9 4v16 M15 4v16 M5 8h2 M11 8h2 M17 8h2',
  chart: 'M4 3v18h17 M8 16v-4 M13 16V8 M18 16V4',
  book: 'M12 5C8 2 4 3 2 4v15c3-2 7-1 10 1 3-2 7-3 10-1V4c-2-1-6-2-10 1Z M12 5v15',
  search: 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z m-1 5 6 6',
  arrow: 'M4 12h16 m-6-6 6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  menu: 'M3 6h18 M3 12h18 M3 18h18',
  panel: 'M3 4h18v16H3z M9 4v16',
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M5 19l1-1 M18 6l1-1',
  moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',
  monitor: 'M2 3h20v14H2z M8 21h8 M12 17v4',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12 M6 18 18 6',
  flask: 'M8 2h8 M9 2v7L3 19q-1 3 3 3h12q4 0 3-3L15 9V2 M7 14h10',
  external: 'M14 3h7v7 M21 3 10 14 M10 3H3v18h18v-7',
}
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.box" />
  </svg>
</template>
