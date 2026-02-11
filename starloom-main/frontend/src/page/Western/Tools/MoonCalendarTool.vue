<template>
  <div class="page">
    <main class="container">
      <nav class="crumb">
        <router-link to="/en">Home</router-link>
        <span>/</span>
        <router-link to="/en/tools">Tools</router-link>
        <span>/</span>
        <span>Moon Phase</span>
      </nav>

      <section class="hero">
        <h1>Moon Phase</h1>
        <p>Pick a date to estimate the moon phase for simple planning and reflection.</p>
      </section>

      <AdSlot height="120px" />

      <section class="card">
        <div class="row">
          <label>Date</label>
          <input type="date" v-model="dateStr" />
        </div>

        <button class="btn" type="button" @click="calc">Check phase</button>

        <div v-if="phase" class="result">{{ phase }}</div>
      </section>

      <AdSlot height="160px" />
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdSlot from '../../../components/Western/AdSlot.vue'
import { setSEO, setCanonical, setBreadcrumb, setHreflang } from '../../../utils/seo'

const route = useRoute()
const dateStr = ref('')
const phase = ref('')

const calcMoonPhase = (input) => {
  const d = new Date(`${input}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''

  const synodic = 29.53058867
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
  const days = (d.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24)
  const age = ((days % synodic) + synodic) % synodic

  const p = age / synodic
  const names = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent',
  ]
  const idx = Math.min(7, Math.floor((p * 8) + 0.5))
  return names[idx]
}

const calc = () => {
  if (!dateStr.value) return
  phase.value = calcMoonPhase(dateStr.value)
}

onMounted(() => {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  dateStr.value = `${d.getFullYear()}-${mm}-${dd}`
  phase.value = calcMoonPhase(dateStr.value)

  setSEO('home', {
    title: 'Moon Phase Calendar | StarLoom',
    description: 'Estimate the moon phase for any date. A simple moon phase tool for planning and reflection.',
    keywords: 'moon phase, moon calendar, lunar phase'
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Tools', url: 'https://ibazi.site/en/tools' },
    { name: 'Moon Phase', url: `https://ibazi.site${route.path}` },
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

  input {
    min-width: 240px;
    padding: 12px 12px;
    border-radius: 12px;
    border: 2px solid rgba($primary-gold, 0.18);
    background: $bg-primary;
    color: $text-primary;
  }
}

.btn {
  margin-top: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 0;
  background: $gradient-purple-gold;
  color: $text-primary;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.95rem;
}

.result {
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba($primary-gold, 0.08);
  border: 1px solid rgba($primary-gold, 0.16);
  color: rgba($text-primary, 0.92);
  font-size: 1.05rem;
  line-height: 1.75;
}
</style>
