<template>
  <div class="ad-slot" :style="{ height }" aria-label="Advertisement">
    <div v-if="!adEnabled" class="ad-placeholder">Ad</div>
    <div v-else ref="container" class="ad-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  height: { type: String, default: '120px' },
  adEnabled: { type: Boolean, default: false },
})

const container = ref(null)

onMounted(() => {
  if (!props.adEnabled) return
  if (!container.value) return
  // AdSense/GAM script should be injected by the site owner.
})
</script>

<style scoped>
.ad-slot {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 215, 0, 0.18);
  border-radius: 14px;
  overflow: hidden;
  position: relative;
}

.ad-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 215, 0, 0.65);
  font-weight: 700;
  letter-spacing: 1px;
}
</style>
