<template>
  <div class="page">
    <main class="container">
      <nav class="crumb">
        <router-link to="/en">Home</router-link>
        <span>/</span>
        <router-link to="/en/tools">Tools</router-link>
        <span>/</span>
        <span>Meditation Timer</span>
      </nav>

      <section class="hero">
        <h1>Meditation Timer</h1>
        <p>Pick a duration and start a simple, distraction-free meditation countdown.</p>
      </section>

      <AdSlot height="120px" />

      <section class="card">
        <div class="row">
          <label>Duration</label>
          <select v-model.number="duration">
            <option :value="3">3 min</option>
            <option :value="5">5 min</option>
            <option :value="10">10 min</option>
            <option :value="15">15 min</option>
          </select>
        </div>

        <div class="timer">
          <div class="time">{{ formatSeconds(remaining ?? duration * 60) }}</div>
          <div class="hint">Breathe slowly. Relax your shoulders. Return to your breath.</div>
        </div>

        <div class="actions">
          <button class="btn" type="button" @click="start" :disabled="running">Start</button>
          <button class="btn secondary" type="button" @click="stop" :disabled="!running">Stop</button>
        </div>
      </section>

      <AdSlot height="160px" />
    </main>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdSlot from '../../../components/Western/AdSlot.vue'
import { setSEO, setCanonical, setBreadcrumb, setHreflang } from '../../../utils/seo'

const route = useRoute()
const duration = ref(5)
const remaining = ref(null)
const running = ref(false)
let timer = null

const formatSeconds = (s) => {
  const n = Math.max(0, Number(s || 0))
  const m = Math.floor(n / 60)
  const ss = String(n % 60).padStart(2, '0')
  return `${m}:${ss}`
}

const start = () => {
  if (running.value) return
  remaining.value = Math.max(1, Number(duration.value || 5)) * 60
  running.value = true
  timer = window.setInterval(() => {
    if (remaining.value === null) return
    remaining.value -= 1
    if (remaining.value <= 0) {
      stop()
      remaining.value = 0
    }
  }, 1000)
}

const stop = () => {
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
  running.value = false
}

onBeforeUnmount(() => {
  stop()
})

onMounted(() => {
  setSEO('home', {
    title: 'Meditation Timer | StarLoom',
    description: 'A simple meditation timer with a clean countdown. Choose 3, 5, 10, or 15 minutes and start breathing.',
    keywords: 'meditation timer, breathing, mindfulness, calm'
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Tools', url: 'https://ibazi.site/en/tools' },
    { name: 'Meditation Timer', url: `https://ibazi.site${route.path}` },
  ])
})
</script>

<style scoped lang="scss">
@import '../../../assets/scss/main.scss';

.page {
  background: $bg-primary;
  color: $text-primary;
  min-height: 100vh;
}

.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 22px 16px 60px;
}

.crumb {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: $text-secondary;
  margin-bottom: 12px;

  a {
    color: $text-secondary;
    text-decoration: none;
  }
}

.hero {
  margin-bottom: 18px;

  h1 {
    margin: 0 0 8px;
    font-size: 1.9rem;
  }

  p {
    margin: 0;
    color: $text-secondary;
    font-size: 1rem;
    line-height: 1.7;
  }
}

.card {
  margin-top: 18px;
  background: $bg-secondary;
  border: 1px solid rgba($primary-gold, 0.12);
  border-radius: 18px;
  padding: 16px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  label {
    font-weight: 700;
    font-size: 1rem;
  }

  select {
    min-width: 240px;
    padding: 12px 12px;
    border-radius: 12px;
    border: 2px solid rgba($primary-gold, 0.18);
    background: $bg-primary;
    color: $text-primary;
  }
}

.timer {
  margin-top: 14px;
  padding: 18px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba($primary-gold, 0.14);

  .time {
    font-size: 2.4rem;
    font-weight: 800;
    color: $primary-gold;
    text-align: center;
    letter-spacing: 1px;
  }

  .hint {
    margin-top: 10px;
    text-align: center;
    color: rgba($text-primary, 0.88);
    line-height: 1.7;
  }
}

.actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 16px;
  border-radius: 12px;
  border: 0;
  background: $gradient-purple-gold;
  color: $text-primary;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn.secondary {
  background: rgba($primary-gold, 0.12);
  border: 1px solid rgba($primary-gold, 0.2);
}
</style>
