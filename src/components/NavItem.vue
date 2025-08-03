<template>
  <q-item
    clickable
    v-ripple
    @click="$emit('navigate', { name: item.route })"
    :active="currentRoute === item.route"
    class="modern-nav-item q-mb-xs"
    :class="{ 'nav-item-active': currentRoute === item.route }"
  >
    <q-item-section avatar class="min-width-auto q-mr-md">
      <q-icon
        :name="item.icon"
        size="20px"
        :class="currentRoute === item.route ? 'text-primary' : 'text-grey-7'"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label
        class="text-body2"
        :class="currentRoute === item.route ? 'text-primary text-weight-medium' : 'text-black'"
      >
        {{ item.label }}
      </q-item-label>
      <q-item-label
        caption
        class="text-caption"
        :class="currentRoute === item.route ? 'text-primary' : 'text-grey-6'"
        v-if="item.caption"
      >
        {{ item.caption }}
      </q-item-label>
    </q-item-section>

    <q-item-section side v-if="item.badge">
      <q-badge
        :color="currentRoute === item.route ? 'primary' : 'grey-4'"
        :text-color="currentRoute === item.route ? 'white' : 'grey-7'"
        class="text-caption"
      >
        {{ item.badge }}
      </q-badge>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  currentRoute: {
    type: String,
    default: ''
  }
});

defineEmits(['navigate']);
</script>

<style scoped>
/* Styles specific to the navigation item now live with the component */
.modern-nav-item {
  border-radius: 12px;
  margin: 0 8px;
  transition: all 0.2s ease;
  background: transparent;
}

.modern-nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.nav-item-active {
  background: rgba(var(--q-primary-rgb), 0.2) !important;
  border-left: 3px solid var(--q-primary);
}

.nav-item-active:hover {
  background: rgba(var(--q-primary-rgb), 0.25) !important;
}
</style>
