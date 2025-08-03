<template>
  <q-input
    ref="inputRef"
    v-bind="computedAttrs"
    v-model="localValue"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Forward all slots from parent -->
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </q-input>
</template>

<script setup>
import { ref, computed, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: [String, Number, null],
  // New prop to control the standout effect
  standout: {
    type: [Boolean, String],
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

const isFocused = ref(false)
const inputRef = ref(null)

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const hasError = computed(() => {
  return inputRef.value?.hasError === true
})

// This computed property now dynamically builds all the attributes for QInput
const computedAttrs = computed(() => {
  const newAttrs = { ...attrs }; // Start with all attributes passed from the parent

  // Logic for standout style
  if (props.standout) {
    newAttrs.standout = isFocused.value ? 'bg-primary text-white' : '';
    newAttrs.bgColor = isFocused.value ? '' : (hasError.value ? '' : 'white');
  }
  // Logic for default filled style (if standout is false)
  else {
    newAttrs.filled = true;
    newAttrs.bgColor = hasError.value ? 'red-1' : (isFocused.value ? 'blue-1' : 'grey-2');
  }

  return newAttrs;
});


const handleFocus = (evt) => {
  isFocused.value = true
}

const handleBlur = (evt) => {
  isFocused.value = false
}

defineExpose({
  validate: () => inputRef.value?.validate(),
  resetValidation: () => inputRef.value?.resetValidation(),
  hasError
})
</script>
