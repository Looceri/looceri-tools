<template>
  <div>
    <UInput
      v-model="newTag"
      :label="$t('tags')"
      @keyup.enter="addTag"
      @blur="addTag"
    />
    <div class="q-mt-sm">
      <q-chip
        v-for="(tag) in tags"
        :key="tag.label"
        :style="{ backgroundColor: tag.color, color: 'white' }"
        removable
        @remove="removeTag(tag.label)"
      >
        {{ tag.label }}
      </q-chip>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import UInput from "./UInput.vue";

export default {
  props: {
    modelValue: {
      type: [Array, String], // Accepts both array and string inputs
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const newTag = ref("");
    const tagColors = ref({}); // Stores color for each tag
    const availableColors = ref([
      "#e57373", "#64b5f6", "#81c784", "#ffb74d", "#ba68c8",
      "#f06292", "#4db6ac", "#ff8a65", "#7986cb", "#a1887f"
    ]); // Expanded color set

    const tags = computed(() => {
      const value = Array.isArray(props.modelValue)
        ? props.modelValue
        : props.modelValue
          ? props.modelValue.split(",").map(tag => tag.trim())
          : [];

      return value.map(tag => ({
        label: tag,
        color: tagColors.value[tag] || assignColor(tag),
      }));
    });

    function assignColor(tag) {
      if (!tagColors.value[tag]) {
        const recentColors = tags.value.slice(-4).map(t => t.color); // Get last 4 tag colors
        let available = availableColors.value.filter(color => !recentColors.includes(color));

        if (available.length === 0) {
          available = availableColors.value; // If all colors are used, reset choice
        }

        tagColors.value[tag] = available[Math.floor(Math.random() * available.length)];
      }
      return tagColors.value[tag];
    }

    function addTag() {
      const trimmedTag = newTag.value.trim();
      if (trimmedTag && !tags.value.some(tag => tag.label === trimmedTag)) {
        tagColors.value[trimmedTag] = assignColor(trimmedTag);
        const updatedTags = [...tags.value.map(t => t.label), trimmedTag];
        emit("update:modelValue", updatedTags);
      }
      newTag.value = "";
    }

    function removeTag(tagLabel) {
      delete tagColors.value[tagLabel]; // Free up the color when a tag is removed
      const updatedTags = tags.value.map(t => t.label).filter(tag => tag !== tagLabel);
      emit("update:modelValue", updatedTags);
    }

    return { newTag, tags, addTag, removeTag };
  },
};
</script>
