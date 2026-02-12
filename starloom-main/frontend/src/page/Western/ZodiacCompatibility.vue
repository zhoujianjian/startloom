<template>
  <div class="page">
    <main class="container">
      <section class="hero">
        <h1>Zodiac Compatibility</h1>
        <p>Check love compatibility for any two zodiac signs. Fast, free, mobile-friendly.</p>
      </section>

      <AdSlot height="120px" />

      <section class="picker">
        <div class="grid">
          <div class="field">
            <label>Sign A</label>
            <select v-model="signA">
              <option v-for="s in signs" :key="s.key" :value="s.key">{{ s.name }}</option>
            </select>
          </div>
          <div class="field">
            <label>Sign B</label>
            <select v-model="signB">
              <option v-for="s in signs" :key="s.key" :value="s.key">{{ s.name }}</option>
            </select>
          </div>
        </div>

        <div class="actions">
          <button class="btn" @click="go">View Compatibility</button>
          <button class="btn secondary" @click="swap">Swap</button>
        </div>
      </section>

      <section class="seo">
        <h2>Popular pairings</h2>
        <div class="chips">
          <router-link
            v-for="p in popularPairs"
            :key="p.path"
            class="chip"
            :to="p.path"
          >
            {{ p.label }}
          </router-link>
        </div>
      </section>

      <AdSlot height="160px" />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import AdSlot from '../../components/Western/AdSlot.vue'
import { setSEO, setCanonical, setBreadcrumb, setHreflang } from '../../utils/seo'

const router = useRouter()
const route = useRoute()

const signs = [
  { key: 'aries', name: 'Aries' },
  { key: 'taurus', name: 'Taurus' },
  { key: 'gemini', name: 'Gemini' },
  { key: 'cancer', name: 'Cancer' },
  { key: 'leo', name: 'Leo' },
  { key: 'virgo', name: 'Virgo' },
  { key: 'libra', name: 'Libra' },
  { key: 'scorpio', name: 'Scorpio' },
  { key: 'sagittarius', name: 'Sagittarius' },
  { key: 'capricorn', name: 'Capricorn' },
  { key: 'aquarius', name: 'Aquarius' },
  { key: 'pisces', name: 'Pisces' },
]

const signA = ref('aries')
const signB = ref('leo')

const go = () => {
  router.push(`/en/compatibility/${signA.value}/${signB.value}`)
}

const swap = () => {
  const tmp = signA.value
  signA.value = signB.value
  signB.value = tmp
}

const popularPairs = computed(() => {
  const pairs = [
    ['aries', 'leo'],
    ['taurus', 'virgo'],
    ['gemini', 'libra'],
    ['cancer', 'pisces'],
    ['leo', 'sagittarius'],
    ['scorpio', 'capricorn'],
  ]
  return pairs.map(([a, b]) => {
    const aName = signs.find(s => s.key === a)?.name || a
    const bName = signs.find(s => s.key === b)?.name || b
    return {
      label: `${aName} + ${bName}`,
      path: `/en/compatibility/${a}/${b}`,
    }
  })
})

onMounted(() => {
  setSEO('home', {
    title: 'Zodiac Compatibility (12 Signs) | StarLoom',
    description: 'Check zodiac compatibility for any two signs. Get a quick score, strengths, challenges, and practical tips — free and mobile-friendly.',
    keywords: 'zodiac compatibility, astrology compatibility, love compatibility, star sign compatibility'
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Compatibility', url: 'https://ibazi.site/en/compatibility' }
  ])
})
</script>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';

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

.hero {
  text-align: left;
  margin-bottom: 18px;

  h1 {
    font-size: 2.05rem;
    margin: 0 0 8px;
  }

  p {
    margin: 0;
    color: $text-secondary;
    font-size: 1.05rem;
    line-height: 1.7;
  }
}

.picker {
  margin-top: 18px;
  background: $bg-secondary;
  border: 1px solid rgba($primary-gold, 0.12);
  border-radius: 18px;
  padding: 16px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    color: $text-secondary;
    font-size: 1.02rem;
    font-weight: 700;
  }

  select {
    width: 100%;
    padding: 12px 12px;
    border-radius: 12px;
    border: 2px solid rgba($primary-gold, 0.18);
    background: $bg-primary;
    color: $text-primary;
    font-size: 1.02rem;
  }
}

.actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 16px;
  border-radius: 12px;
  border: 0;
  background: $gradient-purple-gold;
  color: $text-primary;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
}

.btn.secondary {
  background: rgba($primary-gold, 0.12);
  border: 1px solid rgba($primary-gold, 0.2);
}

.seo {
  margin-top: 22px;

  h2 {
    font-size: 1.25rem;
    margin: 0 0 10px;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  padding: 10px 12px;
  background: rgba($primary-gold, 0.08);
  border: 1px solid rgba($primary-gold, 0.18);
  border-radius: 999px;
  color: $text-primary;
  text-decoration: none;
  font-size: 1.02rem;
}

@media (min-width: 720px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
