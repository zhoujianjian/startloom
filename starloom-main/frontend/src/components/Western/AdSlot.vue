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
  adClient: { type: String, default: 'ca-pub-5705952888943906' },
  adSlot: { type: String, default: '' },
  format: { type: String, default: 'auto' },
  fullWidthResponsive: { type: Boolean, default: true },
})

const container = ref(null)

onMounted(() => {
  if (!props.adEnabled) return
  if (!container.value) return

  if (!props.adSlot) return
  const ins = document.createElement('ins')
  ins.className = 'adsbygoogle'
  ins.style.display = 'block'
  ins.setAttribute('data-ad-client', props.adClient)
  ins.setAttribute('data-ad-slot', props.adSlot)
  ins.setAttribute('data-ad-format', props.format)
  ins.setAttribute('data-full-width-responsive', props.fullWidthResponsive ? 'true' : 'false')
  container.value.innerHTML = ''
  container.value.appendChild(ins)

  if (typeof window !== 'undefined') {
    window.adsbygoogle = window.adsbygoogle || []
    try {
      window.adsbygoogle.push({})
    } catch (e) {
    }
  }
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
