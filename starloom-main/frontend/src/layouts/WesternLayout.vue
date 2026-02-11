<template>
  <div class="western-layout">
    <!-- 西方版本头部 -->
    <WesternHeader />

    <!-- 主内容区域 -->
    <main class="western-main">
      <router-view />
    </main>

    <!-- 西方版本底部 -->
    <WesternFooter />
  </div>
</template>

<script>
import WesternHeader from '../components/Western/WesternHeader.vue'
import WesternFooter from '../components/Western/WesternFooter.vue'
import { trackPV, startHeartbeat, stopHeartbeat, trackToolOpen } from '../utils/analytics'

export default {
  name: 'WesternLayout',
  components: {
    WesternHeader,
    WesternFooter
  },
  methods: {
    trackRoute(route) {
      trackPV()

      const path = route?.path || ''
      let toolId = null

      if (path.startsWith('/en/tarot')) toolId = 'tarot'
      else if (path.startsWith('/en/compatibility')) toolId = 'compatibility'
      else if (path.startsWith('/en/horoscope')) toolId = 'horoscope'
      else if (path.startsWith('/en/astrology')) toolId = 'astrology'
      else if (path.startsWith('/en/numerology')) toolId = 'numerology'
      else if (path.startsWith('/en/tools')) toolId = 'western_tools'

      if (toolId) trackToolOpen(toolId)
    }
  },
  watch: {
    $route(to) {
      this.trackRoute(to)
    }
  },
  mounted() {
    startHeartbeat()
    this.trackRoute(this.$route)
  },
  beforeUnmount() {
    stopHeartbeat()
  }
}
</script>

<style scoped lang="scss">
@import '../assets/styles/western-variables.scss';

.western-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $bg-primary;
  color: $text-primary;
}

.western-main {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  
  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba($primary-gold, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: $primary-gold;
    border-radius: 4px;

    &:hover {
      background: $secondary-light-gold;
    }
  }
}
</style>
