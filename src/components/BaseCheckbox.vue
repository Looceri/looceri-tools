<template>
  <q-checkbox
    v-model="localValue"
    :label="label"
    :color="color"
    :keep-color="keepColor"
    :disable="disable"
    :dense="dense"
    :left-label="leftLabel"
    class="base-checkbox"
  />
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'primary'
  },
  keepColor: {
    type: Boolean,
    default: true
  },
  disable: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  leftLabel: {
    type: Boolean,
    default: false
  },
  innerBgColor: {
    type: String,
    default: 'white' // You can default this to any color
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Dynamically set checkbox background via CSS variable
onMounted(() => {
  const root = document.documentElement
  root.style.setProperty(`--checkbox-bg-color`, props.innerBgColor)
})

watch(() => props.innerBgColor, (newColor) => {
  document.documentElement.style.setProperty(`--checkbox-bg-color`, newColor)
})
</script>

<style scoped>
/* Inject the inner checkbox background color dynamically using CSS var */
:deep(.q-checkbox__bg) {
  background-color: var(--checkbox-bg-color) !important;
}
</style>
